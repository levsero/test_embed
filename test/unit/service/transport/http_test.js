describe('http', () => {
  let http,
    mockStore,
    mockMethods,
    mockRegistry;

  const httpPath = buildSrcPath('service/transport/http');

  beforeEach(() => {
    mockery.enable();

    mockStore = false;
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
      'superagent': jasmine.createSpy().and.callFake(() => {
        return mockMethods;
      }),
      'lodash': _,
      'utility/globals': {
        document: document,
        location: {
          href: 'http://www.example.com/page.html',
          hostname: 'helpme.mofo.io'
        }
      },
      'utility/utils': {
        base64encode: jasmine.createSpy('base64encode')
          .and.returnValue('MOCKBASE64'),
        referrerPolicyUrl: (policy, url) => {
          if (policy === 'no-referrer') return null;
          else if (policy === 'origin') return 'http://www.example.com';
          else return url;
        }
      },
      'service/identity': {
        identity: {
          getBuid: jasmine.createSpy('getBuid').and.returnValue('abc123'),
          getSuid: jasmine.createSpy('getBuid').and.returnValue('123abc')
        }
      },
      'service/persistence': {
        store: {
          get: () => mockStore
        }
      },
      'service/settings': {
        settings: {
          get: () => 48
        }
      }
    });

    mockery.registerAllowable(httpPath);
    http = requireUncached(httpPath).http;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', () => {
    beforeEach(() => {
      spyOn(_, 'extend').and.callThrough();
    });

    it('makes use of default config values', () => {
      http.init();

      const recentCall = _.extend.calls.mostRecent();

      // verifying config defaults
      expect(recentCall.args[1])
        .toBeUndefined();
    });

    it('merges supplied config param with defaults', () => {
      const testConfig = {
        test: 'config'
      };

      http.init(testConfig);

      const recentCall = _.extend.calls.mostRecent();

      expect(recentCall.args[1])
        .toEqual(testConfig);
    });
  });

  describe('#send', () => {
    let payload,
      config;

    beforeEach(() => {
      payload = {
        method: 'get',
        path: '/test/path',
        params: {
          name: 'John Doe'
        },
        callbacks: {
          done: noop,
          fail: noop,
          always: noop
        }
      };

      config = {
        scheme: 'https',
        zendeskHost: 'test.zendesk.host'
      };
    });

    describe('if it is a POST request', () => {
      it('sets payload.params to {} if no params are passed through', () => {
        payload.method = 'post';
        delete payload.params;

        spyOn(mockMethods, 'send').and.callThrough();

        http.init(config);
        http.send(payload);

        const recentCall = mockMethods.send.calls.mostRecent();

        expect(recentCall.args[0])
          .not.toBeUndefined();
      });
    });

    describe('if it is a GET request', () => {
      it('does not pass through params if they are not defined', () => {
        payload.method = 'get';
        delete payload.params;

        spyOn(mockMethods, 'send').and.callThrough();

        http.init(config);
        http.send(payload);

        const recentCall = mockMethods.send.calls.mostRecent();

        expect(recentCall)
          .toBeUndefined();
      });
    });

    describe('query string', () => {
      it('sends a query string if payload contains it', () => {
        payload.query = { hello: 'there' };

        spyOn(mockMethods, 'query').and.callThrough();

        http.init(config);
        http.send(payload);

        expect(mockMethods.query)
          .toHaveBeenCalledWith(payload.query);
      });

      it('does not send a query string if the payload does not contain it', () => {
        spyOn(mockMethods, 'query').and.callThrough();

        http.init(config);
        http.send(payload);

        expect(mockMethods.query)
          .not.toHaveBeenCalled();
      });
    });

    describe('Accept-Language', () => {
      beforeEach(() => {
        payload.locale = 'fr';
        payload.Authorization = undefined;

        spyOn(mockMethods, 'set').and.callThrough();

        http.init(config);
        http.send(payload);
      });

      it('sends the Accept-Language if payload contains a locale', () => {
        expect(mockMethods.set)
          .toHaveBeenCalledWith('Accept-Language', 'fr');
      });
    });

    it('should throw an exception if zendeskHost is not set in config', () => {
      http.init();

      expect(() => {
        http.send(payload);
      })
        .toThrow();
    });

    it('sets the correct http method and url on superagent', () => {
      const mockSuperagent = mockRegistry.superagent;

      http.init(config);
      http.send(payload);

      expect(mockSuperagent)
        .toHaveBeenCalledWith(
          'GET',
          'https://test.zendesk.host/test/path');
    });

    describe('type header', () => {
      it('sets the json type by default', () => {
        spyOn(mockMethods, 'type').and.callThrough();

        http.init(config);
        http.send(payload);

        expect(mockMethods.type)
          .toHaveBeenCalledWith('json');
      });

      it('does not send a json type if explicitly omitted', () => {
        spyOn(mockMethods, 'type').and.callThrough();

        http.init(config);
        http.send(payload, false);

        expect(mockMethods.type)
          .not.toHaveBeenCalled();
      });
    });

    describe('if response is successful', () => {
      it('triggers the done and always callbacks', () => {
        spyOn(payload.callbacks, 'done');
        spyOn(payload.callbacks, 'fail');
        spyOn(payload.callbacks, 'always');
        spyOn(mockMethods, 'end').and.callThrough();

        http.init(config);
        http.send(payload);

        expect(mockMethods.end)
          .toHaveBeenCalled();

        const recentCall = mockMethods.end.calls.mostRecent();

        const callback = recentCall.args[0];

        callback(null, {ok: true});

        expect(payload.callbacks.done)
          .toHaveBeenCalled();

        expect(payload.callbacks.always)
          .toHaveBeenCalled();

        expect(payload.callbacks.fail)
          .not.toHaveBeenCalled();
      });
    });

    describe('if response is unsuccessful', () => {
      it('triggers the fail and always callbacks', () => {
        spyOn(payload.callbacks, 'fail');
        spyOn(payload.callbacks, 'done');
        spyOn(payload.callbacks, 'always');
        spyOn(mockMethods, 'end').and.callThrough();

        http.init(config);
        http.send(payload);

        expect(mockMethods.end)
          .toHaveBeenCalled();

        const recentCall = mockMethods.end.calls.mostRecent();

        const callback = recentCall.args[0];

        callback({error: true}, undefined);

        expect(payload.callbacks.fail)
          .toHaveBeenCalled();

        expect(payload.callbacks.always)
          .toHaveBeenCalled();

        expect(payload.callbacks.done)
          .not.toHaveBeenCalled();
      });
    });

    it('will not die if callbacks object is not present', () => {
      spyOn(mockMethods, 'end').and.callThrough();

      delete payload.callbacks;

      http.init(config);
      http.send(payload);

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      expect(() => {
        callback(null, {ok: true});
      }).not.toThrow();
    });

    it('will not die if callbacks.done is not present', () => {
      spyOn(mockMethods, 'end').and.callThrough();

      delete payload.callbacks.done;

      http.init(config);
      http.send(payload);

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      expect(() => {
        callback(null, {ok: true});
      }).not.toThrow();
    });

    it('will not die if callbacks.fail is not present', () => {
      spyOn(mockMethods, 'end').and.callThrough();

      delete payload.callbacks.fail;

      http.init(config);
      http.send(payload);

      const recentCall = mockMethods.end.calls.mostRecent();

      const callback = recentCall.args[0];

      expect(() => {
        callback({error: true}, undefined);
      }).not.toThrow();
    });

    describe('when not forcing http', () => {
      let urlArg;

      beforeEach(() => {
        http.init(config);
        http.send(payload);

        urlArg = mockRegistry.superagent.calls.mostRecent().args[1];
      });

      it('should use the protocol from the config', () => {
        expect(urlArg)
          .toContain(config.scheme);
      });

      it('should use the zendesk domain from the config', () => {
        expect(urlArg)
          .toContain(config.zendeskHost);
      });
    });

    describe('when forcing http', () => {
      let urlArg;

      beforeEach(() => {
        payload.forceHttp = true;

        http.init(config);
        http.send(payload);

        urlArg = mockRegistry.superagent.calls.mostRecent().args[1];
      });

      it('should use the http protocol', () => {
        expect(urlArg)
          .toContain('http:');
      });

      it('should use the hostmapped domain', () => {
        expect(urlArg)
          .toContain('helpme.mofo.io');
      });
    });
  });

  describe('#getZendeskSubdomain', () => {
    beforeEach(() => {
      http.init({ zendeskHost: 'foocustomer.zendesk.com' });
    });

    it('returns the zendesk subdomain', () => {
      expect(http.getZendeskSubdomain())
        .toBe('foocustomer');
    });
  });

  describe('#sendWithMeta', () => {
    let payload,
      config;

    beforeEach(() => {
      payload = {
        method: 'post',
        type: 'user',
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

    describe('without base64 encoding for blips', () => {
      it('augments payload.params with blip metadata', () => {
        const mockGlobals = mockRegistry['utility/globals'];

        spyOn(mockMethods, 'send').and.callThrough();

        http.init(config);
        http.sendWithMeta(payload, false);

        const params = mockMethods.send.calls.mostRecent().args[0];

        expect(params.buid)
          .toBe('abc123');

        expect(params.url)
          .toBe(mockGlobals.location.href);

        expect(typeof params.timestamp)
          .toBe('string');

        expect(params.timestamp)
          .toBe((new Date(Date.parse(params.timestamp))).toISOString());

        expect(params.user)
          .toEqual(payload.params.user);
      });

      describe('when a referrerPolicy value is stored in session storage', () => {
        let params;

        describe('that is of no-referrer type', () => {
          beforeEach(() => {
            mockStore = 'no-referrer';

            spyOn(mockMethods, 'send').and.callThrough();

            http.init(config);
            http.sendWithMeta(payload, false);

            params = mockMethods.send.calls.mostRecent().args[0];
          });

          it('does not send a url param', () =>{
            expect(params.url)
              .toBeUndefined();
          });
        });

        describe('that is not of no-referrer type', () => {
          beforeEach(() => {
            mockStore = 'origin';

            spyOn(mockMethods, 'send').and.callThrough();

            http.init(config);
            http.sendWithMeta(payload, false);

            params = mockMethods.send.calls.mostRecent().args[0];
          });

          it('sends a url param with the path name excluded', () =>{
            expect(params.url)
              .toEqual('http://www.example.com');
          });
        });
      });
    });

    describe('with base64 encoding for blips', () => {
      beforeEach(() => {
        spyOn(mockMethods, 'send').and.callThrough();
        http.init(config);

        http.sendWithMeta(payload);
      });

      it('encodes the data and sends it as a query string', () =>{
        expect(payload.query.data).toEqual('MOCKBASE64');
      });

      it('sends through the type as a query string', () => {
        expect(payload.query.type).toEqual('user');
      });
    });
  });

  describe('getImage', () => {
    let payload,
      config,
      mockSuperagent,
      onEndHandler;

    beforeEach(() => {
      mockSuperagent = mockRegistry.superagent;
      payload = {
        method: 'get',
        path: 'https://url.com/image',
        authorization: 'abc',
        callbacks: {
          done: noop,
          fail: noop
        }
      };

      spyOn(mockMethods, 'responseType').and.callThrough();
      spyOn(mockMethods, 'set').and.callThrough();
      spyOn(payload.callbacks, 'done');
      spyOn(payload.callbacks, 'fail');
      spyOn(mockMethods, 'end').and.callThrough();

      http.init(config);
      http.getImage(payload);

      onEndHandler = mockMethods.end.calls.mostRecent().args[0];
    });

    it('sets the correct http method and url on superagent', () => {
      expect(mockSuperagent)
        .toHaveBeenCalledWith('get', payload.path);
    });

    it('sets the responseType to `blob`', () => {
      expect(mockMethods.responseType)
        .toHaveBeenCalledWith('blob');
    });

    it('sets an authentication header with `Bearer <token>`', () => {
      expect(mockMethods.set)
        .toHaveBeenCalledWith('Authorization', payload.authorization);
    });

    describe('when there is no error', () => {
      let res;

      beforeEach(() => {
        res = { ok: true };
        onEndHandler(null, res);
      });

      it('should invoke the done callback', () => {
        expect(payload.callbacks.done)
          .toHaveBeenCalledWith(res);
      });
    });

    describe('when there is an error', () => {
      let err;

      beforeEach(() => {
        err = { message: 'Bloody Rippa' };
        onEndHandler(err, null);
      });

      it('should invoke the fail callback', () => {
        expect(payload.callbacks.fail)
          .toHaveBeenCalledWith(err, null);
      });
    });
  });

  describe('#sendFile', () => {
    let payload,
      config;

    beforeEach(() => {
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

    describe('when zendeskHost is not set in config', () => {
      beforeEach(() => {
        http.init();
      });

      it('should throw an exception', () => {
        expect(() => http.send(payload))
          .toThrow();
      });
    });

    describe('when zendeskHost is set in config', () => {
      let mockSuperagent;

      beforeEach(() => {
        spyOn(payload.callbacks, 'done');
        spyOn(payload.callbacks, 'fail');
        spyOn(payload.callbacks, 'progress');

        spyOn(mockMethods, 'end').and.callThrough();
        spyOn(mockMethods, 'on').and.callThrough();
        spyOn(mockMethods, 'query').and.callThrough();
        spyOn(mockMethods, 'attach').and.callThrough();

        mockSuperagent = mockRegistry.superagent;

        http.init(config);
      });

      describe('when callbacks are present', () => {
        beforeEach(() => {
          http.sendFile(payload);
        });

        it('sets the correct http method and path', () => {
          expect(mockSuperagent)
            .toHaveBeenCalledWith(
              'POST',
              'https://test.zendesk.host/test/path');
        });

        it('adds a query string with the filename', () => {
          expect(mockMethods.query)
            .toHaveBeenCalledWith({ filename: 'fakeFile' });
        });

        it('adds a query string with the web_widget via_id', () => {
          /* eslint camelcase:0 */
          expect(mockMethods.query)
            .toHaveBeenCalledWith({ via_id: 48 });
        });

        it('adds the file data with the key `uploaded_data`', () => {
          expect(mockMethods.attach)
            .toHaveBeenCalledWith('uploaded_data', payload.file);
        });

        it('triggers the done callback if response is successful', () => {
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

        it('triggers the fail callback if response is unsuccessful', () => {
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

      describe('when callbacks object is not present', () => {
        beforeEach(() => {
          delete payload.callbacks;

          http.sendFile(payload);
        });

        it('will not die', () => {
          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          expect(() => callback(null, { ok: true }))
            .not.toThrow();
        });
      });

      describe('when callbacks.done is not present', () => {
        beforeEach(() => {
          delete payload.callbacks.done;

          http.sendFile(payload);
        });

        it('will not die', () => {
          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          expect(() => callback(null, { ok: true }))
            .not.toThrow();
        });
      });

      describe('when callbacks.fail is not present', () => {
        beforeEach(() => {
          delete payload.callbacks.fail;

          http.sendFile(payload);
        });

        it('will not die', () => {
          const recentCall = mockMethods.end.calls.mostRecent();
          const callback = recentCall.args[0];

          expect(() => callback({ error: true }, undefined))
            .not.toThrow();
        });
      });

      describe('when callbacks.progress is not present', () => {
        beforeEach(() => {
          delete payload.callbacks.progress;

          http.sendFile(payload);
        });

        it('will not die', () => {
          const recentCall = mockMethods.on.calls.mostRecent();
          const callback = recentCall.args[1];

          expect(() => callback({ percent: 10 }))
            .not.toThrow();
        });
      });
    });
  });

  describe('callMeRequest', () => {
    let mockSuperagent,
      payload;

    beforeEach(() => {
      mockSuperagent = mockRegistry.superagent;
      http.init();
      spyOn(mockMethods, 'send').and.callThrough();
    });

    describe('sends a post request', () => {
      beforeEach(() => {
        payload = {
          params: {
            phoneNumber: '+61412345678',
            subdomain: 'bob',
            keyword: 'Support'
          }
        };

        http.callMeRequest('http://talk_service.com', payload);
      });

      it('with the correct url', () => {
        expect(mockSuperagent)
          .toHaveBeenCalledWith('POST', 'http://talk_service.com/talk_embeddables_service/callback_request');
      });

      it('with the specified params', () => {
        expect(mockMethods.send)
          .toHaveBeenCalledWith(payload.params);
      });
    });
  });

  describe('#automaticAnswersApiRequest', () => {
    let config,
      mockSuperagent,
      payload,
      formData,
      articleId = 10001,
      authToken = 'abc';

    beforeEach(() => {
      config = {
        zendeskHost: 'lolz.zendesk.host'
      };
      mockSuperagent = mockRegistry.superagent;
    });

    describe('when zendeskHost is not set in config', () => {
      beforeEach(() => {
        http.init();
      });

      it('should throw an exception', () => {
        expect(() => http.automaticAnswersApiRequest(payload))
          .toThrow();
      });
    });

    describe('when zendeskHost is set in config', () => {
      beforeEach(() => {
        http.init(config);
        payload = {
          method: 'get',
          path: `/test/fetch?auth_token=${authToken}`,
          callbacks: {
            done: noop,
            fail: noop
          }
        };
        spyOn(payload.callbacks, 'done');
        spyOn(payload.callbacks, 'fail');
        spyOn(mockMethods, 'end').and.callThrough();
        spyOn(mockMethods, 'send').and.callThrough();
        spyOn(mockMethods, 'type').and.callThrough();
        spyOn(mockMethods, 'query').and.callThrough();
      });

      describe('when sending a POST request', () => {
        beforeEach(() => {
          payload = {
            path: '/test/solve',
            queryParams: {
              source: 'embed',
              mobile: false
            },
            method: 'post'
          };
          formData = {
            'auth_token' : authToken,
            'article_id' : articleId
          };
          http.automaticAnswersApiRequest(payload, formData);
        });

        it('sets the correct http method and path', () => {
          expect(mockSuperagent)
            .toHaveBeenCalledWith(
              'POST',
              'https://lolz.zendesk.host/test/solve');
        });

        it('appends query params to the url', () => {
          expect(mockMethods.query)
            .toHaveBeenCalledWith(payload.queryParams);
        });

        it('sets the correct type to avoid a CORS failure', () => {
          expect(mockMethods.type)
            .toHaveBeenCalledWith('form-data');
        });

        it('sends the correct form data', () => {
          expect(mockMethods.send)
            .toHaveBeenCalledWith({ 'auth_token' : 'abc', 'article_id': 10001 });
        });
      });

      describe('when sending a GET request', () => {
        beforeEach(() => {
          http.automaticAnswersApiRequest(payload);
        });

        it('sets the correct http method and path', () => {
          expect(mockSuperagent)
            .toHaveBeenCalledWith(
              'GET',
              `https://lolz.zendesk.host/test/fetch?auth_token=${authToken}`);
        });

        it('sends an empty form data object', () => {
          expect(mockMethods.send)
            .toHaveBeenCalledWith({});
        });
      });

      describe('when a response is received', () => {
        let recentCall,
          callback;

        beforeEach(() => {
          http.automaticAnswersApiRequest(payload);
          expect(mockMethods.end)
            .toHaveBeenCalled();

          recentCall = mockMethods.end.calls.mostRecent();
          callback = recentCall.args[0];
        });

        it('triggers the done callback if response is successful', () => {
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
