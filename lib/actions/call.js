/* eslint new-cap: [2, {"capIsNewExceptions": ["Q"]}] */
const elasticio = require('elasticio-node');
const messages = elasticio.messages;
const soap = require('soap');
const assert = require('assert');
const util = require('util');

module.exports.process = processAction;
module.exports.getOperations = getOperations;

/**
 * This method will be called from elastic.io platform providing following data
 *
 * @param msg incoming message object that contains ``body`` with payload
 * @param cfg configuration that is account information and configuration field values
 */
function processAction(msg, cfg) {
    const wsdlURI = cfg.wsdlURI;
    const opPath = cfg.operation.split('.');
    assert.equal(opPath.length, 3, "Operation string should be service.port.opname");
    return soap.createClientAsync(wsdlURI).then((client) => {
        const service = client[opPath[0]];
        assert(service, `Service ${opPath[0]} was not found`);
        const port = service[opPath[1]];
        assert(port, `Port ${opPath[1]} was not found`);
        const operation = port[opPath[2]];
        assert(operation, `Operation ${opPath[2]} was not found`);
        return util.promisify(operation)(msg.body);
    }).then((result) => {
        console.log('Emitting result=%j', result);
        return messages.newMessageWithBody(result);
    });
}

/**
 * This method should return a list of 'service/port/operation'
 *
 * @param cfg
 * @returns Promise
 */
function getOperations(cfg) {
    const wsdlURI = cfg.wsdlURI;
    return soap.createClientAsync(wsdlURI).then((client) => {
        const descriptor = client.describe();
        const ops = {};
        for (let serviceName in descriptor) {
            console.log('Found service=%s', serviceName);
            const service = descriptor[serviceName];
            for (let portName in service) {
                console.log('Found port=%s', portName);
                const port = service[portName];
                for (let opName in port) {
                    console.log('Found operation=%s', opName);
                    ops[`${serviceName}.${portName}.${opName}`] = `${opName} [${serviceName}/${portName}]`;
                }
            }
        }
        return ops;
    });
}
