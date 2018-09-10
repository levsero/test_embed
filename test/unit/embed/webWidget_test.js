describe('embed.webWidget', () => {
  let webWidget,
    mockRegistry,
    mockIsOnHelpCenterPageValue,
    mockIsMobileBrowser,
    mockHelpCenterSuppressedValue,
    mockContactFormSuppressedValue,
    mockTalkSuppressedValue,
    mockTicketFormsValue,
    mockAttachmentsEnabledValue,
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
    mockStoreDispatch,
    mockStore,
    mockWebWidget,
    mockChatNotification,
    mockState,
    mockChatVendorImport;
  const webWidgetPath = buildSrcPath('embed/webWidget/webWidget');
  const revokeTokenSpy = jasmine.createSpy();
  const getTicketFormsSpy = jasmine.createSpy('ticketForms');
  const getTicketFieldsSpy = jasmine.createSpy('ticketFields');
  const zChatAddTagSpy = jasmine.createSpy('zChatAddTag');
  const zChatFirehoseSpy = jasmine.createSpy('zChatFirehose').and.callThrough();
  const zChatSetOnFirstReadySpy = jasmine.createSpy('zChatSetOnFirstReady').and.callThrough();
  const zChatOnSpy = jasmine.createSpy('zChatOn');
  const AUTHENTICATION_STARTED = 'widget/chat/AUTHENTICATION_STARTED';
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
    mockAttachmentsEnabledValue = true,
    mockSupportAuthValue = null;
    mockChatAuthValue = null;
    mockActiveEmbed = '';
    resetTalkScreenSpy = jasmine.createSpy('resetTalkScreen');
    zChatInitSpy = jasmine.createSpy('zChatInit');
    authenticateSpy = jasmine.createSpy('authenticate');
    mockNicknameValue = null;
    mockStoreDispatch = jasmine.createSpy('dispatch');
    mockStore = {
      getState: () => mockState, dispatch: mockStoreDispatch
    };
    mockChatNotification = { show: false, proactive: false };
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
                suppress: mockContactFormSuppressedValue,
                ticketForms: mockTicketFormsValue,
                attachments: mockAttachmentsEnabledValue
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
      'component/webWidget/WebWidget': mockWebWidget,
      'globalCSS': '',
      './webWidgetStyles.js': {
        webWidgetStyles: 'mockCss'
      },
      'component/frame/Frame': {
        Frame: mockFrame
      },
      'src/redux/modules/chat': {
        setVisitorInfo: (user) => user
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
      'src/redux/modules/chat/chat-selectors': {
        getChatNotification: () => mockChatNotification
      },
      'src/redux/modules/talk/talk-screen-types': {
        CALLBACK_ONLY_SCREEN: callMeScreen
      },
      'chat-web-sdk': mockChatVendorImport,
      'socket.io-client': {},
      'libphonenumber-js': {},
      'utility/devices': {
        isMobileBrowser() { return mockIsMobileBrowser; },
        setScaleLock: jasmine.createSpy('setScaleLock'),
        isIE() { return mockIsIE; },
        getZoomSizingRatio: noop
      },
      'utility/color/styles': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPageValue
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        }
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

    it('should create the embed component', () => {
      webWidget.create();

      faythe = webWidget.get();

      expect(faythe)
        .toBeDefined();

      expect(faythe.component)
        .toBeDefined();
    });

    describe('frame props', () => {
      let child, grandchild, frame, mockSetScaleLock;

      beforeEach(() => {
        mockSetScaleLock = mockRegistry['utility/devices'].setScaleLock;

        webWidget.create('', {
          ticketSubmissionForm: { attachmentsEnabled: true },
          helpCenterForm: {}
        }, mockStore);
        webWidget.render();

        frame = webWidget.get().instance;
        faythe = frame.getRootComponent();
        child = faythe.getActiveComponent();
        grandchild = child.getChild();
      });

      it('applies webWidget.scss to the frame factory', () => {
        webWidget.create();

        expect(webWidget.get().component.props.css)
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
            ticketSubmissionForm: { formTitleKey: 'foo' }
          };

          webWidget.create('', config);

          faythe = webWidget.get().component.props.children;
        });

        it('passes in ipmHelpCenterAvailable as false', () => {
          expect(faythe.props.ipmHelpCenterAvailable)
            .toBeFalsy();
        });
      });

      describe('no hc and ipm mode on', () => {
        beforeEach(() => {
          const config = {
            ticketSubmissionForm: { formTitleKey: 'foo' },
            ipmAllowed: true
          };

          webWidget.create('', config);

          faythe = webWidget.get().component.props.children;
        });

        it('passes in ipmHelpCenterAvailable as true', () => {
          expect(faythe.props.ipmHelpCenterAvailable)
            .toEqual(true);
        });
      });

      describe('has hc and ipm mode on', () => {
        beforeEach(() => {
          const config = {
            ticketSubmissionForm: { formTitleKey: 'foo' },
            helpCenterForm: { formTitleKey: 'bar' },
            ipmAllowed: true
          };

          webWidget.create('', config);

          faythe = webWidget.get().component.props.children;
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
          ticketSubmissionForm: { formTitleKey: 'foo' },
          helpCenterForm: { formTitleKey: 'bar' }
        };

        webWidget.create('', config);

        faythe = webWidget.get().component.props.children;
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
          webWidget.create();

          faythe = webWidget.get().component.props.children;
        });

        it('switches container styles', () => {
          expect(faythe.props.style)
            .toEqual({ minHeight: '100%', width: '100%' });
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
          root: true,
          baz: 2,
          ticketSubmissionForm: {
            foo: true,
            baz: 1
          },
          helpCenterForm: {
            bar: true
          }
        };

        webWidget.create('', config);

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
        webWidget.create('', {}, mockStore);
        webWidget.render();

        faythe = webWidget.get().instance.getRootComponent();
      });

      it('should assign submitTicketAvailable to false', () => {
        expect(faythe.props.submitTicketAvailable)
          .toBeFalsy();
      });

      it('should assign helpCenterAvailable to false', () => {
        expect(faythe.props.helpCenterAvailable)
          .toBeFalsy();
      });

      it('should not apply props from setUpSubmitTicket to the embed', () => {
        expect(faythe.props.attachmentSender)
          .toBeFalsy();
      });

      it('does not call zChat init', () => {
        expect(zChatInitSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when ticketSubmissionForm is part of config', () => {
      beforeEach(() => {
        webWidget.create('', { ticketSubmissionForm: {} }, mockStore);
        webWidget.render();

        faythe = webWidget.get().instance.getRootComponent();
      });

      it('should assign submitTicketAvailable to true', () => {
        expect(faythe.props.submitTicketAvailable)
          .toBeTruthy();
      });

      it('should apply props from setUpSubmitTicket to the embed', () => {
        expect(faythe.props.attachmentSender)
          .toBeTruthy();
      });

      describe('when contact form is suppressed', () => {
        beforeEach(() => {
          mockContactFormSuppressedValue = true;

          webWidget.create('', { ticketSubmissionForm: {} });
          webWidget.render();

          faythe = webWidget.get().instance.getRootComponent();
        });

        it('should assign submitTicketAvailable to false', () => {
          expect(faythe.props.submitTicketAvailable)
            .toBeFalsy();
        });

        it('should not apply props from setUpSubmitTicket to the embed', () => {
          expect(faythe.props.attachmentSender)
            .toBeFalsy();
        });
      });
    });

    describe('when helpCenterForm is part of config', () => {
      beforeEach(() => {
        webWidget.create('', { helpCenterForm: {} });
        webWidget.render();

        faythe = webWidget.get().instance.getRootComponent();
      });

      it('should assign helpCenterAvailable to true', () => {
        expect(faythe.props.helpCenterAvailable)
          .toBeTruthy();
      });

      describe('when help center is suppressed', () => {
        beforeEach(() => {
          mockHelpCenterSuppressedValue = true;

          webWidget.create('', { helpCenterConfig: {} });
          webWidget.render();

          faythe = webWidget.get().instance.getRootComponent();
        });

        it('should assign helpCenterAvailable to false', () => {
          expect(faythe.props.helpCenterAvailable)
            .toBeFalsy();
        });
      });
    });

    describe('when talk is part of config', () => {
      beforeEach(() => {
        webWidget.create('', { talk: {} }, { dispatch: () => {} });
      });

      describe('when talk is suppressed', () => {
        beforeEach(() => {
          mockTalkSuppressedValue = true;

          webWidget.create('', { talk: {} });
          webWidget.render();

          faythe = webWidget.get().instance.getRootComponent();
        });

        it('assigns talkAvailable to false', () => {
          expect(faythe.props.talkAvailable)
            .toBe(false);
        });
      });
    });

    describe('setUpSubmitTicket', () => {
      describe('config', () => {
        beforeEach(() => {
          const submitTicketConfig = {
            formTitleKey: 'test_title',
            attachmentsEnabled: true
          };

          mockAttachmentsEnabledValue = false;

          webWidget.create('', { ticketSubmissionForm: submitTicketConfig }, mockStore);

          faythe = webWidget.get();
        });

        it('changes config.formTitleKey if formTitleKey is set', () => {
          expect(faythe.config.ticketSubmissionForm.formTitleKey)
            .toEqual('test_title');
        });

        it('changes config.submitTicketForm.attachmentsEnabled if zESettings.contactForm.attachments is false', () => {
          expect(faythe.config.ticketSubmissionForm.attachmentsEnabled)
            .toEqual(false);
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

          webWidget.create('', { ticketSubmissionForm: {} }, mockStore);
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

          webWidget.create('', { ticketSubmissionForm: { ticketForms: [{ id:1 }] } }, mockStore);
          webWidget.waitForRootComponent(expectFn);
        });

        it('should use the settings value over the config value', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toContain('212');
          };

          mockTicketFormsValue = [{ id: 212 }];
          webWidget.create('', { ticketSubmissionForm: { ticketForms: [{ id: 121 }] } }, mockStore);
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

          webWidget.create('', { ticketSubmissionForm: { customFields: { ids: [1, 2, 3] } } }, mockStore);
          webWidget.waitForRootComponent(expectFn);
        });
      });

      describe('when ticket fields specify all', () => {
        let mockTransport;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].http;
        });

        it('should call embeddable/ticket_fields without the ids', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toEqual('/embeddable/ticket_fields?locale=fr');
          };

          webWidget.create('', { ticketSubmissionForm: { customFields: { all: true } } }, mockStore);
          webWidget.waitForRootComponent(expectFn);
        });
      });
    });

    describe('setupChat', () => {
      let chatConfig,
        mockReduxStore,
        handleChatVendorLoadedSpy,
        setChatHistoryHandlerSpy;

      /* eslint-disable camelcase */
      beforeEach(() => {
        chatConfig = { zopimId: '123abc' };
        mockReduxStore = { dispatch: jasmine.createSpy('dispatch') };
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

        webWidget.create('', { zopimChat: chatConfig }, mockReduxStore);
        faythe = webWidget.get();
      });

      it('dispatches the handleChatVendorLoaded action creator with zChat vendor', () => {
        mockChatVendorImport.then((mockZChat) => {
          expect(mockReduxStore.dispatch.calls[0].args[0])
            .toEqual({ type: 'handleChatVendorLoaded' });

          expect(handleChatVendorLoadedSpy.calls.mostRecent().args[0])
            .toEqual({ zChat: mockZChat });
        });
      });

      it('dispatches the setChatHistoryHandler action creator', () => {
        mockChatVendorImport.then(() => {
          expect(mockReduxStore.dispach.calls[1].args[0])
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
          mockChatAuthValue = { jwtFn: () => {} };
          webWidget.create('', { zopimChat: chatConfig }, mockStore);
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
            expect(mockReduxStore.dispatch.calls[2].args[0])
              .toEqual({ type: AUTHENTICATION_STARTED });
          });
        });
      });

      describe('when authentication does not exist in the config', () => {
        beforeEach(() => {
          webWidget.create('', { zopimChat: chatConfig }, mockStore);
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
            expect(mockReduxStore.dispatch)
              .not
              .toHaveBeenCalled();
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
          webWidget.create('', { zopimChat: chatConfig, brand: 'z3n' });
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
          webWidget.create('', { zopimChat: chatConfig, brand: 'z3n', brandCount: 2 });
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
          webWidget.create('', { zopimChat: chatConfig, brand: 'z3n', brandCount: 1 });
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
          const chatConfig = { zopimId: '123abc', overrideProxy: 'hades.zopim.org' };

          webWidget.create('', { zopimChat: chatConfig });

          faythe = webWidget.get();
        });

        it('calls zChat init with the chat key and the override_proxy key', () => {
          mockChatVendorImport.then((mockZChat) => {
            expect(mockZChat.init.calls.mostRecent().args[0])
              .toEqual({ account_key: '123abc', override_proxy: 'hades.zopim.org'});
          });
        });
      });
      /* eslint-enable camelcase */
    });

    describe('setupTalk', () => {
      let mockTalkConfig,
        mockReduxStore,
        loadTalkVendorsSpy;

      beforeEach(() => {
        mockTalkConfig = { serviceUrl: 'https://customer.zendesk.com', nickname: 'Support' };
        mockReduxStore = { dispatch: jasmine.createSpy('dispatch') };
        loadTalkVendorsSpy = jasmine.createSpy('loadTalkVendors').and.returnValue({ type: 'loadTalkVendors' });

        mockRegistry['src/redux/modules/talk'].loadTalkVendors = loadTalkVendorsSpy;

        webWidget.create('', { talk: mockTalkConfig }, mockReduxStore);
      });

      it('dispatches the loadTalkVendors action creator', () => {
        expect(mockReduxStore.dispatch)
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
          const helpCenterConfig = {
            buttonLabelKey: 'test_label',
            formTitleKey: 'test_title'
          };

          webWidget.create('', { helpCenterForm: helpCenterConfig });

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
      webWidget.create('', {}, mockStore);
      webWidget.render();

      expect(document.querySelectorAll('.mock-frame').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(webWidget.get().instance))
        .toEqual(true);
    });

    it('should only be allowed to render an webWidget form once', () => {
      webWidget.create();

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
      webWidget.create('', {}, mockStore);
      webWidget.render();
    });

    it('should subscribe to webWidget.show', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.show', jasmine.any(Function));
    });

    describe('when webWidget.show is dispatched', () => {
      beforeEach(() => {
        frame = webWidget.get().instance;
        component = frame.getRootComponent();

        spyOn(frame, 'show');
        spyOn(component, 'show');
      });

      describe('when a ticket has recently been submitted', () => {
        const config = { ticketSubmissionForm: { arbitrary: 'data' } };
        const params = {
          searchTerm: 'blah',
          searchLocale: 'en-US',
          email: 'bob@bob.com',
          attachmentsCount: 1,
          attachmentTypes: ['file'],
          res: { body: { request: { id: 1 } } }
        };

        beforeEach(() => {
          webWidget.create('', config, mockStore);
          webWidget.render();

          const frame = webWidget.get().instance;

          component = frame.getRootComponent();
          component.props.onSubmitted(params);

          spyOn(component, 'show');

          pluckSubscribeCall(mockMediator, 'webWidget.show')();
          jasmine.clock().tick(0);
        });

        it('calls show with true on the component', () => {
          expect(component.show)
            .toHaveBeenCalledWith(true);
        });
      });

      describe('when the embed is visible and called via activate', () => {
        beforeEach(() => {
          frame.setState({ visible: true });
          pluckSubscribeCall(mockMediator, 'webWidget.show')({ viaActivate: true });
          jasmine.clock().tick(0);
        });

        it('does not call show on webWidget', () => {
          expect(component.show)
            .not.toHaveBeenCalled();
        });

        it('does not call show on Frame', () => {
          expect(frame.show)
            .not.toHaveBeenCalled();
        });
      });

      describe('when the embed is visible', () => {
        beforeEach(() => {
          frame.setState({ visible: true });
          pluckSubscribeCall(mockMediator, 'webWidget.show')({ viaActivate: false });
          jasmine.clock().tick(0);
        });

        it('calls show on webWidget with false', () => {
          expect(component.show)
            .toHaveBeenCalledWith(false);
        });

        it('calls show on Frame with an options of viaActivate of false', () => {
          expect(frame.show)
            .toHaveBeenCalledWith({ viaActivate: false });
        });
      });

      describe('when it is called with activate', () => {
        beforeEach(() => {
          frame.setState({ visible: false });
          pluckSubscribeCall(mockMediator, 'webWidget.show')({ viaActivate: true });
          jasmine.clock().tick(0);
        });

        it('calls show on webWidget with true', () => {
          expect(component.show)
            .toHaveBeenCalledWith(true);
        });

        it('calls show on Frame with an options of viaActivate of true', () => {
          expect(frame.show)
            .toHaveBeenCalledWith({ viaActivate: true });
        });
      });
    });

    it('should subscribe to webWidget.hide', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.hide', jasmine.any(Function));
    });

    it('should subscribe to webWidget.zopimChatEnded', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.zopimChatEnded', jasmine.any(Function));
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
          webWidget.create('', {}, mockStore);
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
    });

    it('should subscribe to webWidget.update', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.update', jasmine.any(Function));
    });

    describe('when webWidget.refreshLocale is broadcast', () => {
      let embed;

      describe('when there are ticket forms', () => {
        const ticketForms = [10000, 10001];

        beforeEach(() => {
          webWidget.create('', { ticketSubmissionForm: { ticketForms } }, mockStore);
          embed = webWidget.get();
          webWidget.render();

          spyOn(embed.instance, 'updateFrameLocale');
          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'webWidget.refreshLocale')();
        });

        it('should call getTicketForms', () => {
          expect(getTicketFormsSpy)
            .toHaveBeenCalledWith(ticketForms, 'fr');
        });

        it('should call updateFrameLocale', () => {
          expect(embed.instance.updateFrameLocale)
            .toHaveBeenCalled();
        });

        it('should call forceUpdate on the child', () => {
          expect(embed.instance.getChild().forceUpdate)
            .toHaveBeenCalled();
        });

        it('should not call getTicketFields', () => {
          expect(getTicketFieldsSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when there are custom ticket fields', () => {
        const customFields = { ids: [10000, 10001] };

        beforeEach(() => {
          webWidget.create('', { ticketSubmissionForm: { customFields } }, mockStore);
          embed = webWidget.get();
          webWidget.render();

          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'webWidget.refreshLocale')();
        });

        it('should call getTicketFields', () => {
          expect(getTicketFieldsSpy)
            .toHaveBeenCalledWith(customFields, 'fr');
        });

        it('should call forceUpdate on the child', () => {
          expect(embed.instance.getChild().forceUpdate)
            .toHaveBeenCalled();
        });

        it('should not call getTicketForms', () => {
          expect(getTicketFormsSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });

  describe('postRender', () => {
    describe('authentication', () => {
      describe('when there are valid support auth settings', () => {
        beforeEach(() => {
          webWidget.create('', { helpCenterForm: {} }, {dispatch: () => {}});
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
          webWidget.create('', { helpCenterForm: {} });
          webWidget.postRender();
        });

        it('does not call authentication.authenticate with the jwt token', () => {
          expect(authenticateSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('when there is a tokensRevokedAt property in the config', () => {
        beforeEach(() => {
          webWidget.create('', {
            helpCenterForm: {
              tokensRevokedAt: Math.floor(Date.now() / 1000)
            }
          },
          {
            dispatch: () => {}
          });
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
