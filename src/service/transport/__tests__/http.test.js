import { http } from '../http';
import superagent from 'superagent';

jest.mock('superagent');
jest.mock('service/settings', () => {
  return {
    settings: {
      get: () => 48
    }
  };
});

beforeEach(() => {
  superagent.__clearInstances();

  http.init();
});

describe('#init', () => {
  it('uses defaults', () => {
    http.init();

    expect(http.getConfig())
      .toEqual({
        scheme: 'https',
        insecureScheme: 'http'
      });
  });

  it('can override defaults', () => {
    http.init({
      x: 123,
      scheme: 'blah'
    });

    expect(http.getConfig())
      .toEqual({
        scheme: 'blah',
        insecureScheme: 'http',
        x: 123
      });
  });
});

describe('#updateConfig', () => {
  beforeEach(() => {
    const testConfig = {
      test: 'config',
      a: 'b'
    };

    http.init(testConfig);
  });

  it('updates the config', () => {
    http.updateConfig({ test: 'config2' });

    expect(http.getConfig())
      .toEqual(expect.objectContaining({
        test: 'config2',
        a: 'b'
      }));
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
        done: jest.fn(),
        fail: jest.fn(),
        always: jest.fn()
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

      http.init(config);
      http.send(payload);

      expect(superagent.__mostRecent().send)
        .toHaveBeenCalledWith({});
    });
  });

  describe('if it is a GET request', () => {
    it('does not pass through params if they are not defined', () => {
      payload.method = 'get';
      delete payload.params;

      http.init(config);
      http.send(payload);

      expect(superagent.__mostRecent().send)
        .not.toHaveBeenCalled();
    });
  });

  describe('query string', () => {
    beforeEach(() => {
      global.__DEV__ = false;
    });

    it('sends a query string if payload contains it', () => {
      payload.query = { hello: 'there' };

      http.init(config);
      http.send(payload);

      expect(superagent.__mostRecent().query)
        .toHaveBeenCalledWith(payload.query);
    });

    it('does not send a query string if the payload does not contain it', () => {
      payload.query = {};

      http.init(config);
      http.send(payload);

      expect(superagent.__mostRecent().query)
        .not.toHaveBeenCalled();
    });
  });

  describe('Accept-Language', () => {
    beforeEach(() => {
      payload.locale = 'fr';
      payload.Authorization = undefined;

      http.init(config);
      http.send(payload);
    });

    it('sends the Accept-Language if payload contains a locale', () => {
      expect(superagent.__mostRecent().set)
        .toHaveBeenCalledWith('Accept-Language', 'fr');
    });
  });

  it('throws an exception if zendeskHost is not set in config', () => {
    http.init();

    expect(() => {
      http.send(payload);
    }).toThrow();
  });

  it('sets the correct http method and url on superagent', () => {
    http.init(config);
    http.send(payload);

    expect(superagent)
      .toHaveBeenCalledWith(
        'GET',
        'https://test.zendesk.host/test/path');
  });

  describe('type header', () => {
    it('sets the json type by default', () => {
      http.init(config);
      http.send(payload);

      expect(superagent.__mostRecent().type)
        .toHaveBeenCalledWith('json');
    });

    it('does not send a json type if explicitly omitted', () => {
      http.init(config);
      http.send(payload, false);

      expect(superagent.__mostRecent().type)
        .not.toHaveBeenCalled();
    });
  });

  describe('if response is successful', () => {
    it('triggers the done and always callbacks', () => {
      http.init(config);
      http.send(payload);

      expect(superagent.__mostRecent().end)
        .toHaveBeenCalled();

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
      http.init(config);
      http.send(payload);

      expect(superagent.__mostRecent().end)
        .toHaveBeenCalled();

      const calls = superagent.__mostRecent().end.mock.calls;

      const recentCall = calls[calls.length - 1];

      const callback = recentCall[0];

      callback({error: true}, undefined);

      expect(payload.callbacks.fail)
        .toHaveBeenCalled();

      expect(payload.callbacks.always)
        .toHaveBeenCalled();
    });
  });

  it('will not die if callbacks object is not present', () => {
    delete payload.callbacks;

    http.init(config);
    http.send(payload);

    const calls = superagent.__mostRecent().end.mock.calls;

    const recentCall = calls[calls.length - 1];

    const callback = recentCall[0];

    expect(() => {
      callback(null, {ok: true});
    }).not.toThrow();
  });

  it('will not die if callbacks.done is not present', () => {
    delete payload.callbacks.done;

    http.init(config);
    http.send(payload);

    const calls = superagent.__mostRecent().end.mock.calls;

    const recentCall = calls[calls.length - 1];

    const callback = recentCall[0];

    expect(() => {
      callback(null, {ok: true});
    }).not.toThrow();
  });

  it('will not die if callbacks.fail is not present', () => {
    delete payload.callbacks.fail;

    http.init(config);
    http.send(payload);

    const calls = superagent.__mostRecent().end.mock.calls;

    const recentCall = calls[calls.length - 1];

    const callback = recentCall[0];

    expect(() => {
      callback({error: true}, undefined);
    }).not.toThrow();
  });

  describe('when not forcing http', () => {
    let urlArg;

    beforeEach(() => {
      http.init(config);
      http.send(payload);

      urlArg = superagent.mock.calls[0][1];
    });

    it('uses the protocol from the config', () => {
      expect(urlArg)
        .toEqual(expect.stringContaining(config.scheme));
    });

    it('uses the zendesk domain from the config', () => {
      expect(urlArg)
        .toEqual(expect.stringContaining(config.zendeskHost));
    });
  });

  describe('when forcing http', () => {
    let urlArg;

    beforeEach(() => {
      payload.forceHttp = true;

      http.init(config);
      http.send(payload);

      urlArg = superagent.mock.calls[0][1];
    });

    it('uses the http protocol', () => {
      expect(urlArg)
        .toEqual(expect.stringContaining('http:'));
    });
  });

  describe('when useHostMappingIfAvailable is set', () => {
    let urlArg;

    beforeEach(() => {
      payload.useHostMappingIfAvailable = true;
      config.hostMapping = 'help.x.yz';

      http.init(config);
      http.send(payload);

      urlArg = superagent.mock.calls[0][1];
    });

    it('uses the hostmapped domain', () => {
      expect(urlArg)
        .toEqual(expect.stringContaining('help.x.yz'));
    });
  });
});

