const chai = require('chai');
require('dotenv').config();

const { SoapClient } = require('../lib/client');

const { expect } = chai;

describe('Given', () => {
  describe('WSDL is accessible', () => {
    let cfg;
    let client;

    before(async () => {
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

      client = new SoapClient({}, cfg);
      await client.init();
    });

    it('get services', async () => {
      const result = client.getServices();
      expect(result).to.deep.equal(['ServiceSoap', 'ServiceSoap12']);
    });

    it('get service actions list', async () => {
      const result = client.getServiceOperations('ServiceSoap12');
      expect(result.length).to.equal(72);
    });

    it('get service DoLogin action metadata', async () => {
      client.setService('ServiceSoap12');
      const result = client.getOperationMetadata('DoLogin');
      expect(result.input).not.to.equal(undefined);
      expect(result.output).not.to.equal(undefined);
    });

    it('call service DoLogin action', async () => {
      const operation = 'DoLogin';
      const request = {
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
      };

      client.setService('ServiceSoap12');
      const result = await client.callOperation(operation, request);
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
