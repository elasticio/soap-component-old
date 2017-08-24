const assert = require('assert');
const action = require('../lib/actions/call');
const path = require('path');

describe('Given complex WSDL we can ', function () {
  it('list operations', function () {
    return action.getOperations({
      wsdlURI: path.join(__dirname, '/data/sapbyd/QueryCustomerIn.wsdl')
    }).then(result => {
      assert.equal(Object.keys(result).length, 6);
      assert.equal(Object.keys(result)[0], 'service.binding_SOAP12.FindByIdentification');
    });
  });
});
