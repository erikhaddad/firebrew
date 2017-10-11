'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const orders = require('./orders');
const patrons = require('./patrons');
const states = require('./states');

module.exports = {
    orderCreate: orders.orderCreate,
    orderChange: orders.orderChange,
    patronCreate: patrons.patronCreate,
    stateOrderChange: states.orderChange
};