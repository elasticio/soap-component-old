const soap = require('soap');
const action = require('../lib/actions/call');

(function () {
  'use strict';
  describe('Given sample WSDL we can ', function () {
    it('list operations', function (done) {
      action.getOperations({
        wsdlURI: __dirname + '/data/sapbyd/QueryCustomerIn.wsdl'
      }, function (err, result) {
        expect(err).toBeNull();
        expect(Object.keys(result).length).toEqual(6);
        expect(Object.keys(result)[0]).toEqual("service.binding_SOAP12.FindByIdentification");
        done();
      });
    });
  });
})();
