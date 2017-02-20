import { camelizeKeys, decamelizeKeys } from 'humps';

describe('embed.ipm.apiGet', () => {
  let apiGet,
    transportGetSpy;

  const apiGetPath = buildSrcPath('embed/ipm/apiGet');

  beforeEach(() => {
    mockery.enable();

    transportGetSpy = jasmine.createSpy('transport.get');

    initMockRegistry({
      'humps': {
        camelizeKeys,
        decamelizeKeys
      },
      'service/transport': {
        transport: {
          get: transportGetSpy
        }
      }
    });

    mockery.registerAllowable(apiGetPath);

    apiGet = requireUncached(apiGetPath).default;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('apiGet', () => {
    let result;

    describe('with a successful request', () => {
      beforeEach(() => {
        transportGetSpy.and.callFake(({ callbacks: { done: doneCallback } }) => {
          doneCallback({
            body: {
              'some_response': 42
            }
          });
        });
        result = apiGet('foobar', { someParam: true });
      });

      it('returns a promise', () => {
        expect(result instanceof Promise).toBeTruthy;
      });

      it('calls transport get with path and decamelized keys', () => {
        expect(transportGetSpy).toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'get',
          path: 'foobar',
          query: {
            'some_param': true
          }
        }));
      });

      it('resolves promise with camelized result', (done) => {
        result.then((body) => {
          expect(body).toEqual({
            'someResponse': 42
          });
          done();
        });
      });
    });

    describe('with a failed request', () => {
      const error = new Error('bad times');

      beforeEach(() => {
        transportGetSpy.and.callFake(({ callbacks: { fail } }) => {
          fail(error);
        });
        result = apiGet('foobar', { someParam: true });
      });

      it('rejects promise with error', (done) => {
        result.catch((e) => {
          expect(e).toEqual(error);
          done();
        });
      });
    });
  });
});
