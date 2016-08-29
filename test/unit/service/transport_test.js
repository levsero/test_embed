describe('transport', function() {
  let transport,
    mockMethods,
    mockRegistry;

  const transportPath = buildSrcPath('service/transport');

  beforeEach(function() {
    mockery.enable();
    mockMethods = {
      type: () => mockMethods,
      send: () => mockMethods,
      responseType: () => mockMethods,
      attach: () => mockMethods,
      query: () => mockMethods,
      timeout: () => mockMethods,
      set: () => mockMethods,
      on: () => mockMethods,
      end: () => mockMethods
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
          getBuid: jasmine.createSpy('getBuid').and.returnValue('abc123'),
          getSuid: jasmine.createSpy('getBuid').and.returnValue('123abc')
        }
      },
      'service/settings': {
        settings: {
          get: () => 48
        }
      }
    });

    mockery.registerAllowable(transportPath);
    transport = requireUncached(transportPath).transport;
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

      expect(params.buid)
        .toBe('abc123');

      expect(params.url)
        .toBe(mockGlobals.win.location.href);

      expect(typeof params.timestamp)
        .toBe('string');

      expect(params.timestamp)
        .toBe((new Date(Date.parse(params.timestamp))).toISOString());

      expect(params.user)
        .toEqual(payload.params.user);
    });
  });

  describe('getImage', function() {
    let payload,
      config;

    beforeEach(function() {
      payload = {
        method: 'get',
        path: 'https://url.com/image',
        authorization: 'abc',
        callbacks: {
          done: noop,
          fail: noop
        }
      };
    });

    it('sets the correct http method and url on superagent', function() {
      const mockSuperagent = mockRegistry.superagent;

      transport.init(config);
      transport.getImage(payload);

      expect(mockSuperagent)
        .toHaveBeenCalledWith(
          'GET',
          payload.path);
    });

    it('sets the responseType to `blob`', function() {
      spyOn(mockMethods, 'responseType').and.callThrough();

      transport.init(config);
      transport.getImage(payload);

      expect(mockMethods.responseType)
        .toHaveBeenCalledWith('blob');
    });

    it('sets an authentication header with `Bearer <token>`', function() {
      spyOn(mockMethods, 'set').and.callThrough();

      transport.init(config);
      transport.getImage(payload);

      expect(mockMethods.set)
        .toHaveBeenCalledWith('Authorization', payload.authorization);
    });

    it('triggers the done callback if response is successful', function() {
      spyOn(payload.callbacks, 'done');
      spyOn(payload.callbacks, 'fail');
      spyOn(mockMethods, 'end').and.callThrough();

      transport.init(config);
      transport.getImage(payload);

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
  });

  describe('#sendFile', function() {
    let payload,
      config;

    beforeEach(function() {
      payload = {
        method: 'post',
        path: '/test/path',
        file: {
          name: 'fakeFile'
        },
        callbacks: {
          done: noop,
          fail: noop,
          progress: noop
        }
      };

      config = {
        zendeskHost: 'test.zendesk.host',
        version: 'version123'
      };
    });

    describe('when zendeskHost is not set in config', function() {
      beforeEach(function() {
        transport.init();
      });

      it('should throw an exception', function() {
        expect(() => transport.send(payload))
          .toThrow();
      });
    });

    describe('when zendeskHost is set in config', function() {
      let mockSuperagent;

      beforeEach(function() {
        spyOn(payload.callbacks, 'done');
        spyOn(payload.callbacks, 'fail');
        spyOn(payload.callbacks, 'progress');

        spyOn(mockMethods, 'end').and.callThrough();
        spyOn(mockMethods, 'on').and.callThrough();
        spyOn(mockMethods, 'query').and.callThrough();
        spyOn(mockMethods, 'attach').and.callThrough();

        mockSuperagent = mockRegistry.superagent;

        transport.init(config);
      });

      describe('when callbacks are present', function() {
        beforeEach(function() {
          transport.sendFile(payload);
        });

        it('sets the correct http method and path', function() {
          expect(mockSuperagent)
            .toHaveBeenCalledWith(
              'POST',
              'https://test.zendesk.host/test/path');
        });

        it('adds a query string with the filename', function() {
          expect(mockMethods.query)
            .toHaveBeenCalledWith({ filename: 'fakeFile' });
        });

        it('adds a query string with the web_widget via_id', function() {
          /* eslint camelcase:0 */
          expect(mockMethods.query)
            .toHaveBeenCalledWith({ via_id: 48 });
        });

        it('adds the file data with the key `uploaded_data`', () => {
          expect(mockMethods.attach)
            .toHaveBeenCalledWith('uploaded_data', payload.file);
        });

        it('triggers the done callback if response is successful', function() {
          expect(mockMethods.end)
            .toHaveBeenCalled();

          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          callback(null, { ok: true });

          expect(payload.callbacks.done)
            .toHaveBeenCalled();

          expect(payload.callbacks.fail)
            .not.toHaveBeenCalled();
        });

        it('triggers the fail callback if response is unsuccessful', function() {
          expect(mockMethods.end)
            .toHaveBeenCalled();

          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          callback({ error: true }, undefined);

          expect(payload.callbacks.fail)
            .toHaveBeenCalled();

          expect(payload.callbacks.done)
            .not.toHaveBeenCalled();
        });
      });

      describe('when callbacks object is not present', function() {
        beforeEach(function() {
          delete payload.callbacks;

          transport.sendFile(payload);
        });

        it('will not die', function() {
          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          expect(() => callback(null, { ok: true }))
            .not.toThrow();
        });
      });

      describe('when callbacks.done is not present', function() {
        beforeEach(function() {
          delete payload.callbacks.done;

          transport.sendFile(payload);
        });

        it('will not die', function() {
          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          expect(() => callback(null, { ok: true }))
            .not.toThrow();
        });
      });

      describe('when callbacks.fail is not present', function() {
        beforeEach(function() {
          delete payload.callbacks.fail;

          transport.sendFile(payload);
        });

        it('will not die', function() {
          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          expect(() => callback({ error: true }, undefined))
            .not.toThrow();
        });
      });

      describe('when callbacks.progress is not present', function() {
        beforeEach(function() {
          delete payload.callbacks.progress;

          transport.sendFile(payload);
        });

        it('will not die', function() {
          const recentCall = mockMethods.on.calls.mostRecent();
          const callback = recentCall.args[1];

          expect(() => callback({ percent: 10 }))
            .not.toThrow();
        });
      });
    });
  });

  describe('#automaticAnswersApiRequest', () => {
    let config,
      mockSuperagent,
      payload,
      ticket_id = '123',
      token = 'abc';

    beforeEach(() => {
      config = {
        zendeskHost: 'lolz.zendesk.host'
      };
      mockSuperagent = mockRegistry.superagent;
    });

    describe('when zendeskHost is not set in config', () => {
      beforeEach(() => {
        transport.init();
      });

      it('should throw an exception', () => {
        expect(() => transport.automaticAnswersApiRequest(payload))
          .toThrow();
      });
    });

    describe('when zendeskHost is set in config', () => {
      beforeEach(() => {
        transport.init(config);
        payload = {
          method: 'get',
          path: `/test/fetch/${ticket_id}/token/${token}`,
          callbacks: {
            done: noop,
            fail: noop
          }
        };
        spyOn(payload.callbacks, 'done');
        spyOn(payload.callbacks, 'fail');
        spyOn(mockMethods, 'end').and.callThrough();
      });

      describe('when sending a request', () => {
        beforeEach(() => {
          transport.automaticAnswersApiRequest(payload);
        });

        it('sets the correct http method and path', () => {
          expect(mockSuperagent)
            .toHaveBeenCalledWith(
              'GET',
              'https://lolz.zendesk.host/test/fetch/123/token/abc');
        });
      });

      describe('when a response is received', () => {
        let recentCall,
          callback;

        beforeEach(() => {
          transport.automaticAnswersApiRequest(payload);
          expect(mockMethods.end)
            .toHaveBeenCalled();

          recentCall = mockMethods.end.calls.mostRecent();
          callback = recentCall.args[0];
        });

        it('triggers the fail callback if response is successful', () => {
          callback(null, { ok: true });

          expect(payload.callbacks.done)
            .toHaveBeenCalled();
        });

        it('triggers the fail callback if response is unsuccessful', () => {
          callback({ error: true }, undefined);

          expect(payload.callbacks.fail)
            .toHaveBeenCalled();
        });
      });
    });
  });
});
