describe('transport', function() {
  var transport,
      mockMethods,
      mockRegistry,
      transportPath = buildSrcPath('service/transport');

  beforeEach(function() {
    mockery.enable({useCleanCache: true});
    mockMethods = {
        type: function() { return mockMethods; },
        send: function() { return mockMethods; },
        query: function() { return mockMethods; },
        timeout: function() { return mockMethods; },
        end:  function() { return mockMethods; }
    };
    mockRegistry = initMockRegistry({
      'react/addons': React,
      'superagent': jasmine.createSpy().andCallFake(function() {
          return mockMethods;
      }),
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable(transportPath);
    transport = require(transportPath).transport;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {

    beforeEach(function() {
      spyOn(_, 'extend').andCallThrough();
    });

    it('makes use of default config values', function() {

      var recentCall;

      transport.init();

      recentCall = _.extend.mostRecentCall;

      // verifying config defaults
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
          done: noop,
          fail: noop
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
      var mockSuperagent = mockRegistry.superagent;

      transport.init(config);
      transport.send(payload);

      expect(mockSuperagent)
        .toHaveBeenCalledWith(
          'GET',
          'https://test.zendesk.host/test/path');
    });

    it('sets the json type', function() {

      spyOn(mockMethods, 'type').andCallThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.type)
        .toHaveBeenCalledWith('json');
    });

    it('sets payload.params to {} if no params are passed through', function() {

      var recentCall;

      delete payload.params;

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

    it('will not die if callbacks object is not present', function() {

      var recentCall,
          callback;

      spyOn(mockMethods, 'end').andCallThrough();

      delete payload.callbacks;

      transport.init(config);
      transport.send(payload);

      recentCall = mockMethods.end.mostRecentCall;

      callback = recentCall.args[0];

      expect(function() {
        callback({ok: true});
      }).not.toThrow();
    });

    it('will not die if callbacks.done is not present', function() {

      var recentCall,
          callback;

      spyOn(mockMethods, 'end').andCallThrough();

      delete payload.callbacks.done;

      transport.init(config);
      transport.send(payload);

      recentCall = mockMethods.end.mostRecentCall;

      callback = recentCall.args[0];

      expect(function() {
        callback({ok: true});
      }).not.toThrow();
    });

    it('will not die if callbacks.fail is not present', function() {

      var recentCall,
          callback;

      spyOn(mockMethods, 'end').andCallThrough();

      delete payload.callbacks.fail;

      transport.init(config);
      transport.send(payload);

      recentCall = mockMethods.end.mostRecentCall;

      callback = recentCall.args[0];

      expect(function() {
        callback({error: true});
      }).not.toThrow();
    });
  });

});
