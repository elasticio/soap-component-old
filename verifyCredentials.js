'use strict';
const soap = require('soap');

// This function will be called by the platform to verify credentials
module.exports = function verifyCredentials(credentials) {
    console.log('Credentials passed for verification %j', credentials);
    const wsdlURI = credentials.wsdlURI;
    return soap.createClientAsync(wsdlURI);
};
