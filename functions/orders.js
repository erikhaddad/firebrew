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
    .document('users/{userId}')
    .onCreate(event => {
        // Get an object representing the document
        const data = event.data.data();

        // access a particular field as you would any JS property
        let status = data.status;
        let createdAt = admin.database.ServerValue.TIMESTAMP;

        if (status === OrderStatus.PROCESSING) {
            return;
        }

        status = OrderStatus.PROCESSING;

        // Then return a promise of a set operation to update the count
        return event.data.ref.set({
            createdAt: createdAt,
            status: status
        }, {merge: true});
    });

exports.orderChange = functions.firestore
    .document('orders/{orderId}')
    .onUpdate((event) => {
        // Retrieve the current and previous value
        const data = event.data.data();
        const previousData = event.data.previous.data();

        // We'll only update if the progress has changed.
        // This is crucial to prevent infinite loops.
        if (data.status === previousData.status &&
            data.progress === previousData.progress) {
            return;
        }

        let status = data.status;
        let progress = data.progress;

        if (status === OrderStatus.ORDERED) {

        }

        if (progress >= 100) {
            progress = 100;
            status = OrderStatus.COMPLETED;
        }

        // Then return a promise of a set operation to update the count
        return event.data.ref.set({
            progress: progress,
            status: status
        }, {merge: true});
    });