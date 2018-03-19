describe('embed.webWidget', () => {
  let webWidget,
    mockRegistry,
    mockIsOnHelpCenterPageValue,
    mockGetTokenValue,
    mockIsMobileBrowser,
    mockHelpCenterSuppressedValue,
    mockContactFormSuppressedValue,
    mockTalkSuppressedValue,
    mockTicketFormsValue,
    mockAttachmentsEnabledValue,
    mockAuthenticateValue,
    mockFiltersValue,
    mockFrame,
    mockKeywordValue,
    socketioConnectSpy,
    socketioMapEventsToActionsSpy,
    targetCancelHandlerSpy,
    resetTalkScreenSpy,
    mockIsIE,
    mockZendeskSubdomain,
    mockActiveEmbed,
    mockStoreDispatch,
    mockStore,
    mockWebWidget;
  const webWidgetPath = buildSrcPath('embed/webWidget/webWidget');
  const authenticateSpy = jasmine.createSpy();
  const revokeSpy = jasmine.createSpy();
  const getTicketFormsSpy = jasmine.createSpy('ticketForms');
  const getTicketFieldsSpy = jasmine.createSpy('ticketFields');
  const zChatInitSpy = jasmine.createSpy();
  const zChatFirehoseSpy = jasmine.createSpy().and.callThrough();
  const callMeScreen = 'widget/talk/CALLBACK_ONLY_SCREEN';

  beforeEach(() => {
    mockIsOnHelpCenterPageValue = false;
    mockGetTokenValue = null;
    mockIsMobileBrowser = false;
    mockIsIE = false;
    mockHelpCenterSuppressedValue = false;
    mockContactFormSuppressedValue = false;
    mockTalkSuppressedValue = false;
    mockTicketFormsValue = [],
    mockFiltersValue = [],
    mockAttachmentsEnabledValue = true,
    mockZendeskSubdomain = 'customerfoo';
    mockAuthenticateValue = null;
    mockActiveEmbed = '';
    socketioConnectSpy = jasmine.createSpy('socketio.connect').and.returnValue('socket');
    socketioMapEventsToActionsSpy = jasmine.createSpy('socketio.mapEventsToActions');
    resetTalkScreenSpy = jasmine.createSpy('resetTalkScreen');
    mockKeywordValue = null;
    mockStoreDispatch = jasmine.createSpy('dispatch');
    mockStore = { getState: noop, dispatch: mockStoreDispatch };

    targetCancelHandlerSpy = jasmine.createSpy();

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
          getLocale: () => 'fr'
        }
      },
      'service/transport': {
        http: {
          get: jasmine.createSpy('http.get'),
          send: jasmine.createSpy('http.send'),
          sendFile: jasmine.createSpy('http.sendFile'),
          getImage: jasmine.createSpy('http.getImage'),
          getZendeskHost: () => {
            return 'zendesk.host';
          },
          getZendeskSubdomain: () => mockZendeskSubdomain
        },
        socketio: {
          connect: socketioConnectSpy,
          mapEventsToActions: socketioMapEventsToActionsSpy
        }
      },
      'service/settings': {
        settings: {
          get: (value) => {
            return _.get({
              authenticate: mockAuthenticateValue,
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
                keyword: mockKeywordValue
              }
            }, value, null);
          }
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
        resetTalkScreen: resetTalkScreenSpy
      },
      'src/redux/modules/submitTicket': {
        getTicketForms: getTicketFormsSpy,
        getTicketFields: getTicketFieldsSpy
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: () => mockActiveEmbed
      },
      'src/redux/modules/talk/talk-screen-types': {
        CALLBACK_ONLY_SCREEN: callMeScreen
      },
      'chat-web-sdk': {
        init: zChatInitSpy,
        getFirehose: () => {
          return {
            on: zChatFirehoseSpy
          };
        }
      },
      'utility/devices': {
        isMobileBrowser() { return mockIsMobileBrowser; },
        setScaleLock: jasmine.createSpy('setScaleLock'),
        isIE() { return mockIsIE; },
        getZoomSizingRatio: noop
      },
      'utility/mouse': {
        mouse: {
          target: jasmine.createSpy('mouseTarget').and.returnValue(targetCancelHandlerSpy)
        }
      },
      'utility/color/styles': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/utils': {
        getPageKeywords: jasmine.createSpy().and.returnValue('foo bar'),
        cappedTimeoutCall: (callback) => { callback(); }
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPageValue
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        },
        win: global.window
      },
      'service/authentication' : {
        authentication: {
          getToken: () => mockGetTokenValue,
          authenticate: authenticateSpy,
          revoke: revokeSpy
        }
      },
      'service/transitionFactory' : {
        transitionFactory: requireUncached(buildTestPath('unit/mocks/mockTransitionFactory')).mockTransitionFactory
      },
      'lodash': _
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
        child = faythe.getRootComponent();
        grandchild = child.getChild();
      });

      it('applies webWidget.scss to the frame factory', () => {
        webWidget.create();

        expect(webWidget.get().component.props.css)
          .toContain('mockCss');
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

    describe('child props', () => {
      beforeEach(() => {
        const config = {
          ticketSubmissionForm: { formTitleKey: 'foo' },
          helpCenterForm: { formTitleKey: 'bar' }
        };

        webWidget.create('', config);

        faythe = webWidget.get().component.props.children;
      });

      it('should pass in zendeskHost from transport.getZendeskHost', () => {
        expect(faythe.props.zendeskHost)
          .toEqual('zendesk.host');
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

      it('does not call socketio.connect', () => {
        expect(socketioConnectSpy)
          .not.toHaveBeenCalled();
      });

      it('does not call socketio.mapEventsToActions', () => {
        expect(socketioMapEventsToActionsSpy)
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

    describe('when zopimChat is part of config', () => {
      beforeEach(() => {
        webWidget.create('', { zopimChat: {} });
      });

      it('calls zChat init', () => {
        expect(zChatInitSpy)
          .toHaveBeenCalled();
      });
    });

    describe('when talk is part of config', () => {
      beforeEach(() => {
        webWidget.create('', { talk: {} });
      });

      it('calls socketio.connect', () => {
        expect(socketioConnectSpy)
          .toHaveBeenCalled();
      });

      it('calls socketio.mapEventsToActions', () => {
        expect(socketioMapEventsToActionsSpy)
          .toHaveBeenCalled();
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

    describe('setUpChat', () => {
      /* eslint-disable camelcase */
      beforeEach(() => {
        const chatConfig = { zopimId: '123abc' };

        webWidget.create('', { zopimChat: chatConfig });

        faythe = webWidget.get();
      });

      it('calls zChat init with the chat key', () => {
        expect(zChatInitSpy)
          .toHaveBeenCalledWith({ account_key: '123abc' });
      });

      it('calls zChat init without the override_proxy key', () => {
        expect(zChatInitSpy)
          .not.toHaveBeenCalledWith({ override_proxy: jasmine.any(String) });
      });

      it('sets up firehose data', () => {
        expect(zChatFirehoseSpy)
          .toHaveBeenCalled();
      });

      describe('when in staging', () => {
        beforeEach(() => {
          const chatConfig = { zopimId: '123abc', overrideProxy: 'hades.zopim.org' };

          webWidget.create('', { zopimChat: chatConfig });

          faythe = webWidget.get();
        });

        it('calls zChat init with the chat key and the override_proxy key', () => {
          expect(zChatInitSpy)
            .toHaveBeenCalledWith({ account_key: '123abc', override_proxy: 'hades.zopim.org'});
        });
      });
      /* eslint-enable camelcase */
    });

    describe('setupTalk', () => {
      const talkConfig = { serviceUrl: 'talk.com', keyword: 'Support' };

      beforeEach(() => {
        webWidget.create('', { talk: talkConfig }, 'reduxStore');
      });

      it('calls socketio.connect with serviceUrl, subdomain and keyword', () => {
        expect(socketioConnectSpy)
          .toHaveBeenCalledWith('talk.com', 'customerfoo', 'Support');
      });

      describe('when a keyword exists in settings', () => {
        beforeEach(() => {
          mockKeywordValue = 'Sales';

          webWidget.create('', { talk: talkConfig }, 'reduxStore');
        });

        it('overrides the keyword in config', () => {
          expect(socketioConnectSpy)
            .toHaveBeenCalledWith('talk.com', 'customerfoo', 'Sales');
        });
      });

      it('calls socketio.mapEventsToActions with the socket and redux store', () => {
        expect(socketioMapEventsToActionsSpy)
          .toHaveBeenCalledWith('socket', 'reduxStore');
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
          frame = webWidget.get().instance;
          component = frame.getRootComponent();

          spyOn(frame, 'show');
          spyOn(component, 'showChat');

          pluckSubscribeCall(mockMediator, 'webWidget.proactiveChat')();
        });

        it('call show on Frame', () => {
          expect(frame.show)
            .toHaveBeenCalled();
        });

        it('calls showChat with proactive true on the component', () => {
          expect(component.showChat)
            .toHaveBeenCalledWith({ proactive: true });
        });
      });

      describe('when chat is not available', () => {
        it('does not dispatch the setVisitorInfo action', () => {
          expect(webWidget.get().store.dispatch)
            .not.toHaveBeenCalled();
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

    describe('when subscribing to helpCenterForm.setHelpCenterSuggestions', () => {
      it('should subscribe to helpCenterForm.setHelpCenterSuggestions', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('helpCenterForm.setHelpCenterSuggestions', jasmine.any(Function));
      });

      describe('when helpCenterForm is not available', () => {
        beforeEach(() => {
          webWidget.create('', {});
          webWidget.render();
          spyOn(webWidget, 'keywordsSearch');
          pluckSubscribeCall(mockMediator, 'helpCenterForm.setHelpCenterSuggestions')({ search: 'foo' });
        });

        it('should not call keywordsSearch', () => {
          expect(webWidget.keywordsSearch)
            .not.toHaveBeenCalled();
        });
      });

      describe('when helpCenterForm is available', () => {
        describe('when mouse driven contextual search is enabled', () => {
          let targetListener;

          beforeEach(() => {
            targetListener = mockRegistry['utility/mouse'].mouse.target;

            webWidget.create('', { helpCenterForm: { enableMouseDrivenContextualHelp: true } });
            webWidget.render('');
          });

          it('should add the mouse target listener', () => {
            pluckSubscribeCall(mockMediator, 'helpCenterForm.setHelpCenterSuggestions')({ search: 'foo' });

            expect(targetListener)
              .toHaveBeenCalled();
          });

          describe('when user is on mobile', () => {
            beforeEach(() => {
              mockIsMobileBrowser = true;
              spyOn(webWidget, 'keywordsSearch');
              pluckSubscribeCall(mockMediator, 'helpCenterForm.setHelpCenterSuggestions')({ search: 'foo' });
            });

            it('should call keywordsSearch', () => {
              expect(webWidget.keywordsSearch)
                .toHaveBeenCalledWith({ search: 'foo' });
            });
          });
        });

        describe('when mouse driven contextual search is disabled', () => {
          beforeEach(() => {
            webWidget.create('', { helpCenterForm: {} });
            webWidget.render();
            spyOn(webWidget, 'keywordsSearch');
            pluckSubscribeCall(mockMediator, 'helpCenterForm.setHelpCenterSuggestions')({ search: 'foo' });
          });

          it('should call keywordsSearch', () => {
            expect(webWidget.keywordsSearch)
              .toHaveBeenCalledWith({ search: 'foo' });
          });
        });
      });
    });
  });

  describe('keywordsSearch', () => {
    let webWidgetComponent,
      childComponent;

    describe('without authenticated help center', () => {
      beforeEach(() => {
        webWidget.create('', { helpCenterForm: { signInRequired: true } });
        webWidget.render();

        const webWidgetComponent = webWidget.get().instance.getRootComponent();

        childComponent = webWidgetComponent.getHelpCenterComponent();

        spyOn(childComponent, 'contextualSearch');
        webWidget.keywordsSearch({ search: 'foo' });
      });

      it('does not call contextual search', () => {
        expect(childComponent.contextualSearch)
          .not.toHaveBeenCalled();
      });
    });

    describe('with authenticated help center', () => {
      let mockMediator,
        mockOptions;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        webWidget.create('',
          {
            helpCenterForm: {
              contextualHelpEnabled: true,
              signInRequired: true
            }
          }
        );
        webWidget.render();

        webWidgetComponent = webWidget.get().instance.getRootComponent();
        childComponent = webWidgetComponent.getRootComponent();

        spyOn(webWidgetComponent, 'setAuthenticated');
        spyOn(childComponent, 'contextualSearch');
      });

      it('should wait until authenticate is true before searching', () => {
        // Simulate the page load contextual request that is sent when mouse distance
        // is less than minimum.
        webWidget.keywordsSearch({ url: true }, {
          distance: 0.24,
          speed: 0
        });
        jasmine.clock().tick();

        expect(childComponent.contextualSearch)
          .not.toHaveBeenCalled();

        pluckSubscribeCall(mockMediator, 'helpCenterForm.isAuthenticated')();
        jasmine.clock().tick();
        webWidget.keywordsSearch({ url: true });
        jasmine.clock().tick();

        expect(childComponent.contextualSearch)
          .toHaveBeenCalledWith({ url: true, pageKeywords: 'foo bar' });

        expect(webWidgetComponent.setAuthenticated)
          .toHaveBeenCalledWith(true);
      });

      describe('when sign-in is not required', () => {
        beforeEach(() => {
          mockOptions = { mock: 'options' };

          webWidget.create('', { helpCenterForm: { signInRequired: false } });
          webWidget.render();

          const webWidgetComponent = webWidget.get().instance.getRootComponent();

          childComponent = webWidgetComponent.getHelpCenterComponent();

          spyOn(childComponent, 'contextualSearch');
          webWidget.keywordsSearch(mockOptions);
        });

        it('calls contextualSearch with options', () => {
          expect(childComponent.contextualSearch)
            .toHaveBeenCalledWith(mockOptions);
        });
      });

      describe('when HelpCenter has successfully authenticated', () => {
        beforeEach(() => {
          mockOptions = { mock: 'options' };

          webWidget.create('', { helpCenterForm: { signInRequired: true } });
          webWidget.render();

          const webWidgetComponent = webWidget.get().instance.getRootComponent();

          childComponent = webWidgetComponent.getHelpCenterComponent();

          spyOn(childComponent, 'contextualSearch');
          pluckSubscribeCall(mockMediator, 'helpCenterForm.isAuthenticated')();
          webWidget.keywordsSearch(mockOptions);
        });

        it('calls contextualSearch with options', () => {
          expect(childComponent.contextualSearch)
            .toHaveBeenCalledWith(mockOptions);
        });
      });

      describe('when the user is in a HelpCenter page', () => {
        beforeEach(() => {
          mockOptions = { mock: 'options' };
          mockIsOnHelpCenterPageValue = true;

          webWidget.create('', { helpCenterForm: { signInRequired: true } });
          webWidget.render();

          const webWidgetComponent = webWidget.get().instance.getRootComponent();

          childComponent = webWidgetComponent.getHelpCenterComponent();

          spyOn(childComponent, 'contextualSearch');
          webWidget.keywordsSearch(mockOptions);
        });

        it('calls contextualSearch with options', () => {
          expect(childComponent.contextualSearch)
            .toHaveBeenCalledWith(mockOptions);
        });
      });
    });
  });

  describe('postRender', () => {
    describe('authentication', () => {
      it('should call authentication.revoke if there is a tokensRevokedAt property in the config', () => {
        webWidget.create('', {
          helpCenterForm: {
            tokensRevokedAt: Math.floor(Date.now() / 1000)
          }
        });
        webWidget.postRender();

        expect(revokeSpy)
          .toHaveBeenCalledWith(webWidget.get().config.helpCenterForm.tokensRevokedAt);
      });

      it('should call authentication.authenticate if there is a jwt token in settings', () => {
        webWidget.create('', { helpCenterForm: {} });

        mockAuthenticateValue = { jwt: 'token' };

        webWidget.postRender();

        expect(authenticateSpy)
          .toHaveBeenCalledWith('token');
      });
    });

    describe('contextual help', () => {
      beforeEach(() => {
        webWidget.create('', { helpCenterForm: { contextualHelpEnabled: true } }, mockStore);
      });

      describe('when mouse driven contextual help is enabled', () => {
        let targetSpy;

        beforeEach(() => {
          targetSpy = mockRegistry['utility/mouse'].mouse.target;
          webWidget.create('',
            {
              helpCenterForm: {
                contextualHelpEnabled: true,
                enableMouseDrivenContextualHelp: true
              }
            },
            mockStore
          );
          webWidget.render();
          spyOn(webWidget, 'keywordsSearch');
        });

        it('should add the mouse target listener', () => {
          webWidget.postRender();

          expect(targetSpy)
            .toHaveBeenCalled();
        });

        describe('when zE.activate API function has been used', () => {
          let mockMediator;

          beforeEach(() => {
            mockMediator = mockRegistry['service/mediator'].mediator;
          });

          describe('before post render', () => {
            beforeEach(() => {
              pluckSubscribeCall(mockMediator, 'webWidget.show')({ viaActivate: true });
              webWidget.postRender();
            });

            it('should not add the mouse target listener', () => {
              expect(targetSpy)
                .not.toHaveBeenCalled();
            });

            it('should call keywordsSearch', () => {
              expect(webWidget.keywordsSearch)
                .toHaveBeenCalledWith({ url: true });
            });
          });

          describe('after post render', () => {
            describe('when contextual search options are used', () => {
              beforeEach(() => {
                pluckSubscribeCall(mockMediator, 'helpCenterForm.setHelpCenterSuggestions')({ search: 'help' });
                webWidget.postRender();
                pluckSubscribeCall(mockMediator, 'webWidget.show')({ viaActivate: true });
              });

              it('should remove the mouse target listener', () => {
                expect(targetCancelHandlerSpy)
                  .toHaveBeenCalled();
              });

              it('should call keywordsSearch with set options', () => {
                expect(webWidget.keywordsSearch)
                  .toHaveBeenCalledWith({ search: 'help' });
              });
            });

            describe('when no contextual search options are used', () => {
              beforeEach(() => {
                webWidget.postRender();
                pluckSubscribeCall(mockMediator, 'webWidget.show')({ viaActivate: true });
              });

              it('should remove the mouse target listener', () => {
                expect(targetCancelHandlerSpy)
                  .toHaveBeenCalled();
              });

              it('should call keywordsSearch with url option', () => {
                expect(webWidget.keywordsSearch)
                  .toHaveBeenCalledWith({ url: true });
              });
            });
          });
        });

        describe('when the user has manually set suggestions', () => {
          beforeEach(() => {
            const mockMediator = mockRegistry['service/mediator'].mediator;

            pluckSubscribeCall(mockMediator, 'helpCenterForm.setHelpCenterSuggestions')(['foo']);

            targetSpy.calls.reset();

            webWidget.postRender();
          });

          it('should\'t add the mouse target listener', () => {
            expect(targetSpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when the user is on a help center host page', () => {
          beforeEach(() => {
            mockIsOnHelpCenterPageValue = true;
            webWidget.postRender();
          });

          it('should not add the mouse target listener', () => {
            expect(targetSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when mouse driven contextual help is disabled', () => {
        beforeEach(() => {
          spyOn(webWidget, 'keywordsSearch');
        });

        it('should call keywordSearch', () => {
          webWidget.render();
          webWidget.postRender();

          expect(webWidget.keywordsSearch)
            .toHaveBeenCalledWith({ url: true });
        });

        describe('when the user has manually set suggestions', () => {
          beforeEach(() => {
            const mockMediator = mockRegistry['service/mediator'].mediator;

            webWidget.render();
            pluckSubscribeCall(mockMediator, 'helpCenterForm.setHelpCenterSuggestions')(['foo']);

            webWidget.keywordsSearch.calls.reset();

            webWidget.postRender();
          });

          it('should not call keywordSearch', () => {
            expect(webWidget.keywordsSearch)
              .not.toHaveBeenCalled();
          });
        });

        describe('when the user is on a help center host page', () => {
          beforeEach(() => {
            mockIsOnHelpCenterPageValue = true;
            webWidget.postRender();
          });

          it('should not call keywordSearch', () => {
            expect(webWidget.keywordsSearch)
              .not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
