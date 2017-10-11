'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');

let OrderStatus = {
    PENDING: 1,
    ORDERED: 2,
    PROCESSING: 3,
    COMPLETED: 4,
    CANCELLED: 5,
    DECLINED: 6,
    INCOMPLETE: 7,
    PREORDERED: 8,
    QUOTED: 9
};

exports.orderCreate = functions.firestore
    .document('orders/{orderId}')
    .onCreate(event => {
        // Get an object representing the document
        const data = event.data.data();

        // access a particular field as you would any JS property
        let status = data.status;
        let createdAt = admin.database.ServerValue.TIMESTAMP;

        let db = admin.firestore();
        let ordersRef = db.collection('orders');
        let statesRef = db.collection('states');

        if (status !== OrderStatus.ORDERED) {
            console.log('order status not ORDERED');
            return false;
        }

        // If there are no other orders being processed at time of creation, set the
        // new order to the current order to be processed
        console.log('entering where query');
        return ordersRef.where('status', '==', OrderStatus.PROCESSING)
            .get()
            .then(snapshot => {
                console.log('snapshot', snapshot);

                if (snapshot.docs.length === 0) {
                    console.log('found that no orders are being processed.', data);
                    // set initial values
                    data.status = OrderStatus.PROCESSING;
                    data.progress = 0;

                    console.log('setting original order status');
                    // set status on original order
                    let orderUpdate = event.data.ref.set(data);

                    console.log('setting current tap state');
                    let tapUpdate = db.collection('states')
                        .doc('tap')
                        .set({isPouring: true});

                    console.log('setting current order state');
                    // move new order to current order to be processed
                    let stateUpdate = statesRef.doc('order').set(data);

                    return Promise.all([orderUpdate, tapUpdate, stateUpdate])
                                    .then(() => console.log('Updated order, tap, and state. Exiting now!'));
                } else {
                    console.log('snapshot docs length', snapshot.docs.length);
                }
            })
            .catch(err => {
                console.log('Error getting orders being processed', err);
            });
    });

exports.orderChange = functions.firestore
    .document('orders/{orderId}')
    .onUpdate((event) => {
        console.log('patron order update event', event);

        // Retrieve the current and previous value
        const data = event.data.data();
        const previousData = event.data.previous.data();

        let status = data.status;
        let progress = data.progress;

        // We'll only update if the status and progress have changed.
        // This is crucial to prevent infinite loops.
        if (status === previousData.status &&
            progress === previousData.progress) {

            console.log('patron order status samesies');
            return false;
        }

        let db = admin.firestore();
        let ordersRef = db.collection('orders');
        let statesRef = db.collection('states');

        // Order has completed so move the next order on to processed, if any exist
        if (status === OrderStatus.COMPLETED &&
            previousData.status === OrderStatus.PROCESSING) {

            return ordersRef.where('status', '==', OrderStatus.ORDERED)
                .get()
                .then(snapshot => {
                    if (snapshot.length > 0) {
                        // sort snapshot by createdAt
                        let sortedOrders = snapshot.sort((a,b) => {
                            return (a.createdAt > b.createdAt) ? 1 : ((b.createdAt > a.createdAt) ? -1 : 0);
                        });

                        // take first element
                        let orderForProcessing = sortedOrders[0];

                        // set initial values
                        orderForProcessing.status = OrderStatus.PROCESSING;
                        orderForProcessing.progress = 0;

                        // move new order to current order to be processed
                        let stateOrderUpate = statesRef.doc('order').set(orderForProcessing);
                        let stateTapUpdate = statesRef.doc('tap').set({isPouring: true});

                        // update
                        let orderUpdate = ordersRef.document(orderForProcessing.id).set(orderForProcessing);

                        return Promise.all([stateOrderUpate, stateTapUpdate, orderUpdate])
                            .then(() => console.log('Updated state order, tap, and order. Exiting now!'));
                    }
                })
                .catch(err => {
                    console.log('Error finding orders', err);
                });
        } else {
            return false;
        }
    });
