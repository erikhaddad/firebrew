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

exports.orderChange = functions.firestore
    .document('states/order')
    .onUpdate((event) => {
        console.log('state order update event', event);

        // Retrieve the current and previous value
        const data = event.data.data();
        const previousData = event.data.previous.data();

        console.log('function data', data);

        let db = admin.firestore();

        // The current order was cleared, so clear tap and
        // mug values as well
        if (data.id === '') {
            console.log('Current order has been reset.');

            let tapUpdate = db.collection('states')
                .doc('tap')
                .set({isPouring: false});

            let mugUpdate = db.collection('states')
                .doc('mug')
                .set({alpha: 0, beta: 0, gamma: 0});

            return Promise.all([tapUpdate, mugUpdate])
                            .then(() => console.log('Updated tap and mug. Exiting now!'));
        }

        // Avoid infinite loop
        if (data.id === previousData.id &&
            data.progress === previousData.progress &&
            data.status === previousData.status) {

            console.log('Nothing has changed');

            return false;
        }

        if (data.status === OrderStatus.PROCESSING) {
            console.log('found an order that is processing', data);

            if (data.progress === 0) {
                // Simulate filling time
                console.log('Simulating fill time');

                let tapUpdate = db.collection('states')
                    .doc('tap')
                    .set({isPouring: true});

                let mugUpdate = db.collection('states')
                    .doc('mug')
                    .set({alpha: 0, beta: 0, gamma: 0});

                let fillSimulation = simulateFill(event.data.ref);

                return Promise.all([tapUpdate, mugUpdate, fillSimulation])
                                .then(() => console.log('Updated tap, mug, and fill. Exiting now!'));

            } else if (data.progress === 100) {
                // Simulation of fill has finished
                // Change status to COMPLETED
                data.status = OrderStatus.COMPLETED;

                // Reset the current order
                let stateOrderUpdate = event.data.ref.set({
                    id: '',
                    patronId: '',
                    name: '',
                    avatar: '',
                    createdAt: '',
                    cost: 0,
                    status: 0,
                    progress: 0
                });

                // This gets handled by the reset but the redundancy ensures no spills
                let tapUpdate = db.collection('states')
                    .doc('tap')
                    .set({isPouring: false});

                // Get reference to original order
                let orderRef = db.collection('orders').doc(data.id);
                console.log('Setting status on original order');

                // Update
                let orderUpdate = orderRef.set(data);

                return Promise.all([stateOrderUpdate, tapUpdate, orderUpdate])
                                .then(() => console.log('Updated state and order. Exiting now!'));
            }
        }
    });

function simulateFill (orderRef) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            orderRef
                .set({progress: 100}, {merge: true})
                .then(resolve, reject);
        }, 5000);
    });
}
