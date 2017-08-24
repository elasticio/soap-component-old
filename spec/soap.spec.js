const soap = require('soap');
const assert = require('assert');
const expect = require('chai').expect;

describe('Given coplex WSDL ', function () {
    it('parse QueryCustomerIn.wsdl from SAP ByD', function () {
        return soap.createClientAsync(__dirname + '/data/sapbyd/QueryCustomerIn.wsdl').then((client) => {
            const description = client.describe();

            const services = Object.keys(description);
            assert.deepEqual(services,['service']);

            const service = description[services[0]];
            const ports = Object.keys(service);
            assert.deepEqual(ports, ['binding_SOAP12', 'binding']);
        });
    });
});
