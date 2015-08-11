describe('transport', function() {
  let transport,
      mockMethods,
      mockRegistry;
  const transportPath = buildSrcPath('service/transport');

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
      'superagent': jasmine.createSpy().and.callFake(function() {
        return mockMethods;
      }),
      'lodash': _,
      'utility/globals': {
        win: {
          location: {
            href: 'http://window.location.href'
          }
        }
      },
      'service/identity': {
        identity: {
          getBuid: jasmine.createSpy('getBuid').and.returnValue('abc123')
        }
      }
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
      spyOn(_, 'extend').and.callThrough();
    });

    it('makes use of default config values', function() {
      transport.init();

      const recentCall = _.extend.calls.mostRecent();

      // verifying config defaults
      expect(recentCall.args[1])
        .toBeUndefined();
    });

    it('merges supplied config param with defaults', function() {
      const testConfig = {
        test: 'config'
      };

      transport.init(testConfig);

      const recentCall = _.extend.calls.mostRecent();

      expect(recentCall.args[1])
        .toEqual(testConfig);
    });
  });

  describe('#send', function() {
    let payload,
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
      const mockSuperagent = mockRegistry.superagent;

      transport.init(config);
      transport.send(payload);

      expect(mockSuperagent)
        .toHaveBeenCalledWith(
          'GET',
          'https://test.zendesk.host/test/path');
    });

    it('sets the json type', function() {

      spyOn(mockMethods, 'type').and.callThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.type)
        .toHaveBeenCalledWith('json');
    });

    it('sets payload.params to {} if no params are passed through', function() {

      delete payload.params;

      spyOn(mockMethods, 'send').and.callThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.send);

      const recentCall = mockMethods.send.calls.mostRecent();

      expect(recentCall.args[0])
        .not.toBeUndefined();
    });

    it('triggers the done callback if response is successful', function() {

      spyOn(payload.callbacks, 'done');
      spyOn(payload.callbacks, 'fail');
      spyOn(mockMethods, 'end').and.callThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.end)
        .toHaveBeenCalled();

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      callback(null, {ok: true});

      expect(payload.callbacks.done)
        .toHaveBeenCalled();

      expect(payload.callbacks.fail)
        .not.toHaveBeenCalled();
    });

    it('triggers the fail callback if response is unsuccessful', function() {

      spyOn(payload.callbacks, 'fail');
      spyOn(payload.callbacks, 'done');
      spyOn(mockMethods, 'end').and.callThrough();

      transport.init(config);
      transport.send(payload);

      expect(mockMethods.end)
        .toHaveBeenCalled();

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      callback({error: true}, undefined);

      expect(payload.callbacks.fail)
        .toHaveBeenCalled();

      expect(payload.callbacks.done)
        .not.toHaveBeenCalled();

    });

    it('will not die if callbacks object is not present', function() {

      spyOn(mockMethods, 'end').and.callThrough();

      delete payload.callbacks;

      transport.init(config);
      transport.send(payload);

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      expect(function() {
        callback(null, {ok: true});
      }).not.toThrow();
    });

    it('will not die if callbacks.done is not present', function() {

      spyOn(mockMethods, 'end').and.callThrough();

      delete payload.callbacks.done;

      transport.init(config);
      transport.send(payload);

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      expect(function() {
        callback(null, {ok: true});
      }).not.toThrow();
    });

    it('will not die if callbacks.fail is not present', function() {

      spyOn(mockMethods, 'end').and.callThrough();

      delete payload.callbacks.fail;

      transport.init(config);
      transport.send(payload);

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      expect(function() {
        callback({error: true}, undefined);
      }).not.toThrow();
    });
  });

  describe('#sendWithMeta', function() {
    let payload,
        config;

    beforeEach(function() {
      payload = {
        method: 'post',
        path: '/test/path',
        params: {
          user: {
            name: 'John Doe'
          }
        },
        callbacks: {
          done: noop,
          fail: noop
        }
      };

      config = {
        zendeskHost: 'test.zendesk.host',
        version: 'version123'
      };
    });

    it('augments payload.params with blip metadata', function() {
      const mockGlobals = mockRegistry['utility/globals'];

      spyOn(mockMethods, 'send').and.callThrough();

      transport.init(config);
      transport.sendWithMeta(payload);

      const params = mockMethods.send.calls.mostRecent().args[0];

      expect(params['buid'])
        .toBe('abc123');

      expect(params['url'])
        .toBe(mockGlobals.win.location.href);

      expect(typeof params['timestamp'])
        .toBe('string');

      expect(params['timestamp'])
        .toBe((new Date(Date.parse(params['timestamp']))).toISOString());

      expect(params['user'])
        .toEqual(payload.params.user);
    });
  });

});
