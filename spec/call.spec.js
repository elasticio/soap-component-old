const assert = require('assert');
const path = require('path');
const action = require('../lib/actions/call');

describe('Given complex WSDL we can ', () => {
  it('list operations', () => action.getOperations({
    wsdlURI: path.join(__dirname, '/data/sapbyd/QueryCustomerIn.wsdl'),
  }).then((result) => {
    assert.equal(Object.keys(result).length, 6);
    assert.equal(Object.keys(result)[0], 'service.binding_SOAP12.FindByIdentification');
  }));
});
