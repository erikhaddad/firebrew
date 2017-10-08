'use strict';

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

exports.patronCreate = functions.auth.user().onCreate(event => {
    const patron = event.data; // The Firebase user.

    console.log('new patron data', patron);

    const newPatron = {
        'id': patron.uid,
        'name': patron.displayName,
        'email': patron.email,
        'avatar': patron.photoURL,
        'created': patron.metadata.creationTime
    };

    return admin.firestore().collection('patrons')
                            .doc(patron.uid)
                            .set(newPatron);
});
