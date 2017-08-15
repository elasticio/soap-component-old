/* eslint new-cap: [2, {"capIsNewExceptions": ["Q"]}] */
const Q = require('q');
const elasticio = require('elasticio-node');
const messages = elasticio.messages;
const soap = require('soap');

module.exports.process = processAction;
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
 * Returns a JSON schema for complex element type
 *
 * @param desc
 * @returns {{}}
 */
function toJSONSchema(wsdl, desc) {
    const props = {};
    for (let key in desc) {
        props[key] = {
            type: "string"
        }
    }
    return props;
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
    const wsdlURI = cfg.wsdlURI;
    const operationPath = cfg.operation;
    if (!operationPath) {
        console.error('Please chose an opeartion, returning no metadata');
        return cb(null, {});
    }
    soap.createClient(wsdlURI, function (err, client) {
        if (err) {
            console.log('Error happened, ', err.stack || err);
            return cb(err);
        }
        const descriptor = client.describe();
        const [service, port, operation] = operationPath.split('.');
        const opDesc = descriptor[service][port][operation];
        if (!service || !port || !operation || !opDesc) {
            console.log('Can not find %s in %j', operationPath, descriptor);
            return cb(new Error("Operation not found"), {});
        }
        cb(null, opDesc);
        // Here we return metadata in the same format as
        // it is configured in component.json
        // cb(null, {
        //   in: {
        //     type: "object",
        //     properties: {
        //       inValue: {
        //         type: "string",
        //         required: true,
        //         title: "Input Value"
        //       }
        //     }
        //   },
        //   out: {
        //     type: "object",
        //     properties: {
        //     }
        //   }
        // });
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
