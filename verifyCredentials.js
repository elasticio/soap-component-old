'use strict';
const soap = require('soap');

// This function will be called by the platform to verify credentials
module.exports = function verifyCredentials(credentials, cb) {
    console.log('Credentials passed for verification %j', credentials);
    return soap.createClientAsync(url);
};
