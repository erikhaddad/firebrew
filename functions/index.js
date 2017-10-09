'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const orders = require('./orders');
const patrons = require('./patrons');

module.exports = {
    orderCreate: orders.orderCreate,
    orderUpdate: orders.orderChange,
    patronCreate: patrons.patronCreate
};