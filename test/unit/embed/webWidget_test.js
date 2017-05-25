describe('embed.webWidget', () => {
  let webWidget,
    mockRegistry,
    mockSettingsValue,
    focusField,
    mockIsOnHelpCenterPageValue,
    mockIsOnHostMappedDomainValue,
    mockGetTokenValue,
    mockIsMobileBrowser,
    targetCancelHandlerSpy,
    mockIsIE;
  const webWidgetPath = buildSrcPath('embed/webWidget/webWidget');
  const resetState = jasmine.createSpy();
  const resetTicketFormVisibility = jasmine.createSpy();
  const hideVirtualKeyboard = jasmine.createSpy();
  const backtrackSearch = jasmine.createSpy();
  const performSearch = jasmine.createSpy();
  const contextualSearch = jasmine.createSpy();
  const authenticateSpy = jasmine.createSpy();
  const revokeSpy = jasmine.createSpy();
  const zChatInitSpy = jasmine.createSpy();
  const zChatFirehoseSpy = jasmine.createSpy().and.callThrough();

  beforeEach(() => {
    mockSettingsValue = '';
    mockIsOnHelpCenterPageValue = false;
    mockIsOnHostMappedDomainValue = false;
    mockGetTokenValue = null;
    mockIsMobileBrowser = false;
    mockIsIE = false;

    targetCancelHandlerSpy = jasmine.createSpy();
    focusField = jasmine.createSpy();

    resetDOM();

    mockery.enable();

    jasmine.clock().install();

    class MockGrandchild extends Component {
      constructor() {
        super();
        this.resetTicketFormVisibility = resetTicketFormVisibility;
        this.hideVirtualKeyboard = hideVirtualKeyboard;
        this.focusField = focusField;
      }
      render() {
        return (
          <div />
        );
      }
    }

    class WebWidgetChild extends Component {
      constructor() {
        super();
        this.resetState = resetState;
        this.backtrackSearch = backtrackSearch;
        this.contextualSearch = contextualSearch;
        this.performSearch = performSearch;
        this.focusField = focusField;
        this.hideVirtualKeyboard = hideVirtualKeyboard;
        this.state = {
          topics: [],
          searchCount: 0,
          searchTerm: '',
          hasSearched: false,
          showIntroScreen: false
        };
      }
      setLoading() {}
      updateContactForm() {}
      render() {
        return (
          <MockGrandchild ref='submitTicketForm' />
        );
      }
    }

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
        transport: {
          get: jasmine.createSpy('transport.get'),
          send: jasmine.createSpy('transport.send'),
          sendFile: jasmine.createSpy('transport.sendFile'),
          getImage: jasmine.createSpy('transport.getImage'),
          getZendeskHost: () => {
            return 'zendesk.host';
          }
        }
      },
      'service/settings': {
        settings: {
          get: () => { return mockSettingsValue; }
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'component/webWidget/WebWidget': class extends Component {
        constructor() {
          super();
          this.resetState = resetState;
          this.backtrackSearch = backtrackSearch;
          this.contextualSearch = contextualSearch;
          this.performSearch = performSearch;
          this.focusField = focusField;
          this.state = {
            topics: [],
            searchCount: 0,
            searchTerm: '',
            hasSearched: false,
            showIntroScreen: false
          };
        }

        getRootComponent() {
          return this.refs.ticketSubmissionForm;
        }

        getSubmitTicketComponent() {
          return this.refs.ticketSubmissionForm;
        }

        render() {
          return (
            <div className='mock-webWidget'>
              <WebWidgetChild ref='ticketSubmissionForm' />
            </div>
          );
        }
      },
      './webWidget.scss': '',
      './webWidgetStyles.js': {
        webWidgetStyles: 'mockCss'
      },
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory
      },
      'vendor/web-sdk': {
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
      'utility/color': {
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/utils': {
        getPageKeywords: jasmine.createSpy().and.returnValue('foo bar'),
        cappedIntervalCall: (callback) => { callback(); }
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPageValue,
        isOnHostMappedDomain: () => mockIsOnHostMappedDomainValue
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body;
        },
        location: {
          protocol: 'https:'
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
        transitionFactory: requireUncached(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
      },
      'lodash': _
    });

    mockery.registerAllowable(webWidgetPath);

    webWidget = requireUncached(webWidgetPath).webWidget;
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    let faythe;
    const componentName = 'faythe';

    it('should create the embed component', () => {
      webWidget.create();

      faythe = webWidget.get();

      expect(faythe)
        .toBeDefined();

      expect(faythe.component)
        .toBeDefined();
    });

    describe('mobile', () => {
      let mockFrameFactory,
        mockFrameFactoryCall;

      beforeEach(() => {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        mockIsMobileBrowser = true;
        webWidget.create(componentName);
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
      });

      it('should switch iframe styles', () => {
        const iframeStyle = mockFrameFactoryCall[1].frameStyle;

        expect(iframeStyle.left)
          .toBeUndefined();

        expect(iframeStyle.right)
          .toBeUndefined();
      });

      it('should switch container styles', () => {
        const childFnParams = {
          updateFrameSize: () => {}
        };

        const payload = mockFrameFactoryCall[0](childFnParams);

        expect(payload.props.style)
          .toEqual({height: '100%', width: '100%'});
      });
    });

    describe('setUpSubmitTicket', () => {
      describe('config', () => {
        beforeEach(() => {
          mockSettingsValue = false;

          const submitTicketConfig = {
            formTitleKey: 'test_title',
            attachmentsEnabled: true
          };

          webWidget.create(componentName, { ticketSubmissionForm: submitTicketConfig });

          faythe = webWidget.get(componentName);
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

      describe('submitTicketSender', () => {
        let formParams,
          mockTransport,
          embed;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].transport;
          formParams = {
            'set_tags': 'web_widget',
            'via_id': 48,
            'submitted_from': global.window.location.href,
            'email': 'mock@email.com',
            'description': 'Mock Description'
          };
          webWidget.create();
          webWidget.render();

          embed = webWidget.get().instance.getRootComponent();
          embed.props.submitTicketSender(formParams, null, null);
        });

        it('should call transport.send when invoked', () => {
          expect(mockTransport.send)
            .toHaveBeenCalled();
        });

        it('should send with the correct path', () => {
          expect(mockTransport.send.calls.mostRecent().args[0].path)
            .toEqual('/api/v2/requests');
        });
      });

      describe('attachmentSender', () => {
        let file,
          mockTransport,
          embed;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].transport;
          file = {
            name: 'foo.bar'
          };

          webWidget.create();
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
          mockTransport = mockRegistry['service/transport'].transport;
        });

        it('should call show_many', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toEqual('/api/v2/ticket_forms/show_many.json?ids=1&include=ticket_fields');
          };

          webWidget.create(componentName, { ticketSubmissionForm: { ticketForms: [{ id:1 }] } } );
          webWidget.waitForRootComponent(expectFn);
        });

        it('should use the settings value over the config value', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toContain('212');
          };

          mockSettingsValue = [{ id: 212 }]; // emulate settings.get('contactForm.ticketForms')
          webWidget.create(componentName, { ticketSubmissionForm: { ticketForms: [{ id: 121 }] } } );
          webWidget.waitForRootComponent(expectFn);
        });
      });

      describe('when ticket fields are an array of numbers', () => {
        let mockTransport;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].transport;
        });

        it('should call embeddable/ticket_fields with the ids', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toEqual('/embeddable/ticket_fields?field_ids=1,2,3&locale=fr');
          };

          webWidget.create(componentName, { ticketSubmissionForm: { customFields: { ids: [1, 2, 3] } } } );
          webWidget.waitForRootComponent(expectFn);
        });
      });

      describe('when ticket fields specify all', () => {
        let mockTransport;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].transport;
        });

        it('should call embeddable/ticket_fields without the ids', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toEqual('/embeddable/ticket_fields?locale=fr');
          };

          webWidget.create(componentName, { ticketSubmissionForm: { customFields: { all: true } } } );
          webWidget.waitForRootComponent(expectFn);
        });
      });
    });

    describe('setUpChat', () => {
      beforeEach(() => {
        const chatConfig = { zopimId: '123abc' };

        webWidget.create(componentName, { zopimChat: chatConfig });

        faythe = webWidget.get(componentName);
      });

      it('calls zChat init with the chat key', () => {
        expect(zChatInitSpy)
          .toHaveBeenCalledWith({ account_key: '123abc' }); // eslint-disable-line camelcase
      });

      it('sets up firehose data', () => {
        expect(zChatFirehoseSpy)
          .toHaveBeenCalled();
      });
    });

    describe('setUpHelpCenter', () => {
      describe('config', () => {
        beforeEach(() => {
          const helpCenterConfig = {
            buttonLabelKey: 'test_label',
            formTitleKey: 'test_title'
          };

          webWidget.create(componentName, { helpCenterForm: helpCenterConfig });

          faythe = webWidget.get(componentName);
        });

        it('changes config.buttonLabelKey if buttonLabelKey is set', () => {
          expect(faythe.config.helpCenterForm.buttonLabelKey)
            .toEqual('test_label');
        });

        it('changes config.formTitleKey if formTitleKey is set', () => {
          expect(faythe.config.helpCenterForm.formTitleKey)
            .toEqual('test_title');
        });

        describe('when viewMore setting is true', () => {
          beforeEach(() => {
            mockSettingsValue = true;

            webWidget.create(componentName, { helpCenterForm: {} });
            faythe = webWidget.get(componentName);
          });

          it('sets config.viewMoreEnabled to true', () => {
            expect(faythe.config.helpCenterForm.viewMoreEnabled)
              .toEqual(true);
          });
        });

        describe('when viewMore setting is false', () => {
          beforeEach(() => {
            mockSettingsValue = false;

            webWidget.create(componentName, { helpCenterForm: {} });
            faythe = webWidget.get(componentName);
          });

          it('sets config.viewMoreEnabled to false', () => {
            expect(faythe.config.helpCenterForm.viewMoreEnabled)
              .toEqual(false);
          });
        });
      });

      describe('search senders', () => {
        let mockTransport,
          embed;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].transport;

          webWidget.create(componentName);
          webWidget.render();

          embed = webWidget.get().instance.getRootComponent();
        });

        describe('search payload', () => {
          let query,
            doneFn,
            failFn;

          beforeEach(() => {
            query = {
              locale: 'en-US',
              query: 'help'
            };
            doneFn = noop;
            failFn = noop;
          });

          it('should contain the correct properties', () => {
            embed.props.searchSender(query, doneFn, failFn);

            const recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

            expect(recentCallArgs)
              .toEqual({
                method: 'get',
                forceHttp: false,
                path: '/api/v2/help_center/search.json',
                query: query,
                authorization: '',
                callbacks: {
                  done: doneFn,
                  fail: failFn
                }
              });
          });

          it('should add any filters to the query', () => {
            mockSettingsValue = {
              category: 'burgers',
              section: 'beef'
            };

            embed.props.searchSender(query, doneFn, failFn);

            const recentCallQuery = mockTransport.send.calls.mostRecent().args[0].query;

            expect(recentCallQuery.category)
              .toEqual('burgers');
            expect(recentCallQuery.section)
              .toEqual('beef');
          });

          describe('when there is an oauth token', () => {
            beforeEach(() => {
              mockGetTokenValue = 'abc';
            });

            it('should set the authorization property to the token', () => {
              embed.props.searchSender();

              const recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

              expect(recentCallArgs.authorization)
                .toBe('Bearer abc');
            });
          });

          describe('when on a host mapped domain and not using SSL', () => {
            beforeEach(() => {
              mockIsOnHostMappedDomainValue = true;
              mockRegistry['utility/globals'].location.protocol = 'http:';
            });

            it('should set the forceHttp property to true', () => {
              embed.props.searchSender();

              const recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

              expect(recentCallArgs.forceHttp)
                .toBe(true);
            });
          });
        });

        describe('searchSender', () => {
          it('calls transport.send with regular search endpoint when called', () => {
            embed.props.searchSender();

            expect(mockTransport.send)
              .toHaveBeenCalled();

            const recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

            expect(recentCallArgs.path)
              .toEqual('/api/v2/help_center/search.json');
          });
        });

        describe('contextualSearchSender', () => {
          it('calls transport.send with contextual search endpoint when called', () => {
            embed.props.contextualSearchSender();

            const recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

            expect(recentCallArgs.path)
              .toEqual('/api/v2/help_center/articles/embeddable_search.json');
          });
        });

        describe('restrictedImagesSender', () => {
          it('calls transport.send with passed in image url when called', () => {
            const url = 'https://url.com/image';

            embed.props.imagesSender(url);

            const recentCallArgs = mockTransport.getImage.calls.mostRecent().args[0];

            expect(recentCallArgs.path)
              .toEqual(url);
          });
        });
      });
    });

    describe('frameFactory', () => {
      let mockFrameFactory,
        mockSetScaleLock,
        mockFrameFactoryCall,
        webWidgetFrame,
        childFn,
        params,
        faythe,
        frameConfig,
        payload;

      beforeEach(() => {
        frameConfig = {
          onShow: jasmine.createSpy('onShow'),
          onHide: jasmine.createSpy('onHide'),
          afterShowAnimate: jasmine.createSpy('afterShowAnimate')
        };

        mockSetScaleLock = mockRegistry['utility/devices'].setScaleLock;
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

        webWidget.create(componentName, frameConfig);
        webWidget.render();
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        webWidgetFrame = webWidget.get(componentName).instance;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
        faythe = webWidget.get(componentName);
        payload = childFn({});
      });

      it('should apply the configs', () => {
        expect(payload.props.helpCenterConfig.buttonLabelKey)
          .toEqual(faythe.config.helpCenterForm.buttonLabelKey);

        expect(payload.props.helpCenterConfig.formTitleKey)
          .toEqual(faythe.config.helpCenterForm.formTitleKey);

        expect(payload.props.submitTicketConfig.formTitleKey)
          .toEqual(faythe.config.ticketSubmissionForm.formTitleKey);
      });

      it('should pass in zendeskHost from transport.getZendeskHost', () => {
        expect(payload.props.zendeskHost)
          .toEqual('zendesk.host');
      });

      describe('mediator broadcasts', () => {
        let mockMediator;

        beforeEach(() => {
          mockMediator = mockRegistry['service/mediator'].mediator;
        });

        it('should broadcast helpCenterForm.onSearch with onSearch', () => {
          const params = {searchString: 'searchString', searchLocale: 'en-US'};

          payload.props.onSearch(params);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('helpCenterForm.onSearch', params);
        });

        it('should not call focusField in afterShowAnimate for non-IE browser', () => {
          params.afterShowAnimate(webWidgetFrame);
          expect(focusField)
            .not.toHaveBeenCalled();
        });

        it('should call focusField in afterShowAnimate for IE browser', () => {
          mockIsIE = true;
          params.afterShowAnimate(webWidgetFrame);

          expect(focusField)
            .toHaveBeenCalled();
        });
      });

      describe('onShow', () => {
        beforeEach(() => {
          mockIsMobileBrowser = true;

          params.onShow(webWidgetFrame);
        });

        it('should reset form state', () => {
          expect(resetTicketFormVisibility)
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
          params.onHide(webWidgetFrame);
        });

        it('should hide virtual keyboard', () => {
          expect(resetState)
            .toHaveBeenCalled();
        });

        it('should back track search', () => {
          expect(backtrackSearch)
            .toHaveBeenCalled();
        });

        it('should call setScaleLock', () => {
          expect(mockSetScaleLock)
            .toHaveBeenCalledWith(false);
        });
      });

      describe('when onSubmitted is called', () => {
        let mockFrameFactory,
          mockMediator,
          mockBeacon;
        const childFnParams = {
          updateFrameSize: noop
        };

        beforeEach(() => {
          mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
          mockMediator = mockRegistry['service/mediator'].mediator;
          mockBeacon = mockRegistry['service/beacon'].beacon;
        });

        describe('when attachments are enabled', () => {
          let params,
            value;

          beforeEach(() => {
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
              attachmentTypes: ['image/gif', 'image/png']
            };
            value = {
              query: params.searchTerm,
              locale: params.searchLocale,
              email: params.email,
              ticketId: 149,
              attachmentsCount: 2,
              attachmentTypes: ['image/gif', 'image/png']
            };

            mockSettingsValue = true;
            webWidget.create(componentName, { ticketSubmissionForm: { attachmentsEnabled: true } });

            mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
            payload = mockFrameFactoryCall[0](childFnParams);
          });

          describe('when ticket is suspended', () => {
            it('should also broadcast submitTicket.onsubmitted using correct params for new request endpoint', () => {
              params.res.body = {
                suspended_ticket: { id: 149 } // eslint-disable-line camelcase
              };

              payload.props.onSubmitted(params);

              expect(mockBeacon.trackUserAction)
                .toHaveBeenCalledWith('submitTicket', 'send', 'ticketSubmissionForm', value);

              expect(mockMediator.channel.broadcast)
                .toHaveBeenCalledWith('ticketSubmissionForm.onFormSubmitted');
            });
          });

          describe('when ticket is not suspended', () => {
            it('should also broadcast <name>.onsubmitted using correct params for new request endpoint', () => {
              payload.props.onSubmitted(params);

              expect(mockBeacon.trackUserAction)
                .toHaveBeenCalledWith('submitTicket', 'send', 'ticketSubmissionForm', value);

              expect(mockMediator.channel.broadcast)
                .toHaveBeenCalledWith('ticketSubmissionForm.onFormSubmitted');
            });
          });
        });
      });
    });
  });

  describe('render', () => {
    const componentName = 'faythe';

    it('renders a webWidget form to the document', () => {
      webWidget.create(componentName);
      webWidget.render(componentName);

      expect(document.querySelectorAll('.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll('.mock-frame .mock-webWidget').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(webWidget.get().instance))
        .toEqual(true);
    });

    it('should only be allowed to render an webWidget form once', () => {
      webWidget.create(componentName);

      expect(() => webWidget.render(componentName))
        .not.toThrow();

      expect(() => webWidget.render(componentName))
        .toThrow();
    });

    it('applies webWidget.scss to the frame factory', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      webWidget.create(componentName);
      webWidget.render(componentName);

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toContain('mockCss');
    });
  });

  describe('setUpMediator', () => {
    let mockMediator;
    const componentName = 'faythe';

    beforeEach(() => {
      mockMediator = mockRegistry['service/mediator'].mediator;
      webWidget.create();
      webWidget.render();
    });

    it('should subscribe to helpCenterForm.show', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('helpCenterForm.show', jasmine.any(Function));
    });

    it('should subscribe to ticketSubmissionForm.show', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('ticketSubmissionForm.show', jasmine.any(Function));
    });

    it('should subscribe to helpCenterForm.hide', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('helpCenterForm.hide', jasmine.any(Function));
    });

    it('should subscribe to ticketSubmissionForm.hide', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('ticketSubmissionForm.hide', jasmine.any(Function));
    });

    it('should subscribe to webWidget.activate', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.activate', jasmine.any(Function));
    });

    it('should subscribe to zopimChat.setUser', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('zopimChat.setUser', jasmine.any(Function));
    });

    it('should subscribe to ticketSubmissionForm.update', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('ticketSubmissionForm.update', jasmine.any(Function));
    });

    it('should subscribe to helpCenterForm.refreshLocale', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('helpCenterForm.refreshLocale', jasmine.any(Function));
    });

    it('should subscribe to ticketSubmissionForm.refreshLocale', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('ticketSubmissionForm.refreshLocale', jasmine.any(Function));
    });

    describe('when ticketSubmissionForm.refreshLocale is broadcast', () => {
      let embed;

      describe('when there are ticket forms', () => {
        const ticketForms = [10000, 10001];

        beforeEach(() => {
          webWidget.create(componentName, { ticketSubmissionForm: { ticketForms } });
          embed = webWidget.get(componentName);
          webWidget.render(componentName);

          embed.submitTicketSettings.loadTicketForms = jasmine.createSpy('loadTicketForms');
          embed.submitTicketSettings.loadTicketFields = jasmine.createSpy('loadTicketFields');
          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'ticketSubmissionForm.refreshLocale')();
        });

        it('should call loadTicketForms', () => {
          expect(embed.submitTicketSettings.loadTicketForms)
            .toHaveBeenCalledWith(ticketForms, 'fr');
        });

        it('should call SubmitTicket.forceUpdate', () => {
          expect(embed.instance.getChild().forceUpdate)
            .toHaveBeenCalled();
        });

        it('should not call loadTicketFields', () => {
          expect(embed.submitTicketSettings.loadTicketFields)
            .not.toHaveBeenCalled();
        });
      });

      describe('when there are custom ticket fields', () => {
        const customFields = { ids: [10000, 10001] };

        beforeEach(() => {
          webWidget.create(componentName, { ticketSubmissionForm: { customFields } });
          embed = webWidget.get(componentName);
          webWidget.render(componentName);

          embed.submitTicketSettings.loadTicketForms = jasmine.createSpy('loadTicketForms');
          embed.submitTicketSettings.loadTicketFields = jasmine.createSpy('loadTicketFields');
          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'ticketSubmissionForm.refreshLocale')();
        });

        it('should call loadTicketFields', () => {
          expect(embed.submitTicketSettings.loadTicketFields)
            .toHaveBeenCalledWith(customFields, 'fr');
        });

        it('should call SubmitTicket.forceUpdate', () => {
          expect(embed.instance.getChild().forceUpdate)
            .toHaveBeenCalled();
        });

        it('should not call loadTicketForms', () => {
          expect(embed.submitTicketSettings.loadTicketForms)
            .not.toHaveBeenCalled();
        });
      });
    });

    it('should subscribe to ticketSubmissionForm.prefill', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('ticketSubmissionForm.prefill', jasmine.any(Function));
    });

    describe('when prefill is broadcast', () => {
      let params,
        submitTicket;

      beforeEach(() => {
        params = {
          name: 'James Dean',
          email: 'james@dean.com'
        };

        const webWidgetComponent = webWidget.get().instance.getRootComponent();

        submitTicket = webWidgetComponent.getSubmitTicketComponent();

        submitTicket.setState({ formState: { description:'hello' } });

        pluckSubscribeCall(mockMediator, 'ticketSubmissionForm.prefill')(params);
      });

      it('should set the form name', () => {
        expect(submitTicket.state.formState.name)
          .toEqual(params.name);
      });

      it('should set the form email', () => {
        expect(submitTicket.state.formState.email)
          .toEqual(params.email);
      });

      it('should not override the other state values', () => {
        expect(submitTicket.state.formState.description)
          .toEqual('hello');
      });
    });

    describe('when subscribing to helpCenterForm.setHelpCenterSuggestions', () => {
      it('should subscribe to helpCenterForm.setHelpCenterSuggestions', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('helpCenterForm.setHelpCenterSuggestions', jasmine.any(Function));
      });

      describe('when mouse driven contextual search is enabled', () => {
        let targetListener;

        beforeEach(() => {
          targetListener = mockRegistry['utility/mouse'].mouse.target;

          webWidget.create(componentName, { helpCenterForm: { enableMouseDrivenContextualHelp: true } });
          webWidget.render(componentName);
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

  describe('keywordsSearch', () => {
    let contextualSearchSpy;
    const componentName = 'faythe';

    beforeEach(() => {
      contextualSearchSpy = jasmine.createSpy('contextualSearch');
    });

    describe('without authenticated help center', () => {
      beforeEach(() => {
        webWidget.create(componentName, { helpCenterForm: { contextualHelpEnabled: true } });
        webWidget.get().instance = {
          getRootComponent: () => {
            return {
              getRootComponent: () => {
                return { contextualSearch: contextualSearchSpy };
              }
            };
          }
        };

        webWidget.postRender();
      });

      it('calls contextual search with correct options', () => {
        webWidget.keywordsSearch({ search: 'foo' });

        expect(contextualSearchSpy)
          .toHaveBeenCalledWith({ search: 'foo' });
      });

      describe('when url option is true', () => {
        it('should skip mouse distance check and call contextual search with correct options', () => {
          webWidget.keywordsSearch({ url: true });

          expect(contextualSearchSpy)
            .toHaveBeenCalledWith({ url: true, pageKeywords: 'foo bar' });
        });
      });
    });

    describe('with authenticated help center', () => {
      let mockMediator;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        webWidget.create(componentName,
          {
            helpCenterForm: {
              contextualHelpEnabled: true,
              signInRequired: true
            }
          }
        );
        webWidget.render(componentName);

        webWidget.get().instance = {
          getRootComponent: () => {
            return {
              getRootComponent: () => {
                return { contextualSearch: contextualSearchSpy };
              }
            };
          }
        };
      });

      it('should wait until authenticate is true before searching', () => {
        // Simulate the page load contextual request that is sent when mouse distance
        // is less than minimum.
        webWidget.keywordsSearch({ url: true }, {
          distance: 0.24,
          speed: 0
        });
        jasmine.clock().tick();

        expect(contextualSearchSpy)
          .not.toHaveBeenCalled();

        pluckSubscribeCall(mockMediator, 'helpCenterForm.isAuthenticated')();
        jasmine.clock().tick();
        webWidget.keywordsSearch({ url: true });
        jasmine.clock().tick();

        expect(contextualSearchSpy)
          .toHaveBeenCalledWith({ url: true, pageKeywords: 'foo bar' });
      });
    });
  });

  describe('postRender', () => {
    const componentName = 'faythe';

    describe('authentication', () => {
      it('should call authentication.revoke if there is a tokensRevokedAt property in the config', () => {
        webWidget.create(componentName, {
          helpCenterForm: {
            tokensRevokedAt: Math.floor(Date.now() / 1000)
          }
        });
        webWidget.postRender();

        expect(revokeSpy)
          .toHaveBeenCalledWith(webWidget.get().config.helpCenterForm.tokensRevokedAt);
      });

      it('should call authentication.authenticate if there is a jwt token in settings', () => {
        webWidget.create();

        mockSettingsValue = { jwt: 'token' };

        webWidget.postRender();

        expect(authenticateSpy)
          .toHaveBeenCalledWith('token');
      });
    });

    describe('contextual help', () => {
      beforeEach(() => {
        webWidget.create(componentName, { helpCenterForm: { contextualHelpEnabled: true } });
      });

      describe('when mouse driven contextual help is enabled', () => {
        let targetSpy;

        beforeEach(() => {
          targetSpy = mockRegistry['utility/mouse'].mouse.target;
          webWidget.create(componentName,
            {
              helpCenterForm: {
                contextualHelpEnabled: true,
                enableMouseDrivenContextualHelp: true
              }
            }
          );
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
            webWidget.render(componentName);
          });

          describe('before post render', () => {
            beforeEach(() => {
              pluckSubscribeCall(mockMediator, 'helpCenterForm.show')({ viaActivate: true });
              webWidget.postRender(componentName);
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
                webWidget.postRender(componentName);
                pluckSubscribeCall(mockMediator, 'helpCenterForm.show')({ viaActivate: true });
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
                webWidget.postRender(componentName);
                pluckSubscribeCall(mockMediator, 'helpCenterForm.show')({ viaActivate: true });
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

            webWidget.render(componentName);
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

            webWidget.render(componentName);
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
