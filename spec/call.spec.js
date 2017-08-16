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


describe('Given sample WSDL', function () {
    const wsdlURI = "https://eio-soap-sample.herokuapp.com/ws/countries.wsdl";
    it('should be able to call operation', function () {
        return action.process({
            body: {
                "name": "Spain"
            }
        }, {
            wsdlURI: wsdlURI,
            operation: 'CountriesPortService.CountriesPortSoap11.getCountry'
        });
    });

    it('should be able to call operation with custom XML', function () {
        return action.process({
            body: {
                _xml: "<getCountryRequest xmlns=\"http://spring.io/guides/gs-producing-web-service\"><name>Spain</name></getCountryRequest>"
            }
        }, {
            wsdlURI: wsdlURI,
            operation: 'CountriesPortService.CountriesPortSoap11.getCountry'
        });
    });
});
