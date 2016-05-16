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
        store: jasmine.createSpyObj('store', ['set', 'get', 'remove'])
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
        },
        isOnHelpCenterPage: () => true
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

    it('Clears userEmail from session storage if present', function() {
      const mockPersistence = mockRegistry['service/persistence'];

      mockPersistence.store.get = () => 'bob@gmail.com';

      beacon.init();

      expect(mockPersistence.store.remove)
        .toHaveBeenCalledWith('identifyEmail', true);
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

      it('should subscribe to beacon.trackUserAction', function() {
        const params = {
          category: 'launcher',
          action: 'clicked',
          name: 'launcher'
        };

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('beacon.trackUserAction', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'beacon.trackUserAction')(params);

        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

        expect(transportPayload.params.userAction)
          .toEqual(params);
      });
    });

    it('should send a pageview blip', function() {
      beacon.init();

      const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

      expect(mockTransport.sendWithMeta)
        .toHaveBeenCalled();

      expect(transportPayload.params.pageView)
        .toBeDefined();
    });
  });

  describe('#sendPageView', function() {
    it('sends correct payload using transport.send', function() {
      const mockTransport = mockRegistry['service/transport'];
      const mockGlobals = mockRegistry['utility/globals'];
      const mockUtils = mockRegistry['utility/utils'];

      beacon.init();
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

      expect(params.pageView.helpCenterDedup)
        .toBe(mockUtils.isOnHelpCenterPage());
    });
  });

  describe('#trackUserAction', function() {
    it('should not send anything if the first two properties are not provided', function() {
      const mockTransport = mockRegistry['service/transport'];

      beacon.trackUserAction({});
      beacon.trackUserAction({ category: 'only one param' });
      beacon.trackUserAction({ action: 'second param' });
      beacon.trackUserAction({ name: 'third param' });

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

      beacon.trackUserAction(userActionParams);

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
    let mockTransport,
      mockGlobals;

    const name = 'John';
    const email = 'john@example.com';

    beforeEach(function() {
      mockTransport = mockRegistry['service/transport'];
      mockGlobals = mockRegistry['utility/globals'];

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

      expect(params.userAgent)
        .toEqual(mockGlobals.navigator.userAgent);
    });
  });
});
