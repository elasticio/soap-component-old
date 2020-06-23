const { SoapClient } = require('./lib/client');

module.exports = async function verifyCredentials(credentials) {
  this.logger.info('Verifying credentials...');
  this.logger.trace('Credentials passed for verification %j', credentials);
  const client = new SoapClient(this, credentials);
  await client.init();
  this.logger.info('credentials verified!');
};
