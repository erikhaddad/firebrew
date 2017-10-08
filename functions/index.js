'use strict';

const orders = require('./orders');
const patrons = require('./patrons');

module.exports = {
    orderUpdate: orders.orderChange,
    patronCreate: patrons.patronCreate
};