describe('getImage', () => {
  let payload,
    config,
    onEndHandler;

  beforeEach(() => {
    payload = {
      method: 'get',
      path: 'https://url.com/image',
      authorization: 'abc',
      callbacks: {
        done: jest.fn(),
        fail: jest.fn()
      }
    };

    http.init(config);
    http.getImage(payload);

    onEndHandler = superagent.__mostRecent().end.mock.calls[0][0];
  });

  it('sets the correct http method and url on superagent', () => {
    expect(superagent)
      .toHaveBeenCalledWith('get', payload.path);
  });

  it('sets the responseType to `blob`', () => {
    expect(superagent.__mostRecent().responseType)
      .toHaveBeenCalledWith('blob');
  });

  it('sets an authentication header with `Bearer <token>`', () => {
    expect(superagent.__mostRecent().set)
      .toHaveBeenCalledWith('Authorization', payload.authorization);
  });

  describe('when there is no error', () => {
    let res;

    beforeEach(() => {
      res = { ok: true };
      onEndHandler(null, res);
    });

    it('invokes the done callback', () => {
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

    it('invokes the fail callback', () => {
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
        done: jest.fn(),
        fail: jest.fn(),
        progress: jest.fn()
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

    it('throws an exception', () => {
      expect(() => http.send(payload))
        .toThrow();
    });
  });

  describe('when zendeskHost is set in config', () => {
    beforeEach(() => {
      http.init(config);
    });

    describe('when callbacks are present', () => {
      beforeEach(() => {
        http.sendFile(payload);
      });

      it('sets the correct http method and path', () => {
        expect(superagent)
          .toHaveBeenCalledWith(
            'POST',
            'https://test.zendesk.host/test/path');
      });

      it('adds a query string with the filename', () => {
        expect(superagent.__mostRecent().query)
          .toHaveBeenCalledWith({ filename: 'fakeFile' });
      });

      it('adds a query string with the web_widget via_id', () => {
        /* eslint camelcase:0 */
        expect(superagent.__mostRecent().query)
          .toHaveBeenCalledWith({ via_id: 48 });
      });

      it('adds the file data with the key `uploaded_data`', () => {
        expect(superagent.__mostRecent().attach)
          .toHaveBeenCalledWith('uploaded_data', payload.file);
      });

      it('triggers the done callback if response is successful', () => {
        expect(superagent.__mostRecent().end)
          .toHaveBeenCalled();

        const callback = superagent.__mostRecent().end.mock.calls[0][0];

        callback(null, { ok: true });

        expect(payload.callbacks.done)
          .toHaveBeenCalled();

        expect(payload.callbacks.fail)
          .not.toHaveBeenCalled();
      });

      it('triggers the fail callback if response is unsuccessful', () => {
        expect(superagent.__mostRecent().end)
          .toHaveBeenCalled();

        const callback = superagent.__mostRecent().end.mock.calls[0][0];

        callback({ error: true }, undefined);

        expect(payload.callbacks.fail)
          .toHaveBeenCalled();
      });
    });

    describe('when callbacks object is not present', () => {
      beforeEach(() => {
        delete payload.callbacks;

        http.sendFile(payload);
      });

      it('will not die', () => {
        const callback = superagent.__mostRecent().end.mock.calls[0][0];

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
        const callback = superagent.__mostRecent().end.mock.calls[0][0];

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
        const callback = superagent.__mostRecent().end.mock.calls[0][0];

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
        const callback = superagent.__mostRecent().on.mock.calls[0][1];

        expect(() => callback({ percent: 10 }))
          .not.toThrow();
      });
    });
  });
});

describe('callMeRequest', () => {
  let payload;

  beforeEach(() => {
    http.init();
  });

  describe('sends a post request', () => {
    beforeEach(() => {
      payload = {
        params: {
          phoneNumber: '+61412345678',
          subdomain: 'bob',
          keyword: 'Support'
        },
        callbacks: {
          done: jest.fn(),
          fail: jest.fn()
        }
      };

      http.callMeRequest('http://talk_service.com', payload);
    });

    it('with the correct url', () => {
      expect(superagent)
        .toHaveBeenCalledWith('POST', 'http://talk_service.com/talk_embeddables_service/callback_request');
    });

    it('with the specified params', () => {
      expect(superagent.__mostRecent().send)
        .toHaveBeenCalledWith(payload.params);
    });
  });
});

describe('getDynamicHostname', () => {
  let result,
    mockConfig;

  describe('when useHostmappingIfAvailable is true', () => {
    describe('when config.hostMapping exists', () => {
      beforeEach(() => {
        mockConfig = {
          hostMapping: 'super.mofo.io',
          zendeskHost: 'dbradfordstaging999.zendesk-staging.com'
        };
        http.init(mockConfig);
        result = http.getDynamicHostname(true);
      });

      it('returns the config.hostMapping', () => {
        expect(result)
          .toEqual(mockConfig.hostMapping);
      });
    });

    describe('when config.hostMapping does not exist', () => {
      beforeEach(() => {
        mockConfig = {
          zendeskHost: 'dbradfordstaging999.zendesk-staging.com'
        };
        http.init(mockConfig);
        result = http.getDynamicHostname(true);
      });

      it('returns the config.zendeskHost', () => {
        expect(result)
          .toEqual(mockConfig.zendeskHost);
      });
    });
  });

  describe('when useHostmappingIfAvailable is false', () => {
    beforeEach(() => {
      mockConfig = {
        hostMapping: 'super.mofo.io',
        zendeskHost: 'dbradfordstaging999.zendesk-staging.com'
      };
      http.init(mockConfig);
      result = http.getDynamicHostname(false);
    });

    it('returns the config.zendeskHost', () => {
      expect(result)
        .toEqual(mockConfig.zendeskHost);
    });
  });
});
