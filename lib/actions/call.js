const logger = require('@elastic.io/component-logger')();
const { messages } = require('elasticio-node');

const { SoapClient } = require('../client');

let soapClient;
async function init(cfg) {
  if (!this.logger) {
    this.logger = logger;
  }
  this.logger.info('Initializing soap client...');
  this.logger.trace(`Input configuration: ${JSON.stringify(cfg)}`);
  soapClient = new SoapClient(this, cfg);
  await soapClient.init();
  this.logger.info('Retrieving services...');
  this.logger.info('Soap client has been initialized!');
}

async function processAction(msg, cfg) {
  this.logger.info(`Calling SOAP operation '${cfg.operation}'...`);
  this.logger.trace(`Input message: ${JSON.stringify(msg)}`);
  this.logger.trace(`Input configuration: ${JSON.stringify(cfg)}`);
  if (!soapClient) {
    throw new Error('Soap client was not initialized!');
  }
  soapClient.setService(cfg.service);
  const result = await soapClient.callOperation(cfg.operation, msg.body);
  this.logger.info('Operation call complete!');
  this.logger.trace(`Output result: ${JSON.stringify(result)}`);
  await this.emit('data', messages.newMessageWithBody(result));
}

async function getServices(cfg) {
  if (!soapClient) {
    this.logger.warn('Soap client was not initialized!');
    await init.call(this, cfg);
  }
  const services = {};
  this.logger.info('Retrieving services...');
  const servicesArray = soapClient.getServices();
  servicesArray.forEach((s) => {
    services[s] = s;
  });
  this.logger.info(`Services found: ${servicesArray.length}`);
  this.logger.trace(`Operations list: ${JSON.stringify(servicesArray)}`);
  return services;
}

async function getOperations(cfg) {
  if (!soapClient) {
    this.logger.warn('Soap client was not initialized!');
    await init.call(this, cfg);
  }
  const operations = {};
  this.logger.info('Retrieving operations...');
  const operationsArray = soapClient.getServiceOperations(cfg.service);
  operationsArray.forEach((o) => {
    operations[o] = o;
  });
  this.logger.info(`Operations found: ${operationsArray.length}`);
  this.logger.trace(`Operations list: ${JSON.stringify(operationsArray)}`);
  return operations;
}

async function getMetaModel(cfg) {
  if (!soapClient) {
    this.logger.warn('Soap client was not initialized!');
    await init.call(this, cfg);
  }

  return soapClient.getOperationMetadata(cfg.operation, cfg.service);
}

module.exports.init = init;
module.exports.process = processAction;
module.exports.getServices = getServices;
module.exports.getOperations = getOperations;
module.exports.getMetaModel = getMetaModel;
