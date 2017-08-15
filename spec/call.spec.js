const soap = require('soap');
const assert = require('assert');
const expect = require('chai').expect;
const action = require('../lib/actions/call');

describe('Given complex WSDL we can ', function () {
    it('list operations', function () {
        return action.getOperations({
            wsdlURI: __dirname + '/data/sapbyd/QueryCustomerIn.wsdl'
        }).then((result) => {
            assert.equal(Object.keys(result).length, 6);
            assert.equal(Object.keys(result)[0], "service.binding_SOAP12.FindByIdentification");
        });
    });
});

describe('Given sample WSDL', function() {
    "use strict";

});
