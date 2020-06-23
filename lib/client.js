const soap = require('soap');

const { OAuth2Client } = require('./auth/oauth2');

const authTypes = {
  NO_AUTH: 'No Auth',
  BASIC: 'Basic Auth',
  API_KEY: 'API Key Auth',
  OAUTH2: 'OAuth2',
};

class SoapClient {
  constructor(emitter, cfg) {
    this.emitter = emitter;
    this.logger = emitter.logger;
    this.cfg = cfg;
    this.wsdlURI = cfg.wsdlURI;
    this.auth = cfg.auth;
  }

  async init() {
    this.client = await soap.createClientAsync(this.wsdlURI);
    switch (this.auth.type) {
      case authTypes.BASIC:
        this.client.setSecurity(new soap.BasicAuthSecurity(this.auth.basic.username,
          this.auth.basic.password));
        break;
      case authTypes.API_KEY:
        // eslint-disable-next-line no-case-declarations
        const security = new soap.BasicAuthSecurity('', '');
        security.addHeaders({ [this.auth.apiKey.headerName]: `"${this.auth.apiKey.headerValue}"` });
        this.client.setSecurity(security);
        break;
      case authTypes.OAUTH2:
        // eslint-disable-next-line no-case-declarations
        const oauthClient = new OAuth2Client(this.emitter, this.auth);
        // eslint-disable-next-line no-case-declarations
        const token = oauthClient.getValidToken();
        this.client.setSecurity(new soap.BearerSecurity(token));
        break;
      default:
    }
  }

  setService(serviceName) {
    if (!this.getServices().includes(serviceName)) {
      throw new Error(`No such service: ${serviceName}!`);
    }

    this.serviceName = serviceName;
  }

  getServices() {
    return Object.keys(this.client.describe().Service);
  }

  getServiceOperations(serviceName) {
    // eslint-disable-next-line no-param-reassign
    serviceName = serviceName || this.serviceName;
    return Object.keys(this.client.describe().Service[serviceName]);
  }

  getOperationMetadata(operationName, serviceName) {
    // eslint-disable-next-line no-param-reassign
    serviceName = serviceName || this.serviceName;
    if (!serviceName) {
      throw new Error('No Soap service selected!');
    }

    return this.client.describe().Service[serviceName][operationName];
  }

  async callOperation(operationName, requestBody) {
    return this.client[`${operationName}Async`](requestBody);
  }
}

module.exports.SoapClient = SoapClient;
