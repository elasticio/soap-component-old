const assert = require('assert');
const action = require('../lib/actions/call');
const request = require('request-promise-native');

describe('Given', function () {
    const wsdlURI = "https://eio-soap-sample.herokuapp.com/ws/countries.wsdl";

    describe('WSDL https://eio-soap-sample.herokuapp.com/ws/countries.wsdl is accessible', function() {

        before(() => request(wsdlURI));

        it('should be able to call operation', function () {
            return action.process({
                body: {
                    "name": "Spain"
                }
            }, {
                wsdlURI: wsdlURI,
                operation: 'CountriesPortService.CountriesPortSoap11.getCountry'
            }).then((result) => {
                assert.ok(result.body);
                assert.ok(result.body.country);
                assert.equal(result.body.country.name, "Spain");
                assert.equal(result.body.country.capital, "Madrid");
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
            }).then((result) => {
                assert.ok(result.body);
                assert.ok(result.body.country);
                assert.equal(result.body.country.name, "Spain");
                assert.equal(result.body.country.capital, "Madrid");
            });
        });

    });
});
