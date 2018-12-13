describe('embed.webWidget', () => {
  let webWidget,
    mockRegistry,
    mockIsOnHelpCenterPageValue,
    mockIsMobileBrowser,
    mockHelpCenterSuppressedValue,
    mockContactFormSuppressedValue,
    mockTalkSuppressedValue,
    mockTicketFormsValue,
    mockSupportAuthValue,
    mockChatAuthValue,
    mockFiltersValue,
    mockFrame,
    mockNicknameValue,
    resetTalkScreenSpy,
    zChatInitSpy,
    authenticateSpy,
    mockIsIE,
    mockActiveEmbed,
    mockStore,
    mockWebWidget,
    mockChatNotification,
    mockStandaloneMobileNotificationVisible,
    mockState,
    mockChatVendorImport,
    persistenceStoreGetSpy,
    chatNotificationDismissedSpy,
    mockWin,
    mockIsPopout,
    mockTalkRequired = true,
    mockConfig = { talk: { serviceUrl: 'talk.io' } };

  const webWidgetPath = buildSrcPath('embed/webWidget/webWidget');
  const revokeTokenSpy = jasmine.createSpy();
  const getTicketFormsSpy = jasmine.createSpy('ticketForms');
  const getTicketFieldsSpy = jasmine.createSpy('ticketFields');
  const zChatAddTagSpy = jasmine.createSpy('zChatAddTag');
  const zChatFirehoseSpy = jasmine.createSpy('zChatFirehose').and.callThrough();
  const zChatSetOnFirstReadySpy = jasmine.createSpy('zChatSetOnFirstReady').and.callThrough();
  const zChatOnSpy = jasmine.createSpy('zChatOn');
  const AUTHENTICATION_STARTED = 'widget/chat/AUTHENTICATION_STARTED';
  const AUTHENTICATION_FAILED = 'widget/chat/AUTHENTICATION_FAILED';
  const callMeScreen = 'widget/talk/CALLBACK_ONLY_SCREEN';

  beforeEach(() => {
    mockIsOnHelpCenterPageValue = false;
    mockIsMobileBrowser = false;
    mockIsIE = false;
    mockHelpCenterSuppressedValue = false;
    mockContactFormSuppressedValue = false;
    mockTalkSuppressedValue = false;
    mockTicketFormsValue = [],
    mockFiltersValue = [],
    mockSupportAuthValue = null;
    mockChatAuthValue = null;
    mockActiveEmbed = '';
    mockWin = {};
    resetTalkScreenSpy = jasmine.createSpy('resetTalkScreen');
    zChatInitSpy = jasmine.createSpy('zChatInit');
    authenticateSpy = jasmine.createSpy('authenticate');
    mockStore = {
      getState: () => mockState,
      dispatch: jasmine.createSpy('dispatch')
    };
    mockChatNotification = { show: false, proactive: false };
    mockStandaloneMobileNotificationVisible = false;
    mockChatVendorImport = Promise.resolve({
      on: zChatOnSpy,
      init: zChatInitSpy,
      addTag: zChatAddTagSpy,
      setOnFirstReady: zChatSetOnFirstReadySpy,
      getFirehose: () => {
        return {
          on: zChatFirehoseSpy
        };
      }
    });
    persistenceStoreGetSpy = jasmine.createSpy('store.get');
    chatNotificationDismissedSpy = jasmine.createSpy('chatNotificationDismissed');

    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame;
    mockWebWidget = requireUncached(buildTestPath('unit/mocks/mockWebWidget'));

    getTicketFormsSpy.calls.reset();
    getTicketFieldsSpy.calls.reset();

    resetDOM();

    mockery.enable();

    jasmine.clock().install();

    mockRegistry = initMockRegistry({
      'React': React,
      'service/beacon': {
        beacon: jasmine.createSpyObj('beacon', ['trackUserAction'])
      },
      'service/i18n': {
        i18n: {
          getLocale: () => 'fr',
          t: _.identity
        }
      },
      'service/logging': {
        error: () => {}
      },
      'service/transport': {
        http: {
          get: jasmine.createSpy('http.get'),
          send: jasmine.createSpy('http.send'),
          sendFile: jasmine.createSpy('http.sendFile'),
          getImage: jasmine.createSpy('http.getImage'),
          getZendeskHost: () => {
            return 'zendesk.host';
          }
        }
      },
      'service/settings': {
        settings: {
          get: (value) => {
            return _.get({
              contactOptions: { enabled: false },
              helpCenter: {
                suppress: mockHelpCenterSuppressedValue,
                filter: mockFiltersValue
              },
              contactForm: {
                ticketForms: mockTicketFormsValue,
              },
              talk: {
                suppress: mockTalkSuppressedValue,
                nickname: mockNicknameValue
              }
            }, value, null);
          },
          getSupportAuthSettings: () => mockSupportAuthValue,
          getChatAuthSettings: () => mockChatAuthValue
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'service/persistence': {
        store: {
          get: persistenceStoreGetSpy
        }
      },
      'component/webWidget/WebWidget': mockWebWidget,
      'globalCSS': '',
      './webWidgetStyles': {
        webWidgetStyles: 'mockCss'
      },
      'component/frame/Frame': mockFrame,
      'src/redux/modules/chat': {
        setVisitorInfo: (user) => user,
        chatNotificationDismissed: chatNotificationDismissedSpy
      },
      'src/redux/modules/talk': {
        resetTalkScreen: resetTalkScreenSpy,
        loadTalkVendors: noop
      },
      'src/redux/modules/submitTicket': {
        getTicketForms: getTicketFormsSpy,
        getTicketFields: getTicketFieldsSpy
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: () => mockActiveEmbed
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsHelpCenterSuppress: () => mockHelpCenterSuppressedValue,
        getSettingsContactFormSuppress: () => mockContactFormSuppressedValue
      },
      'src/redux/modules/chat/chat-selectors': {
        getChatNotification: () => mockChatNotification,
        getStandaloneMobileNotificationVisible: () => mockStandaloneMobileNotificationVisible
      },
      'src/redux/modules/selectors': {
        getTalkEnabled: () => mockTalkRequired,
        getTalkNickname: () => mockNicknameValue
      },
      'src/redux/modules/talk/talk-screen-types': {
        CALLBACK_ONLY_SCREEN: callMeScreen
      },
      'chat-web-sdk': mockChatVendorImport,
      'service/api/zopimApi': {
        zopimApi: {
          handleZopimQueue: jasmine.createSpy('handleZopimQ')
        }
      },
      'socket.io-client': {},
      'libphonenumber-js': {},
      'utility/devices': {
        isMobileBrowser() { return mockIsMobileBrowser; },
        setScaleLock: jasmine.createSpy('setScaleLock'),
        isIE() { return mockIsIE; },
        getZoomSizingRatio: noop
      },
      'utility/color/styles': {
        generateUserWidgetCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPageValue
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        },
        win: mockWin,
        isPopout: () => mockIsPopout
      },
      'src/redux/modules/base' : {
        authenticate: authenticateSpy,
        revokeToken: revokeTokenSpy
      },
      'lodash': _,
      'constants/chat': {
        SDK_ACTION_TYPE_PREFIX: 'websdk'
      },
      'src/redux/modules/chat/chat-action-types': {
        AUTHENTICATION_STARTED
      },
      'utility/scrollHacks': {
        setScrollKiller: noop
      },
      'src/util/utils': {

      }
    });

    mockery.registerAllowable(webWidgetPath);

    const factory = requireUncached(webWidgetPath).default;

    webWidget = new factory;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('#create', () => {
    let faythe;

    it('creates the embed component', () => {
      webWidget.create('', mockConfig, mockStore);

      faythe = webWidget.get();

      expect(faythe)
        .toBeDefined();

      expect(faythe.component)
        .toBeDefined();
    });

    describe('frame props', () => {
      let child, grandchild, frame, mockSetScaleLock;

      beforeEach(() => {
        const config = {
          ...mockConfig,
          ticketSubmissionForm: { attachmentsEnabled: true },
          helpCenterForm: {},
        };

        mockSetScaleLock = mockRegistry['utility/devices'].setScaleLock;

        webWidget.create('', config, mockStore);
        webWidget.render();

        frame = webWidget.get().instance;
        faythe = frame.getRootComponent();
        child = faythe.getActiveComponent();
        grandchild = child.getChild();
      });

      it('applies webWidget.scss to the frame factory', () => {
        webWidget.create('', mockConfig, mockStore);

        expect(webWidget.get().component.props.children.props.css)
          .toContain('mockCss');
      });

      it('sets the iframe title', () => {
        expect(frame.props.title)
          .toEqual('embeddable_framework.web_widget.frame.title');
      });

      describe('onShow', () => {
        beforeEach(() => {
          mockIsMobileBrowser = true;

          spyOn(grandchild, 'resetTicketFormVisibility');

          frame.props.onShow(frame);
        });

        it('should reset form state', () => {
          expect(grandchild.resetTicketFormVisibility)
            .toHaveBeenCalled();
        });

        it('should call setScaleLock', () => {
          expect(mockSetScaleLock)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('onHide', () => {
        beforeEach(() => {
          mockIsMobileBrowser = true;

          spyOn(child, 'resetState');
          frame.props.onHide(frame);
        });

        it('should hide virtual keyboard', () => {
          expect(child.resetState)
            .toHaveBeenCalled();
        });

        it('should call setScaleLock', () => {
          expect(mockSetScaleLock)
            .toHaveBeenCalledWith(false);
        });

        describe('active embed', () => {
          describe('is talk', () => {
            beforeEach(() => {
              mockActiveEmbed = 'talk';
              frame.props.onHide(frame);
            });

            it('dispatches a resetTalkScreen action', () => {
              expect(resetTalkScreenSpy)
                .toHaveBeenCalled();
            });
          });

          describe('is not talk', () => {
            beforeEach(() => {
              mockActiveEmbed = 'chat';
              frame.props.onHide(frame);
            });

            it('does not dispatch a resetTalkScreen action', () => {
              expect(resetTalkScreenSpy)
                .not.toHaveBeenCalled();
            });
          });
        });
      });

      describe('afterShowAnimate', () => {
        beforeEach(() => {
          spyOn(child, 'focusField');
        });

        it('should call focusField', () => {
          frame.props.afterShowAnimate(frame);

          expect(child.focusField)
            .toHaveBeenCalled();
        });
      });
    });

    describe('ipm', () => {
      describe('ipm mode is not on', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            ticketSubmissionForm: { formTitleKey: 'foo' },
          };

          webWidget.create('', config, mockStore);
          webWidget.render();

          faythe = webWidget.get().instance.props.children;
        });

        it('passes in ipmHelpCenterAvailable as false', () => {
          expect(faythe.ipmHelpCenterAvailable)
            .toBeFalsy();
        });
      });

      describe('no hc and ipm mode on', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            ticketSubmissionForm: { formTitleKey: 'foo' },
            ipmAllowed: true
          };

          webWidget.create('', config, mockStore);
          webWidget.render();

          faythe = webWidget.get().instance.props.children;
        });

        it('passes in ipmHelpCenterAvailable as true', () => {
          expect(faythe.props.ipmHelpCenterAvailable)
            .toEqual(true);
        });
      });

      describe('has hc and ipm mode on', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            ticketSubmissionForm: { formTitleKey: 'foo' },
            helpCenterForm: { formTitleKey: 'bar' },
            ipmAllowed: true
          };

          webWidget.create('', config, mockStore);
          webWidget.render();

          faythe = webWidget.get().instance.props.children;
        });

        it('passes in ipmHelpCenterAvailable as false', () => {
          expect(faythe.props.ipmHelpCenterAvailable)
            .toEqual(false);
        });
      });
    });

    describe('child props', () => {
      beforeEach(() => {
        const config = {
          ...mockConfig,
          ticketSubmissionForm: { formTitleKey: 'foo' },
          helpCenterForm: { formTitleKey: 'bar' }
        };

        webWidget.create('', config, mockStore);
        webWidget.render();

        faythe = webWidget.get().instance.props.children;
      });

      it('should apply the different formTitleKey props to the correct embed props', () => {
        expect(faythe.props.submitTicketConfig.formTitleKey)
          .toEqual('foo');

        expect(faythe.props.helpCenterConfig.formTitleKey)
          .toEqual('bar');
      });

      it('should have default container styles', () => {
        expect(faythe.props.style)
          .toEqual({ width: 342 });
      });

      describe('when on mobile', () => {
        beforeEach(() => {
          mockIsMobileBrowser = true;
          webWidget.create('', mockConfig, mockStore);
          webWidget.render();

          faythe = webWidget.get().instance.props.children;
        });

        it('switches container styles', () => {
          expect(faythe.props.style)
            .toEqual({ minHeight: '100%', width: '100%', maxHeight: '100%' });
        });
      });

      describe('when is popout', ()=> {
        let result,
          expectedResult = {
            minHeight: '100%',
            width: '100%',
            maxHeight: '100%',
            maxWidth: '650px',
            height: '100%'
          };

        beforeEach(() => {
          mockIsPopout = true;
          webWidget.create('', mockConfig, mockStore);
          webWidget.render();

          result = webWidget.get().instance.props.children;
        });

        afterEach(() => {
          mockIsPopout = false;
        });

        it('contains popout styles', () => {
          expect(result.props.style)
            .toEqual(expectedResult);
        });
      });

      describe('onSubmitted', () => {
        let mockMediator, mockBeacon, params, value;

        beforeEach(() => {
          mockMediator = mockRegistry['service/mediator'].mediator;
          mockBeacon = mockRegistry['service/beacon'].beacon;
          params = {
            res: {
              body: {
                request: { id: 149 }
              }
            },
            email: 'mock@email.com',
            searchTerm: 'a search',
            searchLocale: 'en-US',
            attachmentsCount: 2,
            attachmentTypes: ['image/gif', 'image/png'],
            contextualSearch: false
          };
          value = {
            query: params.searchTerm,
            locale: params.searchLocale,
            email: params.email,
            ticketId: 149,
            attachmentsCount: 2,
            attachmentTypes: ['image/gif', 'image/png'],
            contextualSearch: false
          };
        });

        describe('when ticket is suspended', () => {
          it('should also broadcast submitTicket.onsubmitted using correct params for new request endpoint', () => {
            params.res.body = {
              suspended_ticket: { id: 149 } // eslint-disable-line camelcase
            };

            faythe.props.onSubmitted(params);

            expect(mockBeacon.trackUserAction)
              .toHaveBeenCalledWith('submitTicket', 'send', 'ticketSubmissionForm', value);

            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('ticketSubmissionForm.onFormSubmitted');
          });
        });

        describe('when ticket is not suspended', () => {
          it('should also broadcast <name>.onsubmitted using correct params for new request endpoint', () => {
            faythe.props.onSubmitted(params);

            expect(mockBeacon.trackUserAction)
              .toHaveBeenCalledWith('submitTicket', 'send', 'ticketSubmissionForm', value);

            expect(mockMediator.channel.broadcast)
              .toHaveBeenCalledWith('ticketSubmissionForm.onFormSubmitted');
          });
        });
      });
    });

    describe('global config', () => {
      let globalConf;

      beforeEach(() => {
        const config = {
          ...mockConfig,
          root: true,
          baz: 2,
          ticketSubmissionForm: {
            foo: true,
            baz: 1
          },
          helpCenterForm: {
            bar: true
          },
        };

        webWidget.create('', config, mockStore);

        faythe = webWidget.get();
        globalConf = faythe.config.global;
      });

      it('has ticketSubmissionForm values', () => {
        expect(globalConf.foo)
          .toBeTruthy();
      });

      it('has helpCenterForm values', () => {
        expect(globalConf.bar)
          .toBeTruthy();
      });

      it('has the default values', () => {
        expect(globalConf.hideZendeskLogo)
          .toBe(false);
      });

      it('uses root level values before embed values', () => {
        expect(globalConf.baz)
          .toBe(2);
      });
    });

    describe('when no embeds are part of config', () => {
      beforeEach(() => {
        zChatInitSpy.calls.reset();
        webWidget.create('', mockConfig, mockStore);
        webWidget.render();

        faythe = webWidget.get().instance.getRootComponent();
      });

      it('sets submitTicketAvailable to false', () => {
        expect(faythe.props.submitTicketAvailable)
          .toBeFalsy();
      });

      it('sets helpCenterAvailable to false', () => {
        expect(faythe.props.helpCenterAvailable)
          .toBeFalsy();
      });

      it('does not apply props from setUpSubmitTicket to the embed', () => {
        expect(faythe.props.attachmentSender)
          .toBeFalsy();
      });

      it('does not call zChat init', () => {
        expect(zChatInitSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('setUpSubmitTicket', () => {
      describe('config', () => {
        beforeEach(() => {
          const submitTicketConfig = {
            formTitleKey: 'test_title',
            attachmentsEnabled: true
          };
          const config = {
            ...mockConfig,
            ticketSubmissionForm: submitTicketConfig,
          };

          webWidget.create('', config, mockStore);

          faythe = webWidget.get();
        });

        it('changes config.formTitleKey if formTitleKey is set', () => {
          expect(faythe.config.ticketSubmissionForm.formTitleKey)
            .toEqual('test_title');
        });
      });

      describe('attachmentSender', () => {
        let file,
          mockTransport,
          embed;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].http;
          file = {
            name: 'foo.bar'
          };
          const config = {
            ...mockConfig,
            ticketSubmissionForm: {}
          };

          webWidget.create('', config, mockStore);
          webWidget.render();

          embed = webWidget.get().instance.getRootComponent();
          embed.props.attachmentSender(file, null, null, null);
        });

        it('calls transport.sendFile when invoked', () => {
          expect(mockTransport.sendFile)
            .toHaveBeenCalled();
        });

        it('sends to the correct endpoint', () => {
          expect(mockTransport.sendFile.calls.mostRecent().args[0].path)
            .toEqual('/api/v2/uploads');
        });
      });

      describe('when ticket forms are available', () => {
        let mockTransport;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].http;
        });

        it('should call show_many', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toEqual('/api/v2/ticket_forms/show_many.json?ids=1&include=ticket_fields');
          };
          const config = {
            ...mockConfig,
            ticketSubmissionForm: {
              ticketForms: [{ id: 1 }]
            }
          };

          webWidget.create('', config, mockStore);
          webWidget.waitForRootComponent(expectFn);
        });

        it('should use the settings value over the config value', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toContain('212');
          };
          const config = {
            ...mockConfig,
            ticketSubmissionForm: {
              ticketForms: [{ id: 121 }]
            }
          };

          mockTicketFormsValue = [{ id: 212 }];
          webWidget.create('', config, mockStore);
          webWidget.waitForRootComponent(expectFn);
        });
      });

      describe('when ticket fields are an array of numbers', () => {
        let mockTransport;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].http;
        });

        it('should call embeddable/ticket_fields with the ids', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toEqual('/embeddable/ticket_fields?field_ids=1,2,3&locale=fr');
          };
          const config = {
            ...mockConfig,
            ticketSubmissionForm: {
              customFields: {
                ids: [1, 2, 3]
              }
            }
          };

          webWidget.create('', config, mockStore);
          webWidget.waitForRootComponent(expectFn);
        });
      });

      describe('when ticket fields specify all', () => {
        let mockTransport;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].http;
        });

        it('calls embeddable/ticket_fields without the ids', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toEqual('/embeddable/ticket_fields?locale=fr');
          };
          const config = {
            ...mockConfig,
            ticketSubmissionForm: {
              customFields: { all: true }
            }
          };

          webWidget.create('', config, mockStore);
          webWidget.waitForRootComponent(expectFn);
        });
      });
    });

    describe('setupChat', () => {
      let chatConfig,
        handleChatVendorLoadedSpy,
        setChatHistoryHandlerSpy;

      /* eslint-disable camelcase */
      beforeEach(() => {
        chatConfig = { zopimId: '123abc' };
        handleChatVendorLoadedSpy = jasmine
          .createSpy('handleChatVendorLoaded')
          .and.returnValue({ type: 'handleChatVendorLoaded' });
        setChatHistoryHandlerSpy = jasmine
          .createSpy('setChatHistoryHandler')
          .and.returnValue({ type: 'setChatHistoryHandler' });

        mockRegistry = initMockRegistry({
          'src/redux/modules/chat': {
            handleChatVendorLoaded: handleChatVendorLoadedSpy,
            setChatHistoryHandler: setChatHistoryHandlerSpy
          },
          ...mockRegistry
        });

        webWidget.create('', { ...mockConfig, zopimChat: chatConfig }, mockStore);
        faythe = webWidget.get();
      });

      it('dispatches the handleChatVendorLoaded action creator with zChat vendor', () => {
        mockChatVendorImport.then((mockZChat) => {
          expect(mockStore.dispatch.calls[0].args[0])
            .toEqual({ type: 'handleChatVendorLoaded' });

          expect(handleChatVendorLoadedSpy.calls.mostRecent().args[0])
            .toEqual({ zChat: mockZChat });
        });
      });

      it('dispatches the setChatHistoryHandler action creator', () => {
        mockChatVendorImport.then(() => {
          expect(mockStore.dispach.calls[1].args[0])
            .toEqual({ type: 'setChatHistoryHandler' });

          expect(setChatHistoryHandlerSpy)
            .toHaveBeenCalled();
        });
      });

      it('calls zChat init with the chat key', () => {
        mockChatVendorImport.then((mockZChat) => {
          expect(mockZChat.init.calls.mostRecent().args[0])
            .toEqual({ account_key: '123abc' });
        });
      });

      it('calls zChat init without the override_proxy key', () => {
        mockChatVendorImport.then((mockZChat) => {
          expect(mockZChat.init.calls.mostRecent().args[0])
            .not.toContain({ override_proxy: jasmine.any(String) });
        });
      });

      describe('when authentication exists in the config', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            zopimChat: chatConfig
          };

          mockChatAuthValue = { jwtFn: () => {} };
          webWidget.create('', config, mockStore);
          faythe = webWidget.get();
        });

        it('calls zChat init with the authentcation property', () => {
          mockChatVendorImport.then((mockZChat) => {
            expect(mockZChat.init.calls.mostRecent().args[0])
              .toEqual({
                account_key: '123abc',
                authentication: { jwt_fn: jasmine.any(Function) }
              });
          });
        });

        it('dispatches AUTHENTICATION_STARTED action', () => {
          mockChatVendorImport.then(() => {
            expect(mockStore.dispatch.calls[2].args[0])
              .toEqual({ type: AUTHENTICATION_STARTED });
          });
        });
      });

      describe('when authentication does not exist in the config', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            zopimChat: chatConfig
          };

          webWidget.create('', config, mockStore);
          faythe = webWidget.get();
        });

        it('does not call zChat init with the authentcation property', () => {
          mockChatVendorImport.then((mockZChat) => {
            expect(mockZChat.init.calls.mostRecent().args[0])
              .not.toContain({ authentication: { jwt_fn: jasmine.any(Function) } });
          });
        });

        it('does not dispatch AUTHENTICATION_STARTED action', () => {
          mockChatVendorImport.then(() => {
            expect(mockStore.dispatch)
              .not
              .toHaveBeenCalledWith({
                type: AUTHENTICATION_FAILED
              });
          });
        });
      });

      it('sets up error handling for chat web sdk', () => {
        mockChatVendorImport.then((mockZChat) => {
          expect(mockZChat.on.calls.mostRecent().args)
            .toEqual(['error', jasmine.any(Function)]);
        });
      });

      it('sets up firehose data', () => {
        mockChatVendorImport.then((mockZChat) => {
          expect(mockZChat.getFirehose)
            .toHaveBeenCalled();
        });
      });

      describe('when brand does not exist in config', () => {
        it('does not call zChat.addTag', () => {
          mockChatVendorImport.then(() => {
            expect(zChatAddTagSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when brand does exist in config', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            zopimChat: chatConfig,
            brand: 'z3n'
          };

          webWidget.create('', config, mockStore);
        });

        it('calls zChat.addTag with the brand', () => {
          mockChatVendorImport.then((mockZChat) => {
            expect(mockZChat.addTag.calls.mostRecent().args[0])
              .toEqual('z3n');
          });
        });
      });

      describe('when brand exists, and brandCount is > 1', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            zopimChat: chatConfig,
            brand: 'z3n',
            brandCount: 2
          };

          webWidget.create('', config, mockStore);
        });

        it('calls zChat.addTag with the brand', () => {
          mockChatVendorImport.then((mockZChat) => {
            expect(mockZChat.addTag.calls.mostRecent().args[0])
              .toEqual('z3n');
          });
        });
      });

      describe('when brand exists, and brandCount is 1', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            zopimChat: chatConfig,
            brand: 'z3n',
            brandCount: 1
          };

          webWidget.create('', config, mockStore);
        });

        it('does not call zChat.addTag', () => {
          mockChatVendorImport.then(() => {
            expect(zChatAddTagSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when in staging', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            zopimChat: {
              zopimId: '123abc',
              overrideProxy: 'hades.zopim.org'
            }
          };

          webWidget.create('', config, mockStore);
          faythe = webWidget.get();
        });

        it('calls zChat init with the chat key and the override_proxy key', () => {
          mockChatVendorImport.then((mockZChat) => {
            expect(mockZChat.init.calls.mostRecent().args[0])
              .toEqual({ account_key: '123abc', override_proxy: 'hades.zopim.org' });
          });
        });
      });

      describe('when in debug mode', () => {
        beforeEach(() => {
          persistenceStoreGetSpy.and.callFake((key) => {
            if (key === 'chatAccountKey') return '456def';
            if (key === 'chatOverrideProxy') return 'sg08.zopim.com';
          });

          const config = {
            ...mockConfig,
            zopimChat: {
              zopimId: '123abc',
              overrideProxy: 'hades.zopim.org'
            }
          };

          webWidget.create('', config, mockStore);
          faythe = webWidget.get();
        });

        it('calls zChat init with the chat key and the override_proxy key from localStorage', () => {
          mockChatVendorImport.then((mockZChat) => {
            expect(mockZChat.init.calls.mostRecent().args[0])
              .toEqual({ account_key: '456def', override_proxy: 'sg08.zopim.com' });
          });
        });
      });
      /* eslint-enable camelcase */
    });

    describe('setupTalk', () => {
      let mockTalkConfig,
        loadTalkVendorsSpy;

      beforeAll(() => {
        mockNicknameValue = 'Support';
      });

      beforeEach(() => {
        mockTalkConfig = { serviceUrl: 'https://customer.zendesk.com', nickname: mockNicknameValue };
        loadTalkVendorsSpy = jasmine.createSpy('loadTalkVendors').and.returnValue({ type: 'loadTalkVendors' });

        mockRegistry['src/redux/modules/talk'].loadTalkVendors = loadTalkVendorsSpy;

        webWidget.create('', { talk: mockTalkConfig }, mockStore);
      });

      it('dispatches the loadTalkVendors action creator', () => {
        expect(mockStore.dispatch)
          .toHaveBeenCalledWith({ type: 'loadTalkVendors' });
      });

      describe('dispatches the loadTalkVendors action creator', () => {
        let args;

        beforeEach(() => {
          args = loadTalkVendorsSpy.calls.mostRecent().args;
        });

        it('with an array of dynamic import promises', () => {
          expect(args[0])
            .toEqual(jasmine.arrayContaining([jasmine.any(Promise), jasmine.any(Promise)]));
        });

        it('with the talk service url', () => {
          expect(args[1])
            .toEqual('https://customer.zendesk.com');
        });

        it('with the talk nickname', () => {
          expect(args[2])
            .toEqual('Support');
        });
      });
    });

    describe('setUpHelpCenter', () => {
      describe('config', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            helpCenterForm: {
              buttonLabelKey: 'test_label',
              formTitleKey: 'test_title'
            }
          };

          webWidget.create('', config, mockStore);
          faythe = webWidget.get();
        });

        it('changes config.buttonLabelKey if buttonLabelKey is set', () => {
          expect(faythe.config.helpCenterForm.buttonLabelKey)
            .toEqual('test_label');
        });

        it('changes config.formTitleKey if formTitleKey is set', () => {
          expect(faythe.config.helpCenterForm.formTitleKey)
            .toEqual('test_title');
        });
      });
    });
  });

  describe('#render', () => {
    it('renders a webWidget form to the document', () => {
      webWidget.create('', mockConfig, mockStore);
      webWidget.render();

      expect(document.querySelectorAll('.mock-frame').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(webWidget.get().instance))
        .toEqual(true);
    });

    it('should only be allowed to render an webWidget form once', () => {
      webWidget.create('', mockConfig, mockStore);

      expect(() => webWidget.render())
        .not.toThrow();

      expect(() => webWidget.render())
        .toThrow();
    });
  });

  describe('setUpMediator', () => {
    let mockMediator,
      frame,
      component;

    beforeEach(() => {
      mockMediator = mockRegistry['service/mediator'].mediator;
      webWidget.create('', mockConfig, mockStore);
      webWidget.render();
    });

    it('should subscribe to webWidget.zopimChatStarted', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.zopimChatStarted', jasmine.any(Function));
    });

    describe('zopimChat.setUser', () => {
      let user;

      beforeEach(() => {
        user = { name: 'bob', email: 'bob@zd.com' };
        pluckSubscribeCall(mockMediator, 'zopimChat.setUser')(user);
      });

      it('should subscribe to zopimChat.setUser', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('zopimChat.setUser', jasmine.any(Function));
      });
    });

    describe('webWidget.proactiveChat', () => {
      beforeEach(() => {
        pluckSubscribeCall(mockMediator, 'webWidget.proactiveChat');
      });

      it('should subscribe to webWidget.proactiveChat', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('webWidget.proactiveChat', jasmine.any(Function));
      });

      describe('when webWidget.proactiveChat is dispatched', () => {
        beforeEach(() => {
          webWidget.create('', mockConfig, mockStore);
          webWidget.render();
          frame = webWidget.get().instance;
          component = frame.getRootComponent();

          spyOn(frame, 'show');
          spyOn(component, 'showProactiveChat');

          pluckSubscribeCall(mockMediator, 'webWidget.proactiveChat')();
        });

        it('call show on Frame', () => {
          expect(frame.show)
            .toHaveBeenCalled();
        });

        it('calls showProactiveChat on the component', () => {
          expect(component.showProactiveChat)
            .toHaveBeenCalled();
        });
      });

      describe('webWidget.clearAttachments', () => {
        beforeEach(() => {
          pluckSubscribeCall(mockMediator, 'webWidget.clearAttachments');
        });

        it('subscribes to webWidget.clearAttachments', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('webWidget.clearAttachments', jasmine.any(Function));
        });

        describe('when webWidget.clearAttachments is dispatched', () => {
          let child;

          beforeEach(() => {
            webWidget.create('', mockConfig, mockStore);
            webWidget.render();

            child = webWidget.get().instance.getRootComponent().getActiveComponent();

            spyOn(child, 'clearAttachments');

            pluckSubscribeCall(mockMediator, 'webWidget.clearAttachments')();
          });

          it('calls clearAttachments on the child', () => {
            expect(child.clearAttachments)
              .toHaveBeenCalled();
          });
        });
      });
    });

    describe('when webWidget.refreshLocale is broadcast', () => {
      let embed;

      describe('when there are custom ticket fields', () => {
        const customFields = { ids: [10000, 10001] };

        beforeEach(() => {
          const config = {
            ...mockConfig,
            ticketSubmissionForm: { customFields }
          };

          getTicketFormsSpy.calls.reset();
          webWidget.create('', config, mockStore);
          embed = webWidget.get();
          webWidget.render();

          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'webWidget.refreshLocale')();
        });

        it('calls getTicketFields', () => {
          expect(getTicketFieldsSpy)
            .toHaveBeenCalledWith(customFields, 'fr');
        });

        it('calls forceUpdate on the child', () => {
          expect(embed.instance.getChild().forceUpdate)
            .toHaveBeenCalled();
        });

        it('does not call getTicketForms', () => {
          expect(getTicketFormsSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when there are ticket forms', () => {
        const ticketForms = [10000, 10001];
        const config = {
          ...mockConfig,
          ticketSubmissionForm: { ticketForms },
        };

        beforeEach(() => {
          webWidget.create('', config, mockStore);
          embed = webWidget.get();
          webWidget.render();

          spyOn(embed.instance, 'updateFrameLocale');
          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'webWidget.refreshLocale')();
        });

        it('calls getTicketForms', () => {
          expect(getTicketFormsSpy)
            .toHaveBeenCalledWith(ticketForms, 'fr');
        });

        it('calls updateFrameLocale', () => {
          expect(embed.instance.updateFrameLocale)
            .toHaveBeenCalled();
        });

        it('calls forceUpdate on the child', () => {
          expect(embed.instance.getChild().forceUpdate)
            .toHaveBeenCalled();
        });

        it('does not call getTicketFields', () => {
          expect(getTicketFieldsSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('when webWidget.updateSettings is broadcast', () => {
      let embed;

      beforeEach(() => {
        webWidget.create('', mockConfig, mockStore);
        embed = webWidget.get();
        webWidget.render();

        spyOn(embed.instance, 'forceUpdateWorld');
        pluckSubscribeCall(mockMediator, 'webWidget.updateSettings')();
      });

      it('should call forceUpdateWorld', () => {
        expect(embed.instance.forceUpdateWorld)
          .toHaveBeenCalled();
      });
    });

    describe('when webWidget.hideChatNotification is broadcast', () => {
      beforeEach(() => {
        webWidget.create('', mockConfig, mockStore);
        webWidget.render();
        frame = webWidget.get().instance;
        component = frame.getRootComponent();

        spyOn(component, 'dismissStandaloneChatPopup');
      });

      describe('when a chat standalone mobile notification is visible', () => {
        beforeEach(() => {
          mockStandaloneMobileNotificationVisible = true;
          pluckSubscribeCall(mockMediator, 'webWidget.hideChatNotification')();
        });

        it('calls dismissStandaloneChatPopup on the Web Widget component', () => {
          expect(component.dismissStandaloneChatPopup)
            .toHaveBeenCalled();
        });
      });

      describe('when a chat notification is visible', () => {
        beforeEach(() => {
          mockStandaloneMobileNotificationVisible = false;
          mockChatNotification = { show: true };

          pluckSubscribeCall(mockMediator, 'webWidget.hideChatNotification')();
        });

        it('calls chatNotificationDismissed action', () => {
          expect(chatNotificationDismissedSpy)
            .toHaveBeenCalled();
        });

        it('does not call dismissStandaloneChatPopup on the Web Widget component', () => {
          expect(component.dismissStandaloneChatPopup)
            .not.toHaveBeenCalled();
        });
      });

      describe('when a chat notification is not visible', () => {
        beforeEach(() => {
          mockStandaloneMobileNotificationVisible = false;
          mockChatNotification = { show: false };

          pluckSubscribeCall(mockMediator, 'webWidget.hideChatNotification')();
        });

        it('does not call chatNotificationDismissed action', () => {
          expect(chatNotificationDismissedSpy)
            .not.toHaveBeenCalled();
        });

        it('does not call dismissStandaloneChatPopup on the Web Widget component', () => {
          expect(component.dismissStandaloneChatPopup)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('postRender', () => {
    describe('authentication', () => {
      describe('when there are valid support auth settings', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            helpCenterForm: {}
          };

          webWidget.create('', config, mockStore);
          mockSupportAuthValue = { jwt: 'token' };
          webWidget.postRender();
        });

        it('calls authenticate with the jwt token', () => {
          expect(authenticateSpy)
            .toHaveBeenCalledWith('token');
        });
      });

      describe('when there are not valid support auth settings', () => {
        beforeEach(() => {
          const config = {
            ...mockConfig,
            helpCenterForm: {}
          };

          webWidget.create('', config, mockStore);
          webWidget.postRender();
        });

        it('does not call authentication.authenticate with the jwt token', () => {
          expect(authenticateSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when there is a tokensRevokedAt property in the config', () => {
        const config = {
          ...mockConfig,
          helpCenterForm: {
            tokensRevokedAt: Math.floor(Date.now() / 1000)
          }
        };

        beforeEach(() => {
          webWidget.create('', config, mockStore);
          webWidget.postRender();
        });

        it('calls authentication.revoke with tokensRevokedAt value', () => {
          expect(revokeTokenSpy)
            .toHaveBeenCalledWith(webWidget.get().config.helpCenterForm.tokensRevokedAt);
        });
      });
    });
  });
});
