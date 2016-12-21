var soap = require('soap');
(function () {
  'use strict';
  describe('Given sample WSDL we can ', function () {
    it('create client with it and proof that it is correctly represented', function (done) {
      soap.createClient(__dirname + '/data/HelloWorldCXF.wsdl', function (err, client) {
        expect(err).toBeNull();
        const description = client.describe();

        const services = Object.keys(description);
        expect(services).toEqual(['SOAPServiceGreeting', 'SOAPServiceGreeting2']);

        const service = description[services[0]];
        const ports = Object.keys(service);
        expect(ports).toEqual(['SoapPortName', 'SoapPortName2']);

        done();
      });
    });

    it('parse QueryCustomerIn.wsdl from SAP ByD', function (done) {
      soap.createClient(__dirname + '/data/sapbyd/QueryCustomerIn.wsdl', function (err, client) {
        expect(err).toBeNull();
        const description = client.describe();

        const services = Object.keys(description);
        expect(services).toEqual(['service']);

        const service = description[services[0]];
        const ports = Object.keys(service);
        expect(ports).toEqual(['binding_SOAP12', 'binding']);

        //console.log(service.binding_SOAP12.FindByElements.input.CustomerSelectionByElements);
        done();
      });
    });

  });
})();
