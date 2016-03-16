describe('authentication', function() {
  let authentication,
    mockRegistry;
  const authenticationPath = buildSrcPath('service/authentication');

  beforeEach(function() {
    mockery.enable();

    mockRegistry = initMockRegistry({
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['send'])
      },
      'service/persistence': {
        store: {
          get: noop,
          set: noop,
          remove: noop
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'lodash': _
    });

    mockery.registerAllowable(authenticationPath);
    authentication = requireUncached(authenticationPath).authentication;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    describe('mediator subscriptions', function() {
      let mockMediator,
        mockTransport;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockTransport = mockRegistry['service/transport'].transport;

        authentication.init();
      });

      it('should subscribe to authentication.authenticate', function() {
        const params = { webToken: 'abc' };

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('authentication.authenticate', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'authentication.authenticate')(params);

        expect(mockTransport.send)
          .toHaveBeenCalled();

        const transportPayload = mockTransport.send.calls.mostRecent().args[0];

        expect(transportPayload.params.webToken)
          .toEqual(params.webToken);
      });
    });
  });

  describe('authenticating a user', function() {
    let mockTransport;
    const token = { webToken: 'abc' };

    beforeEach(function() {
      mockTransport = mockRegistry['service/transport'];

      authentication.init();
      authentication.authenticate(token);
    });

    describe('#authenticate', function() {
      it('sends the correct payload', function() {
        expect(mockTransport.transport.send)
          .toHaveBeenCalled();

        const payload = mockTransport.transport.send.calls.mostRecent().args[0];

        expect(payload.method)
          .toBe('POST');

        expect(payload.path)
          .toBe('/embeddable/authenticate');

        const params = payload.params;

        expect(params.webToken)
          .toEqual('abc');
      });
    });

    describe('#getToken', function() {
      let mockPersistence;
      const expiryTime = 1000 * 60 * 30;

      beforeEach(function() {
        mockPersistence = mockRegistry['service/persistence'];
      });

      it('should return the oauth token cached in local storage', function() {
        spyOn(mockPersistence.store, 'get')
          .and
          .returnValue({ token: 'abc', expiry: Date.now() + expiryTime });

        expect(authentication.getToken())
          .toEqual('abc');
      });

      it('should return null if the cached oauth token is expired', function() {
        spyOn(mockPersistence.store, 'get')
          .and
          .returnValue({ token: 'abc', expiry: Date.now() - expiryTime });

        expect(authentication.getToken())
          .toEqual(null);
      });
    });
  });
});
