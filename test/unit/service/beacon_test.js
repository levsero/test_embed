describe('beacon', function() {
  let beacon,
    mockRegistry;
  const localeId = 10;
  const beaconPath = buildSrcPath('service/beacon');

  beforeEach(function() {
    mockery.enable();

    mockRegistry = initMockRegistry({
      'service/transport': {
        transport: jasmine.createSpyObj('transport', ['send', 'sendWithMeta'])
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'utility/globals': {
        win: {
          location: {
            origin: 'http://window.location.origin',
            href: 'http://window.location.href'
          }
        },
        document: {
          referrer: 'http://document.referrer',
          title: 'Document Title'
        },
        navigator: {
          language: 'navigator.language',
          userAgent: 'navigator.userAgent'
        }
      },
      'service/identity': {
        identity: {
          getBuid: jasmine.createSpy('getBuid').and.returnValue('abc123')
        }
      },
      'service/persistence': {
        store: jasmine.createSpyObj('store', ['set', 'get'])
      },
      'service/i18n': {
        i18n: {
          getLocaleId: jasmine.createSpy('getLocaleId').and.returnValue(localeId)
        }
      },
      'utility/utils': {
        parseUrl: function() {
          return {
            href: 'http://document.referrer'
          };
        },
        getFrameworkLoadTime: function() {
          return 200;
        }
      },
      'lodash': _
    });

    mockery.registerAllowable(beaconPath);
    beacon = requireUncached(beaconPath).beacon;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', function() {
    let mockTransport;

    beforeEach(function() {
      mockTransport = mockRegistry['service/transport'].transport;
    });

    it('Saves the currentTime', function() {
      const currentTime = Date.now();
      const mockPersistence = mockRegistry['service/persistence'];

      beacon.init();

      expect(mockPersistence.store.set)
        .toHaveBeenCalled();

      const recentCall = mockPersistence.store.set.calls.mostRecent();

      expect(recentCall.args[0])
        .toEqual('currentTime');

      const resultTime = recentCall.args[1];

      expect(resultTime > (currentTime - 30))
        .toBeTruthy();

      expect(resultTime < (currentTime + 30))
        .toBeTruthy();
    });

    describe('mediator subscriptions', function() {
      let mockMediator;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;

        beacon.init();
      });

      it('should subscribe to beacon.identify', function() {
        const params = {
          name: 'James Dean',
          email: 'james@dean.com'
        };

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('beacon.identify', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'beacon.identify')(params);

        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

        expect(transportPayload.params.user.name)
          .toEqual(params.name);

        expect(transportPayload.params.user.email)
          .toEqual(params.email);
      });
    });

    it('should send a pageview blip if identify is not being used', function() {
      beacon.init(false);

      expect(mockTransport.sendWithMeta)
        .toHaveBeenCalled();
    });
  });

  describe('#sendPageView', function() {
    it('sends correct payload using transport.send', function() {
      const mockTransport = mockRegistry['service/transport'];
      const mockGlobals = mockRegistry['utility/globals'];
      const mockUtils = mockRegistry['utility/utils'];

      beacon.init();
      beacon.sendPageView();
      expect(mockTransport.transport.sendWithMeta).toHaveBeenCalled();

      const payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];

      expect(payload.method)
        .toBe('POST');

      expect(payload.path)
        .toBe('/embeddable/blips');

      const params = payload.params;

      expect(params.pageView.userAgent)
        .toBe(mockGlobals.navigator.userAgent);

      expect(params.pageView.referrer)
        .toBe(mockUtils.parseUrl().href);

      expect(params.pageView.navigatorLanguage)
        .toBe(mockGlobals.navigator.language);

      expect(params.pageView.pageTitle)
        .toBe(mockGlobals.document.title);

      expect(params.pageView.time)
        .toBeDefined();

      expect(params.pageView.loadTime)
        .toBe(mockUtils.getFrameworkLoadTime());
    });
  });

  describe('#trackUserAction', function() {
    it('should not send anything if the first two params are not provided', function() {
      const mockTransport = mockRegistry['service/transport'];

      beacon.trackUserAction();
      beacon.trackUserAction('only one param');
      beacon.trackUserAction(undefined, 'second param');
      beacon.trackUserAction(undefined, undefined, 'third param');

      expect(mockTransport.transport.send)
        .not.toHaveBeenCalled();
    });

    it('sends the correct payload', function() {
      const userActionParams = {
        category: 'Category01',
        action: 'Action02',
        label: 'Label03',
        value: 'Value04'
      };
      const mockTransport = mockRegistry['service/transport'];

      beacon.init();

      beacon.trackUserAction(
        userActionParams.category,
        userActionParams.action,
        userActionParams.label,
        userActionParams.value
      );

      expect(mockTransport.transport.sendWithMeta)
        .toHaveBeenCalled();

      const payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];

      expect(payload.method)
        .toBe('POST');

      expect(payload.path)
        .toBe('/embeddable/blips');

      const params = payload.params;

      expect(params.userAction)
        .toEqual(userActionParams);
    });
  });

  describe('identify', function() {
    let mockStore,
      mockTransport;

    const name = 'John';
    const email = 'john@example.com';

    beforeEach(function() {
      mockStore = mockRegistry['service/persistence'];
      mockTransport = mockRegistry['service/transport'];

      spyOn(beacon, 'sendPageView');

      beacon.init(true);
      beacon.identify({ name: name, email: email });
    });

    it('sends the correct payload', function() {
      expect(mockTransport.transport.sendWithMeta)
        .toHaveBeenCalled();

      const payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];

      expect(payload.method)
        .toBe('POST');

      expect(payload.path)
        .toBe('/embeddable/identify');

      const params = payload.params;

      expect(params.user.name)
        .toEqual(name);

      expect(params.user.email)
        .toEqual(email);

      expect(params.user.localeId)
        .toEqual(localeId);
    });

    it('sends out a page view blip containing the users email', function() {
      let payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];

      mockStore.store.get = () => email;

      payload.callbacks.done({ body: '' });
      payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];

      const pageView = payload.params.pageView;

      expect(pageView.email)
        .toEqual(email);
    });

    it('stores the user email in SessionStorage', function() {
      expect(mockStore.store.set)
        .toHaveBeenCalledWith('identifyEmail', email, true);
    });
  });
});
