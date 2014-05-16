var mockery = require('mockery');

describe('identity', function() {
  beforeEach(function() {
    mockery.enable();
    mockery.registerMock('service/persistence', {
      store: function() {}
    });
    mockery.registerAllowable('../../unes6/service/identity');
  });

  it('works', function() {
    var identity = require('../../unes6/service/identity');
    expect(1).toBe(1);
  });
});
