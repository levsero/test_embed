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
          remove: jasmine.createSpy('store.remove')
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

  describe('authenticate', function() {
    beforeEach(function() {
      const token = { webToken: 'abc' };

      authentication.init();
      authentication.authenticate(token);
    });

    it('clears existing zE_oauth objects from localstorage', function() {
      const mockPersistence = mockRegistry['service/persistence'];

      expect(mockPersistence.store.remove)
        .toHaveBeenCalledWith('zE_oauth');
    });

    it('sends the correct payload', function() {
      const mockTransport = mockRegistry['service/transport'];

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
});
