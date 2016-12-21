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
  });
})();
