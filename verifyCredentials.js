'use strict';
const soap = require('soap');

// This function will be called by the platform to verify credentials
module.exports = function verifyCredentials(credentials, cb) {
  console.log('Credentials passed for verification %j', credentials);
  soap.createClient(credentials.wsdlURI, function(err,result) {
    if (err) {
      cb(err, {verified: false});
    } else {
      cb(null, {verified: true});
    }
  });
};
