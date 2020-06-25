const chai = require('chai');
const sinon = require('sinon');
const logger = require('@elastic.io/component-logger')();
require('dotenv').config();

const action = require('../lib/actions/call');

const { expect } = chai;

describe('Dne Online', () => {
  describe('WSDL is accessible', () => {
    let cfg;
    let self;

    before(async () => {
      self = {
        emit: sinon.spy(),
        logger,
      };

      cfg = {
        wsdlURI: 'http://www.dneonline.com/calculator.asmx?WSDL',
        auth: {
          type: 'No Auth',
        },
      };

      await action.init(cfg);
    });

    it('get services', async () => {
      const result = await action.getServices.call(self, cfg);
      expect(result).to.deep.equal({
        CalculatorSoap: 'CalculatorSoap',
        CalculatorSoap12: 'CalculatorSoap12',
      });
    });

    it('get service actions list', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'CalculatorSoap12';
      const result = await action.getOperations.call(self, cfgCopy);
      expect(typeof result).to.equal('object');
      expect(Object.keys(result).length).to.equal(4);
    });

    it('get service Add action metadata', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'CalculatorSoap12';
      cfgCopy.operation = 'Add';
      const result = await action.getMetaModel.call(self, cfgCopy);
      expect(result.in).not.to.equal(undefined);
      expect(result.out).not.to.equal(undefined);
    });

    it('call service Add action', async () => {
      const cfgCopy = JSON.parse(JSON.stringify(cfg));
      cfgCopy.service = 'CalculatorSoap12';
      cfgCopy.operation = 'Add';
      const message = {
        body: { intA: 1, intB: 2 },
      };

      await action.process.call(self, message, cfgCopy);
      const result = self.emit.getCall(0).args[1].body;
      expect(result[0].AddResult).to.equal(3);
    });
  });
});
