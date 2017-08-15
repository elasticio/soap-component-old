const soap = require('soap');
const action = require('../lib/actions/call');

(function () {
  'use strict';
  describe('Given simple WSDL we can ', function () {
    xit('list operations', function (done) {
      action.getOperations({
        wsdlURI: __dirname + '/data/HelloWorldCXF.wsdl'
      }, function (err, result) {
        expect(err).toBeNull();
        expect(Object.keys(result).length).toEqual(4);
        expect(Object.keys(result)[0]).toEqual("SOAPServiceGreeting.SoapPortName.sayHi");
        done();
      });
    });

    it('fetch metadata', function (done) {
      action.getMetaModel({
        wsdlURI: __dirname + '/data/HelloWorldCXF.wsdl',
        operation: "SOAPServiceGreeting.SoapPortName.greetMe"
      }, function (err, result) {
        expect(err).toBeNull();
        expect(result).toBeTruthy();
        console.log(result.input);
        //console.log(toJSONSchema(result.input));
        // const input = result.in;
        // const out = result.out;
        // expect(input).toBeTruthy();
        // expect(out).toBeTruthy();
        done();
      });
    });

  });

  describe('Given complex WSDL we can ', function () {
    xit('list operations', function (done) {
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
