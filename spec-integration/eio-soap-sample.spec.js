const assert = require('assert');
const axios = require('axios');
const action = require('../lib/actions/call');

describe('Given', () => {
  const wsdlURI = 'https://eio-soap-sample.herokuapp.com/ws/countries.wsdl';

  describe('WSDL https://eio-soap-sample.herokuapp.com/ws/countries.wsdl is accessible', () => {
    before(async () => {
      const ax = axios.create();
      const response = await ax({ url: wsdlURI });
      console.log(response);
    });

    it('should be able to call operation', async () => {
      const msg = {
        body: {
          name: 'Spain',
        },
      };
      const cfg = {
        wsdlURI,
        operation: 'CountriesPortService.CountriesPortSoap11.getCountry',
      };
      const result = await action.process(msg, cfg);

      assert.ok(result.body);
      assert.ok(result.body.country);
      assert.equal(result.body.country.name, 'Spain');
      assert.equal(result.body.country.capital, 'Madrid');
    });

    it('should be able to call operation with custom XML', async () => {
      const msg = {
        body: {
          _xml: '<getCountryRequest xmlns="http://spring.io/guides/gs-producing-web-service"><name>Spain</name></getCountryRequest>',
        },
      };
      const cfg = {
        wsdlURI,
        operation: 'CountriesPortService.CountriesPortSoap11.getCountry',
      };
      const result = await action.process(msg, cfg);

      assert.ok(result.body);
      assert.ok(result.body.country);
      assert.equal(result.body.country.name, 'Spain');
      assert.equal(result.body.country.capital, 'Madrid');
    });
  });
});
