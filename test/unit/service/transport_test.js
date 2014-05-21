describe('transport', function() {
  var transport,
      mockMethods = {
          type: function() { return mockMethods; },
          send: function() { return mockMethods; },
          end:  function() { return mockMethods; }
      },
      mockSuperagent = jasmine.createSpy().andCallFake(function() {
        return mockMethods;
      }),
      transportPath = buildPath('service/transport');

  beforeEach(function() {
    mockery.enable();

    mockery.registerMock('superagent', mockSuperagent);
    mockery.registerMock('imports?_=lodash!lodash', _);

    mockery.registerAllowable(transportPath);
    transport = require(transportPath).transport;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {

    var configDefaults = {
          scheme: 'https',
          snowflakeHost: 'zensnow.herokuapp.com'
        };

    beforeEach(function() {
      spyOn(_, 'extend').andCallThrough();
    });

    it('makes use of default config values', function() {

      var recentCall;

      transport.init();

      recentCall = _.extend.mostRecentCall;

      // verifying config defaults
      expect(recentCall.args[0])
        .toEqual(configDefaults);

      expect(recentCall.args[1])
        .toBeUndefined();
    });

    it('merges supplied config param with defaults', function() {

      var recentCall,
          testConfig = {
            test: 'config'
          };

      transport.init(testConfig);

      recentCall = _.extend.mostRecentCall;

      expect(recentCall.args[1])
        .toEqual(testConfig);
    });
  });

  describe('#send', function() {

    var payload,
        config;

    beforeEach(function() {
      payload = {
        method: 'get',
        path: '/test/path',
        params: {
          name: 'John Doe'
        },
        callbacks: {
          done: function() {},
          fail: function() {}
        }
      };

      config = {
        zendeskHost: 'test.zendesk.host'
      };
    });

    it('should throw an exception if zendeskHost is not set in config', function() {
      transport.init();

      expect(function() {
        transport.send(payload);
      })
        .toThrow();
    });

    it('sets the correct http method and url on superagent', function() {

      transport.init(config);
      transport.send(payload);

      expect(mockSuperagent)
        .toHaveBeenCalledWith(
          'GET',
          'https://zensnow.herokuapp.com/test/path');
    });

    it('sets the json type', function() {

      spyOn(mockMethods, 'type').andCallThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.type)
        .toHaveBeenCalledWith('json');
    });

    it('appends the zendesk_host params to the params posted', function() {

      var recentCall;
      spyOn(mockMethods, 'send').andCallThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.send);

      recentCall = mockMethods.send.mostRecentCall;

      /* jshint sub:true */
      expect(recentCall.args[0]['zendesk_host'])
        .toBe(config.zendeskHost);

    });

    it('sets payload.params to {} if no params are passed through', function() {

      var recentCall;

      delete(payload.params);

      spyOn(mockMethods, 'send').andCallThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.send);

      recentCall = mockMethods.send.mostRecentCall;

      expect(recentCall.args[0])
        .not.toBeUndefined();
    });

    it('triggers the done callback if response is successful', function() {

      var recentCall,
          callback;

      spyOn(payload.callbacks, 'done');
      spyOn(payload.callbacks, 'fail');
      spyOn(mockMethods, 'end').andCallThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.end)
        .toHaveBeenCalled();

      recentCall = mockMethods.end.mostRecentCall;

      callback = recentCall.args[0];
      callback({ok: true});

      expect(payload.callbacks.done)
        .toHaveBeenCalled();

      expect(payload.callbacks.fail)
        .not.toHaveBeenCalled();
    });

    it('triggers the fail callback if response is unsuccessful', function() {

      var recentCall,
          callback;

      spyOn(payload.callbacks, 'fail');
      spyOn(payload.callbacks, 'done');
      spyOn(mockMethods, 'end').andCallThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.end)
        .toHaveBeenCalled();

      recentCall = mockMethods.end.mostRecentCall;

      callback = recentCall.args[0];
      callback({error: true});

      expect(payload.callbacks.fail)
        .toHaveBeenCalled();

      expect(payload.callbacks.done)
        .not.toHaveBeenCalled();

    });

  });

});
