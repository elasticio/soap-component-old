const chai = require('chai');
const sinon = require('sinon');
const logger = require('@elastic.io/component-logger')();
require('dotenv').config();

const { SoapClient } = require('../lib/client');
const action = require('../lib/actions/call');

const { expect } = chai;

describe('Given', () => {
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
        wsdlURI: 'https://onlineavl2api-us.navmanwireless.com/onlineavl/api/V3.1/service.asmx?WSDL',
        auth: {
          type: 'Basic Auth',
          basic: {
            username: process.env.NAV_MAN_LOGIN,
            password: process.env.NAV_MAN_PASSWORD,
          },
        },
      };

      client = new SoapClient(self, cfg);
      await client.init();
      await action.init(cfg);
    });

    it('get services', async () => {
      const result = await action.getServices.call(self, cfg);
      expect(result).to.deep.equal({ ServiceSoap: 'ServiceSoap', ServiceSoap12: 'ServiceSoap12' });
    });

    it('get service actions list', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'ServiceSoap12';
      const result = await action.getOperations.call(self, cfgCopy);
      expect(typeof result).to.equal('object');
      expect(Object.keys(result).length).to.equal(72);
    });

    it('get service DoLogin action metadata', async () => {
      client.setService('ServiceSoap12');
      const result = client.getOperationMetadata('DoLogin');
      expect(result.input).not.to.equal(undefined);
      expect(result.output).not.to.equal(undefined);
    });

    it('call service DoLogin action', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'ServiceSoap12';
      cfgCopy.operation = 'DoLogin';
      const message = {
        body: {
          request: {
            Session: {
              // SessionId: '1',
              targetNSAlias: 'tns',
              targetNamespace: 'http://onlineavl2.navmanwireless.com/0907/',
            },
            UserCredential: {
              UserName: cfg.auth.basic.username,
              Password: cfg.auth.basic.password,
              // ApplicationID: 'guid|s:string|pattern',
              // ClientID: 'guid|s:string|pattern',
              // ClientVersion: 's:string',
              targetNSAlias: 'tns',
              targetNamespace: 'http://onlineavl2.navmanwireless.com/0907/',
            },
            // "IPAddress": "s:string",
            // "ClockVerificationUtc": "s:dateTime",
            targetNSAlias: 'tns',
            targetNamespace: 'http://onlineavl2.navmanwireless.com/0907/',
          },
        },
      };

      const result = await action.process.call(self, message, cfgCopy);
      expect(result[0].DoLoginResult.OperationStatus).to.equal(true);
    });

    it('get service GetDrivers action metadata', async () => {
      client.setService('ServiceSoap12');
      const result = client.getOperationMetadata('GetDrivers');
      expect(result.input).not.to.equal(undefined);
      expect(result.output).not.to.equal(undefined);
    });
  });
});
