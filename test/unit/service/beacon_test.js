describe('beacon', () => {
  let beacon,
    mockRegistry,
    mockTime,
    mockSha1String,
    mockStore;

  const localeId = 10;
  const beaconPath = buildSrcPath('service/beacon');

  beforeEach(() => {
    mockery.enable();

    mockStore = null;
    mockTime = Math.floor(Date.now() / 1000);
    mockSha1String = '';

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
        store: {
          get: () => mockStore,
          set: jasmine.createSpy('store.set')
        }
      },
      'service/i18n': {
        i18n: {
          getLocaleId: jasmine.createSpy('getLocaleId').and.returnValue(localeId)
        }
      },
      'utility/utils': {
        parseUrl: () => {
          return {
            href: 'http://document.referrer'
          };
        },
        nowInSeconds: () => mockTime,
        sha1: () => mockSha1String
      },
      'utility/pages': {
        isOnHelpCenterPage: () => true
      },
      'lodash': _
    });

    mockery.registerAllowable(beaconPath);
    beacon = requireUncached(beaconPath).beacon;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#init', () => {
    let mockTransport;

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
    });

    it('Saves the currentTime', () => {
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

    describe('mediator subscriptions', () => {
      let mockMediator;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;

        beacon.init();
      });

      it('should subscribe to beacon.identify', () => {
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

      it('should subscribe to beacon.trackUserAction', () => {
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
  });

  describe('#sendPageView', () => {
    const now = new Date(Date.now());
    let mockTransport;

    beforeEach(() => {
      jasmine.clock().mockDate(now);
      document.t = now - 1000;
      mockTransport = mockRegistry['service/transport'].transport;
    });

    describe('sending a page view blip', () => {
      let mockDocument;

      beforeEach(() => {
        mockDocument = mockRegistry['utility/globals'].document;
      });

      it('if the document has readyState `complete` it should send a pageview blip', () => {
        mockDocument.readyState = 'complete';

        beacon.sendPageView();

        const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        expect(transportPayload.params.pageView)
          .toBeDefined();
      });

      it('if the document has readyState `interactive` it should send a pageview blip', () => {
        mockDocument.readyState = 'interactive';

        beacon.sendPageView();

        const transportPayload = mockTransport.sendWithMeta.calls.mostRecent().args[0];

        expect(mockTransport.sendWithMeta)
          .toHaveBeenCalled();

        expect(transportPayload.params.pageView)
          .toBeDefined();
      });

      it('if the document has readyState `loading` it should not send a pageview blip', () => {
        mockDocument.readyState = 'loading';

        beacon.init();

        expect(mockTransport.sendWithMeta)
          .not.toHaveBeenCalled();
      });
    });

    describe('with base64 not turned on', () => {
      it('sends correct payload using transport.send', () => {
        const mockTransport = mockRegistry['service/transport'];
        const mockGlobals = mockRegistry['utility/globals'];
        const mockUtils = mockRegistry['utility/utils'];
        const mockPages = mockRegistry['utility/pages'];

        beacon.sendPageView();

        expect(mockTransport.transport.sendWithMeta).toHaveBeenCalled();

        const payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];
        const useBase64 = mockTransport.transport.sendWithMeta.calls.mostRecent().args[1];

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
          .toBe(1000);

        expect(params.pageView.helpCenterDedup)
          .toBe(mockPages.isOnHelpCenterPage());

        expect(useBase64)
          .not.toBe(true);
      });
    });

    describe('with base64 turned on', () => {
      beforeEach(() => {
        beacon.setConfig({ newBlips: true });
      });

      afterEach(() => {
        beacon.setConfig({});
      });

      it('sends correct payload using transport.send', () => {
        const mockTransport = mockRegistry['service/transport'];

        beacon.sendPageView();

        expect(mockTransport.transport.sendWithMeta).toHaveBeenCalled();

        const payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];
        const useBase64 = mockTransport.transport.sendWithMeta.calls.mostRecent().args[1];

        expect(payload.method)
          .toBe('GET');

        expect(payload.path)
          .toBe('/embeddable/blips');

        expect(useBase64)
          .toBe(true);
      });
    });
  });

  describe('#trackUserAction', () => {
    let userActionParams;

    beforeEach(() => {
      userActionParams = {
        category: 'Category01',
        action: 'Action02',
        label: 'Label03',
        value: 'Value04'
      };
    });

    it('should not send anything if the first two properties are not provided', () => {
      const mockTransport = mockRegistry['service/transport'];

      beacon.trackUserAction();
      beacon.trackUserAction('only first param', null);
      beacon.trackUserAction(null, 'only second param');
      beacon.trackUserAction(null, null, 'label');

      expect(mockTransport.transport.send)
        .not.toHaveBeenCalled();
    });

    it('sends the correct payload', () => {
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

    describe('with base64 turned on', () => {
      beforeEach(() => {
        beacon.setConfig({ newBlips: true });
      });

      afterEach(() => {
        beacon.setConfig({});
      });

      it('sends correct payload using transport.send', () => {
        const mockTransport = mockRegistry['service/transport'];

        beacon.trackUserAction(
          userActionParams.category,
          userActionParams.action,
          userActionParams.label,
          userActionParams.value
        );

        expect(mockTransport.transport.sendWithMeta).toHaveBeenCalled();

        const payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];
        const useBase64 = mockTransport.transport.sendWithMeta.calls.mostRecent().args[1];

        expect(payload.method)
          .toBe('GET');

        expect(payload.path)
          .toBe('/embeddable/blips');

        expect(useBase64)
          .toBe(true);
      });
    });
  });

  describe('#trackSettings', () => {
    const mockSettings = { webWidget: { viaId: 48 } };
    let mockTransport,
      mockPersistence;

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;
      mockPersistence = mockRegistry['service/persistence'];
    });

    describe('when there is a zESettings object on the page', () => {
      beforeEach(() => {
        mockRegistry['utility/globals'].win.zESettings = mockSettings;
        beacon.trackSettings(mockSettings);
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

    describe('when there is no zESettings object on the page', () => {
      it('should not send the settings blip', () => {
        beacon.trackSettings(mockSettings);

        expect(mockTransport.sendWithMeta)
          .not.toHaveBeenCalled();
      });
    });

    describe('when no settings have been changed from the defaults', () => {
      it('should not send the settings blip', () => {
        beacon.trackSettings({});

        expect(mockTransport.sendWithMeta)
          .not.toHaveBeenCalled();
      });
    });

    describe('when there is a settings object in store', () => {
      beforeEach(() => {
        mockRegistry['utility/globals'].win.zESettings = mockSettings;

        mockStore = [['abc123', mockTime]];
      });

      describe('when it contains the same settings as the page', () => {
        it('should not send the settings blip', () => {
          mockSha1String = 'abc123';

          beacon.trackSettings(mockSettings);

          expect(mockTransport.sendWithMeta)
            .not.toHaveBeenCalled();
        });
      });

      describe('when it does not contain the same settings as the page', () => {
        beforeEach(() => {
          mockSha1String = 'cba123';
          beacon.trackSettings(mockSettings);
        });

        it('should send the settings blip', () => {
          expect(mockTransport.sendWithMeta)
            .toHaveBeenCalled();
        });

        it('should update the store with the new settings', () => {
          mockTransport.sendWithMeta.calls.mostRecent().args[0].callbacks.done();

          expect(mockPersistence.store.set)
            .toHaveBeenCalled();

          const newStore = mockPersistence.store.set.calls.mostRecent().args[1];

          expect(newStore[0][0])
            .toBe('abc123');
          expect(newStore[1][0])
            .toBe('cba123');
        });
      });

      describe('when a setting in the store is expired', () => {
        beforeEach(() => {
          const timestamp = mockTime - (24*60*60);

          mockStore = [
            ['abc123', timestamp],
            ['cba123', timestamp],
            ['123abc', mockTime]
          ];
          mockSha1String = 'cba123';
          beacon.trackSettings(mockSettings);
        });

        describe('when the current pages settings are expired', () => {
          beforeEach(() => {
            mockTransport.sendWithMeta.calls.mostRecent().args[0].callbacks.done();
          });

          it('should send the settings blip', () => {
            expect(mockTransport.sendWithMeta)
              .toHaveBeenCalled();
          });

          it('should update the store with the new timestamp', () => {
            expect(mockPersistence.store.set)
              .toHaveBeenCalled();

            const newStore = mockPersistence.store.set.calls.mostRecent().args[1];

            expect(newStore[0][1])
              .toBe(mockTime);
          });

          it('should remove any other invalid values from the store', () => {
            expect(mockPersistence.store.set)
              .toHaveBeenCalled();

            const newStore = mockPersistence.store.set.calls.mostRecent().args[1];

            expect(newStore.length)
              .toBe(2);
            expect(newStore[0][0])
              .not.toBe('abc123');
          });
        });

        describe('when the current pages settings are not expired', () => {
          beforeEach(() => {
            mockSha1String = '123abc';
            beacon.trackSettings(mockSettings);
          });

          it('should remove invalid values from the store', () => {
            expect(mockPersistence.store.set)
              .toHaveBeenCalled();

            const newStore = mockPersistence.store.set.calls.mostRecent().args[1];

            expect(newStore.length)
              .toBe(1);
          });
        });
      });
    });

    describe('with base64 turned on', () => {
      beforeEach(() => {
        beacon.setConfig({ newBlips: true });
        mockTransport = mockRegistry['service/transport'].transport;
        mockRegistry['utility/globals'].win.zESettings = mockSettings;
        beacon.trackSettings(mockSettings);
      });

      afterEach(() => {
        beacon.setConfig({});
      });

      it('sends correct payload using transport.send', () => {
        const mockTransport = mockRegistry['service/transport'];

        expect(mockTransport.transport.sendWithMeta).toHaveBeenCalled();

        const payload = mockTransport.transport.sendWithMeta.calls.mostRecent().args[0];
        const useBase64 = mockTransport.transport.sendWithMeta.calls.mostRecent().args[1];

        expect(payload.method)
          .toBe('GET');

        expect(payload.path)
          .toBe('/embeddable/blips');

        expect(useBase64)
          .toBe(true);
      });
    });
  });

  describe('identify', () => {
    let mockTransport,
      mockGlobals;

    const name = 'John';
    const email = 'john@example.com';

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'];
      mockGlobals = mockRegistry['utility/globals'];

      beacon.init(true);
      beacon.identify({ name: name, email: email });
    });

    it('sends the correct payload', () => {
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
