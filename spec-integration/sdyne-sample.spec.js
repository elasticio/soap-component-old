const chai = require('chai');
const sinon = require('sinon');
const logger = require('@elastic.io/component-logger')();
require('dotenv').config();

const { SoapClient } = require('../lib/client');
const action = require('../lib/actions/call');

const { expect } = chai;

describe('Cdyne Online', () => {
  describe('WSDL is accessible', () => {
    let cfg;
    let client;
    let self;

    before(async () => {
      self = {
        emit: sinon.spy(),
        logger,
      };

      cfg = {
        wsdlURI: 'http://ws.cdyne.com/phoneverify/phoneverify.asmx?wsdl',
        auth: {
          type: 'No Auth',
        },
      };

      client = new SoapClient(self, cfg);
      await client.init();
      await action.init(cfg);
    });

    it('get services', async () => {
      const result = await action.getServices.call(self, cfg);
      expect(result).to.deep.equal({
        PhoneVerifySoap: 'PhoneVerifySoap',
        PhoneVerifySoap12: 'PhoneVerifySoap12',
      });
    });

    it('get service actions list', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'PhoneVerifySoap12';
      const result = await action.getOperations.call(self, cfgCopy);
      expect(typeof result).to.equal('object');
      expect(Object.keys(result).length).to.equal(2);
    });

    it('get service Add action metadata', async () => {
      client.setService('PhoneVerifySoap12');
      const result = client.getOperationMetadata('CheckPhoneNumber');
      expect(result.input).not.to.equal(undefined);
      expect(result.output).not.to.equal(undefined);
    });

    it('call service Add action', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'PhoneVerifySoap12';
      cfgCopy.operation = 'CheckPhoneNumber';
      const message = {
        body: { PhoneNumber: '88005553535', LicenseKey: 'key' },
      };

      await action.process.call(self, message, cfgCopy);
      const result = self.emit.getCall(0).args[1].body;
      expect(result[0]).to.deep.equal({
        CheckPhoneNumberResult: {
          Valid: false,
          OriginalNumber: '88005553535',
          CleanNumber: '8800555353',
          Wireless: false,
        },
      });
    });
  });
});
