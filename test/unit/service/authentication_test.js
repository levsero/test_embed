const jsonwebtoken = require('jsonwebtoken');

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
      'utility/globals': {
        win: {
          atob: window.atob,
          btoa: window.btoa
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
      it('should subscribe to authentication.authenticate', function() {
        const mockMediator = mockRegistry['service/mediator'].mediator;

        authentication.init();

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('authentication.authenticate', jasmine.any(Function));
      });
    });
  });

  describe('authenticate', function() {
    let mockStore,
      mockTransport,
      jwtPayload,
      jwt;

    beforeEach(function() {
      mockTransport = mockRegistry['service/transport'].transport;
      mockStore = mockRegistry['service/persistence'].store;

      mockStore.get = function() {
        return { id: window.btoa('jbob@zendesk.com') };
      };

      jwtPayload = {
        'iat': 1458011438,
        'jti': '1234567890',
        'name': 'Jim Bob',
        'email': 'jbob@zendesk.com'
      };
      jwt = jsonwebtoken.sign(jwtPayload, 'pencil');

      authentication.init();
    });

    describe('when a token is stored in localstorage for the user', function() {
      beforeEach(function() {
        authentication.authenticate(jwt);
      });

      it('does not clear the zE_oauth objects from localstorage', function() {
        expect(mockStore.remove)
          .not.toHaveBeenCalled();
      });

      it('does not request a new token', function() {
        expect(mockTransport.send)
          .not.toHaveBeenCalled();
      });
    });

    describe('when a token is stored in localstorage for a different user', function() {
      beforeEach(function() {
        mockStore.get = function() {
          return { id: window.btoa('someone@example.com') };
        };

        authentication.authenticate(jwt);
      });

      it('clears existing zE_oauth objects from localstorage', function() {
        expect(mockStore.remove)
          .toHaveBeenCalledWith('zE_oauth');
      });

      it('requests a new OAuth token', function() {
        const payload = mockTransport.send.calls.mostRecent().args[0];
        const params = payload.params;

        expect(mockTransport.send)
          .toHaveBeenCalled();

        expect(payload.method)
          .toBe('POST');

        expect(payload.path)
          .toBe('/embeddable/authenticate');

        expect(params.body)
          .toEqual(jwt);
      });
    });

    describe('when there is no token stored in localstorage', function() {
      beforeEach(function() {
        mockStore.get = function() {
          return null;
        };

        authentication.authenticate(jwt);
      });

      it('clears existing zE_oauth objects from localstorage', function() {
        expect(mockStore.remove)
          .toHaveBeenCalledWith('zE_oauth');
      });

      it('requests a new OAuth token', function() {
        const payload = mockTransport.send.calls.mostRecent().args[0];
        const params = payload.params;

        expect(mockTransport.send)
          .toHaveBeenCalled();

        expect(payload.method)
          .toBe('POST');

        expect(payload.path)
          .toBe('/embeddable/authenticate');

        expect(params.body)
          .toEqual(jwt);
      });
    });
  });
});
