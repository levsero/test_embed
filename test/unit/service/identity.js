var mockery = require('mockery');

describe('identity', function() {
  beforeEach(function() {
    mockery.enable();
    mockery.registerMock('service/persistence', {
      store: function() {}
    });
    mockery.registerAllowable(buildPath('service/identity'));
  });

  it('works', function() {
    var identity = require(buildPath('service/identity'));
    expect(1).toBe(1);
  });
});
