const { SoapClient } = require('../client');

let soapClient;
async function init(cfg) {
  soapClient = new SoapClient(this, cfg);
  await soapClient.init();
}

async function processAction(msg, cfg) {
  soapClient.setService(cfg.service);
  const result = await soapClient.callOperation(cfg.operation, msg.body);
  return result;
}

async function getServices() {
  const services = {};
  soapClient.getServices().forEach((s) => {
    services[s] = s;
  });
  return services;
}

async function getOperations(cfg) {
  const operations = {};
  soapClient.getServiceOperations(cfg.service).forEach((o) => {
    operations[o] = o;
  });
  return operations;
}

module.exports.init = init;
module.exports.process = processAction;
module.exports.getServices = getServices;
module.exports.getOperations = getOperations;
