describe('embed.ipm.api', () => {
  let api,
    transportGetSpy,
    transportSendSpy;

  const apiPath = buildSrcPath('embed/ipm/api');

  beforeEach(() => {
    mockery.enable();

    transportGetSpy = jasmine.createSpy('http.get');
    transportSendSpy = jasmine.createSpy('http.send');

    initMockRegistry({
      'service/transport': {
        http: {
          get: transportGetSpy,
          send: transportSendSpy
        }
      }
    });

    mockery.registerAllowable(apiPath);

    ({ api } = requireUncached(apiPath));
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('get', () => {
    let result,
      error,
      resolve,
      reject;

    describe('with a successful request', () => {
      beforeEach(() => {
        transportGetSpy.and.callFake(({ callbacks: { done: doneCallback } }) => {
          doneCallback({
            body: {
              'some_response': 42
            }
          });
        });
        result = null;
        error = null;
        resolve = (value) => { result = value; };
        reject = (err) => { error = err; };
        api.get('foobar', { someParam: true }, resolve, reject);
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

      it('calls resolve callback with camelized result', () => {
        expect(result).toEqual({
          'someResponse': 42
        });
      });
    });

    describe('with a failed request', () => {
      const err = new Error('bad times');

      beforeEach(() => {
        transportGetSpy.and.callFake(({ callbacks: { fail } }) => {
          fail(err);
        });
        result = api.get('foobar', { someParam: true }, resolve, reject);
      });

      it('calls reject callback with error', () => {
        expect(error).toEqual(err);
      });
    });
  });

  describe('post', () => {
    let result,
      error,
      resolve,
      reject;

    describe('with a successful request', () => {
      beforeEach(() => {
        transportSendSpy.and.callFake(({ callbacks: { done: doneCallback } }) => {
          doneCallback({
            body: {
              'some_response': 42
            }
          });
        });
        result = null;
        error = null;
        resolve = (value) => { result = value; };
        reject = (err) => { error = err; };
        api.post('foobar', { someParam: true }, resolve, reject);
      });

      it('calls transport send with path and decamelized params', () => {
        expect(transportSendSpy).toHaveBeenCalledWith(jasmine.objectContaining({
          method: 'post',
          path: 'foobar',
          params: {
            'some_param': true
          }
        }));
      });

      it('calls resolve callback with camelized result', () => {
        expect(result).toEqual({
          'someResponse': 42
        });
      });
    });

    describe('with a failed request', () => {
      const err = new Error('bad times');

      beforeEach(() => {
        transportSendSpy.and.callFake(({ callbacks: { fail } }) => {
          fail(err);
        });
        result = api.post('foobar', { someParam: true }, resolve, reject);
      });

      it('calls reject callback with error', () => {
        expect(error).toEqual(err);
      });
    });
  });
});
