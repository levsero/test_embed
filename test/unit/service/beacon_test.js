describe('beacon', function() {
  let beacon,
    mockRegistry;
  const localeId = 10;
  const beaconPath = buildSrcPath('service/beacon');
  const mockSettings = { webWidget: 'foo' };

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
      'service/settings': {
        settings: {
          getTrackSettings: jasmine.createSpy('getTrackSettings').and.returnValue(mockSettings)
        }
      },
      'utility/globals': {
        win: {
          location: {
            origin: 'http://window.location.origin',
            href: 'http://window.location.href'
          },
          zESettings: null
        },
        document: {
          referrer: 'http://document.referrer',
          title: 'Document Title',
          readyState: 'complete',
          addEventListener: noop
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
        }
      },
      'utility/pages': {
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

    describe('when there is a zESettings object on the page', function() {
      beforeEach(() => {
        mockRegistry['utility/globals'].win.zESettings = mockSettings;
        beacon.init();
      });

      it('gets the settings from settings service', () => {
        expect(mockRegistry['service/settings'].settings.getTrackSettings)
          .toHaveBeenCalled();
      });

      it('sends a settings blip', () => {
        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        // page view is most recent call so we need to look at the first one
        const transportPayload = mockTransport.sendWithMeta.calls.first().args[0];

        expect(transportPayload.params.settings)
          .toEqual(mockSettings);
      });
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
          label: 'launcher',
          value: null
        };

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('beacon.trackUserAction', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'beacon.trackUserAction')(
          params.category,
          params.action,
          params.label
        );

        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

        expect(transportPayload.params.userAction)
          .toEqual(params);
      });
    });

    describe('sending a page view blip', function() {
      let mockDocument;

      beforeEach(function() {
        mockDocument = mockRegistry['utility/globals'].document;
      });

      it('if the document has readyState `complete` it should send a pageview blip', function() {
        mockDocument.readyState = 'complete';

        beacon.init();

        const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        expect(transportPayload.params.pageView)
          .toBeDefined();
      });

      it('if the document has readyState `interactive` it should send a pageview blip', function() {
        mockDocument.readyState = 'interactive';

        beacon.init();

        const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        expect(transportPayload.params.pageView)
          .toBeDefined();
      });

      it('if the document has readyState `loading` it should not send a pageview blip', function() {
        mockDocument.readyState = 'loading';

        beacon.init();

        expect(mockTransport.sendWithMeta)
          .not.toHaveBeenCalled();
      });
    });
  });

  describe('#sendPageView', function() {
    it('sends correct payload using transport.send', function() {
      const mockTransport = mockRegistry['service/transport'];
      const mockGlobals = mockRegistry['utility/globals'];
      const mockUtils = mockRegistry['utility/utils'];
      const mockPages = mockRegistry['utility/pages'];

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
        .toBe(mockPages.isOnHelpCenterPage());
    });
  });

  describe('#trackUserAction', function() {
    it('should not send anything if the first two properties are not provided', function() {
      const mockTransport = mockRegistry['service/transport'];

      beacon.trackUserAction();
      beacon.trackUserAction('only first param', null);
      beacon.trackUserAction(null, 'only second param');
      beacon.trackUserAction(null, null, 'label');

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
