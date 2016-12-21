/* eslint new-cap: [2, {"capIsNewExceptions": ["Q"]}] */
var Q = require('q');
var elasticio = require('elasticio-node');
var messages = elasticio.messages;
var soap = require('soap');

module.exports.process = processAction;
module.exports.getMetaModel = getMetaModel;
module.exports.getOperations = getOperations;


/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */
function processAction(msg, cfg) {
  var self = this;
  var name = cfg.name;

  function emitData() {
    console.log('About to say hello to ' + name + ' again');

    var body = {
      greeting: name + ' How are you today?',
      originalGreeting: msg.body.greeting
    };

    var data = messages.newMessageWithBody(body);

    self.emit('data', data);
  }

  function emitError(e) {
    console.log('Oops! Error occurred');

    self.emit('error', e);
  }

  function emitEnd() {
    console.log('Finished execution');

    self.emit('end');
  }

  Q().then(emitData).fail(emitError).done(emitEnd);
}

/**
 * This function is called at design time when dynamic metadata need
 * to be fetched from 3rd party system
 *
 * @param cfg - configuration object same as in process method above
 * @param cb - callback returning metadata
 */
function getMetaModel(cfg, cb) {
  console.log('Fetching metadata with following configuration cfg=%j', cfg);
  // Here we return metadata in the same format as
  // it is configured in component.json
  cb(null, {
    in: {
      type: "object",
      properties: {
        inValue: {
          type: "string",
          required: true,
          title: "Input Value"
        }
      }
    },
    out: {
      type: "object",
      properties: {
        outValue: {
          type: "string",
          required: true,
          title: "Output Value"
        }
      }
    }
  });
}

/**
 * This method should return a list of 'service/port/operation'
 *
 * @param cfg
 * @param cb
 */
function getOperations(cfg,cb) {
  "use strict";
  const wsdlURI = cfg.wsdlURI;
  soap.createClient(wsdlURI, function(err, client) {
    if (err) {
      console.log('Error happened, ', err.stack || err);
      return cb(err);
    }
    const descriptor = client.describe();
    const ops = {};
    for(let serviceName in descriptor) {
      console.log('Found service=%s', serviceName);
      const service = descriptor[serviceName];
      for(let portName in service) {
        console.log('Found port=%s', portName);
        const port = service[portName];
        for(let opName in port) {
          console.log('Found operation=%s', opName);
          ops[`${serviceName}.${portName}.${opName}`] = `${opName} [${serviceName}/${portName}]`;
        }
      }
    }
    cb(null, ops);
  });
}
