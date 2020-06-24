const chai = require('chai');
const sinon = require('sinon');
const logger = require('@elastic.io/component-logger')();
require('dotenv').config();

const { SoapClient } = require('../lib/client');
const action = require('../lib/actions/call');

const { expect } = chai;

describe('Thomas-Bayer Online', () => {
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
        wsdlURI: 'http://www.thomas-bayer.com/axis2/services/BLZService?wsdl',
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
        BLZServiceSOAP11port_http: 'BLZServiceSOAP11port_http',
        BLZServiceSOAP12port_http: 'BLZServiceSOAP12port_http',
      });
    });

    it('get service actions list', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'BLZServiceSOAP12port_http';
      const result = await action.getOperations.call(self, cfgCopy);
      expect(typeof result).to.equal('object');
      expect(Object.keys(result).length).to.equal(1);
    });

    it('get service Add action metadata', async () => {
      client.setService('BLZServiceSOAP12port_http');
      const result = client.getOperationMetadata('getBank');
      expect(result.input).not.to.equal(undefined);
      expect(result.output).not.to.equal(undefined);
    });

    it('call service Add action', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'BLZServiceSOAP12port_http';
      cfgCopy.operation = 'getBank';
      const message = {
        body: { blz: 67270003 },
      };

      await action.process.call(self, message, cfgCopy);
      const result = self.emit.getCall(0).args[1].body;
      expect(result[0]).to.deep.equal({
        details: {
          bezeichnung: 'Deutsche Bank',
          bic: 'DEUTDESM672',
          ort: 'Heidelberg, Neckar',
          plz: '69111',
        },
      });
    });
  });
});
