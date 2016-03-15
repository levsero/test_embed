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
          get: function() { return null; },
          remove: jasmine.createSpy('store.remove')
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'utility/globals': {
        win: {
          atob: noop,
          btoa: noop
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
      const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0NTgwMTE0MzgsImp0aSI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiQWRyaWFuIEV2YW5zIiwiZW1haWwiOiJhZXZhbnNAemVuZGVzay5jb20ifQ.sMM-1hA8g2hXtKeHfvtSO-4nRatycpsKK6f5NxOUXzk';

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockTransport = mockRegistry['service/transport'].transport;
        mockRegistry['utility/globals'].win.atob = function() {
          return '{ "iat": 1458011438, "jti": "1234567890", "name": "Adrian Evans", "email": "aevans@zendesk.com" }';
        };
        mockRegistry['utility/globals'].win.btoa = function() {
          return 'YWV2YW5zQHplbmRlc2suY29t';
        };

        authentication.init();
      });

      it('should subscribe to authentication.authenticate', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('authentication.authenticate', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'authentication.authenticate')(token);

        expect(mockTransport.send)
          .toHaveBeenCalled();

        const transportPayload = mockTransport.send.calls.mostRecent().args[0];

        expect(transportPayload.params.body)
          .toEqual(token);
      });
    });
  });

  describe('authenticate', function() {
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE0NTgwMTE0MzgsImp0aSI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiQWRyaWFuIEV2YW5zIiwiZW1haWwiOiJhZXZhbnNAemVuZGVzay5jb20ifQ.sMM-1hA8g2hXtKeHfvtSO-4nRatycpsKK6f5NxOUXzk';

    beforeEach(function() {
      mockRegistry['utility/globals'].win.atob = function() {
        return '{ "iat": 1458011438, "jti": "1234567890", "name": "Adrian Evans", "email": "aevans@zendesk.com" }';
      };
      mockRegistry['utility/globals'].win.btoa = function() {
        return 'YWV2YW5zQHplbmRlc2suY29t';
      };

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

      expect(params.body)
        .toEqual(token);
    });
  });
});
