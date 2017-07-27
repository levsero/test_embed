describe('embed.webWidget', () => {
  let webWidget,
    mockRegistry,
    mockIsOnHelpCenterPageValue,
    mockIsOnHostMappedDomainValue,
    mockGetTokenValue,
    mockIsMobileBrowser,
    mockChatSuppressedValue,
    mockHelpCenterSuppressedValue,
    mockContactFormSuppressedValue,
    mockViewMoreValue,
    mockTicketFormsValue,
    mockAttachmentsEnabledValue,
    mockAuthenticateValue,
    mockFiltersValue,
    mockFrame,
    targetCancelHandlerSpy,
    mockIsIE,
    mockWebWidget;
  const webWidgetPath = buildSrcPath('embed/webWidget/webWidget');
  const authenticateSpy = jasmine.createSpy();
  const revokeSpy = jasmine.createSpy();
  const updateZopimOnlineSpy = jasmine.createSpy();
  const updateUser = jasmine.createSpy();
  const zChatInitSpy = jasmine.createSpy();
  const zChatFirehoseSpy = jasmine.createSpy().and.callThrough();

  beforeEach(() => {
    mockIsOnHelpCenterPageValue = false;
    mockIsOnHostMappedDomainValue = false;
    mockGetTokenValue = null;
    mockIsMobileBrowser = false;
    mockIsIE = false;
    mockChatSuppressedValue = false;
    mockHelpCenterSuppressedValue = false;
    mockContactFormSuppressedValue = false;
    mockTicketFormsValue = [],
    mockFiltersValue = [],
    mockAttachmentsEnabledValue = true,
    mockViewMoreValue = false;
    mockAuthenticateValue = null;

    targetCancelHandlerSpy = jasmine.createSpy();

    // const webWidgetTestPath = requireUncached(buildTestPath('unit/mocks/mockWebWidget'));

    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame;
    mockWebWidget = requireUncached(buildTestPath('unit/mocks/mockWebWidget'));

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
          get: (value) => {
            return _.get({
              authenticate: mockAuthenticateValue,
              chat: { suppress: mockChatSuppressedValue },
              contactOptions: { enabled: false },
              helpCenter: {
                suppress: mockHelpCenterSuppressedValue,
                viewMore: mockViewMoreValue,
                filter: mockFiltersValue
              },
              contactForm: {
                suppress: mockContactFormSuppressedValue,
                ticketForms: mockTicketFormsValue,
                attachments: mockAttachmentsEnabledValue
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
      './webWidget.scss': '',
      './webWidgetStyles.js': {
        webWidgetStyles: 'mockCss'
      },
      'component/frame/Frame': {
        Frame: mockFrame
      },
      'src/redux/modules/base': {
        updateZopimOnline: updateZopimOnlineSpy
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
        cappedTimeoutCall: (callback) => { callback(); }
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
        transitionFactory: requireUncached(buildTestPath('unit/mocks/mockTransitionFactory')).mockTransitionFactory
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
        });
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
          spyOn(child, 'backtrackSearch');

          frame.props.onHide(frame);
        });

        it('should hide virtual keyboard', () => {
          expect(child.resetState)
            .toHaveBeenCalled();
        });

        it('should back track search', () => {
          expect(child.backtrackSearch)
            .toHaveBeenCalled();
        });

        it('should call setScaleLock', () => {
          expect(mockSetScaleLock)
            .toHaveBeenCalledWith(false);
        });
      });

      describe('afterShowAnimate', () => {
        beforeEach(() => {
          spyOn(child, 'focusField');
        });

        it('should not call focusField for non-IE browser', () => {
          mockIsIE = false;
          frame.props.afterShowAnimate(frame);

          expect(child.focusField)
            .not.toHaveBeenCalled();
        });

        it('should call focusField for IE browser', () => {
          mockIsIE = true;
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

        it('should switch container styles', () => {
          expect(faythe.props.style)
            .toEqual({ height: '100%', width: '100%' });
        });
      });

      describe('onSearch', () => {
        let mockMediator;
        const params = { searchString: 'searchString', searchLocale: 'en-US' };

        beforeEach(() => {
          mockMediator = mockRegistry['service/mediator'].mediator;
        });

        it('should broadcast helpCenterForm.onSearch', () => {
          faythe.props.onSearch(params);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('helpCenterForm.onSearch', params);
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
        webWidget.create('', {});
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

      it('should not apply props from setUpHelpCenter to the embed', () => {
        expect(faythe.props.contextualSearchSender)
          .toBeFalsy();
      });

      it('does not call zChat init', () => {
        expect(zChatInitSpy)
          .not.toHaveBeenCalled();
      });
    });

    describe('when ticketSubmissionForm is part of config', () => {
      beforeEach(() => {
        webWidget.create('', { ticketSubmissionForm: {} });
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

      it('should apply props from setUpHelpCenter to the embed', () => {
        expect(faythe.props.contextualSearchSender)
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

        it('should not apply props from setUpHelpCenter to the embed', () => {
          expect(faythe.props.contextualSearchSender)
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

      describe('when chat is suppressed', () => {
        beforeEach(() => {
          mockChatSuppressedValue = true;
          zChatInitSpy.calls.reset();

          webWidget.create('', { zopimChat: {} });
        });

        it('does not call zChat init', () => {
          expect(zChatInitSpy)
            .not.toHaveBeenCalled();
        });
      });
    });

    describe('setUpSubmitTicket', () => {
      describe('config', () => {
        beforeEach(() => {
          mockViewMoreValue = false;

          const submitTicketConfig = {
            formTitleKey: 'test_title',
            attachmentsEnabled: true
          };

          mockAttachmentsEnabledValue = false;

          webWidget.create('', { ticketSubmissionForm: submitTicketConfig });

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
          webWidget.create('', { ticketSubmissionForm: {} });
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

          webWidget.create('', { ticketSubmissionForm: {} });
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

          webWidget.create('', { ticketSubmissionForm: { ticketForms: [{ id:1 }] } } );
          webWidget.waitForRootComponent(expectFn);
        });

        it('should use the settings value over the config value', () => {
          const expectFn = () => {
            expect(mockTransport.get.calls.mostRecent().args[0].path)
              .toContain('212');
          };

          mockTicketFormsValue = [{ id: 212 }];
          webWidget.create('', { ticketSubmissionForm: { ticketForms: [{ id: 121 }] } } );
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

          webWidget.create('', { ticketSubmissionForm: { customFields: { ids: [1, 2, 3] } } } );
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

          webWidget.create('', { ticketSubmissionForm: { customFields: { all: true } } } );
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

        describe('when viewMore setting is true', () => {
          beforeEach(() => {
            mockViewMoreValue = true;

            webWidget.create('', { helpCenterForm: {} });
            faythe = webWidget.get();
          });

          it('sets config.viewMoreEnabled to true', () => {
            expect(faythe.config.helpCenterForm.viewMoreEnabled)
              .toEqual(true);
          });
        });

        describe('when viewMore setting is false', () => {
          beforeEach(() => {
            mockViewMoreValue = false;

            webWidget.create('', { helpCenterForm: {} });
            faythe = webWidget.get();
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

          webWidget.create('', { helpCenterForm: {} });
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
            mockFiltersValue = {
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
  });

  describe('#render', () => {
    it('renders a webWidget form to the document', () => {
      webWidget.create();
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
    let mockMediator, mockStoreDispatch;

    beforeEach(() => {
      mockStoreDispatch = jasmine.createSpy();
      mockMediator = mockRegistry['service/mediator'].mediator;
      webWidget.create('', {}, { dispatch: mockStoreDispatch });
      webWidget.render();
    });

    it('should subscribe to webWidget.show', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.show', jasmine.any(Function));
    });

    it('should subscribe to webWidget.hide', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.hide', jasmine.any(Function));
    });

    it('should subscribe to webWidget.activate', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.activate', jasmine.any(Function));
    });

    it('should subscribe to webWidget.setZopimOnline', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('webWidget.setZopimOnline', jasmine.any(Function));
    });

    describe('when webWidget.setZopimOnline is broadcast', () => {
      beforeEach(() => {
        pluckSubscribeCall(mockMediator, 'webWidget.setZopimOnline')();
      });

      it('should dispatch the value to the store', () => {
        expect(webWidget.get().store.dispatch)
          .toHaveBeenCalled();
      });
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
      beforeEach(() => {
        pluckSubscribeCall(mockMediator, 'zopimChat.setUser')();
      });

      it('should subscribe to zopimChat.setUser', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('zopimChat.setUser', jasmine.any(Function));
      });

      describe('when chat is rendered', () => {
        let child, faythe;

        beforeEach(() => {
          webWidget.create('', { zopimChat: {} });
          webWidget.render();

          faythe = webWidget.get().instance.getRootComponent();
          child = faythe.getRootComponent();

          spyOn(child, 'updateUser');

          pluckSubscribeCall(mockMediator, 'zopimChat.setUser')();
        });

        it('should call updateUser on the child', () => {
          expect(child.updateUser)
            .toHaveBeenCalled();
        });
      });

      describe('when chat is not rendered', () => {
        beforeEach(() => {
          webWidget.create('', {});
          webWidget.render();

          updateUser.calls.reset();

          pluckSubscribeCall(mockMediator, 'zopimChat.setUser')();
        });

        it('should not call updateUser on the child', () => {
          expect(updateUser)
            .not.toHaveBeenCalled();
        });
      });
    });

    it('should subscribe to ticketSubmissionForm.update', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('ticketSubmissionForm.update', jasmine.any(Function));
    });

    describe('when webWidget.refreshLocale is broadcast', () => {
      let embed;

      describe('when there are ticket forms', () => {
        const ticketForms = [10000, 10001];

        beforeEach(() => {
          webWidget.create('', { ticketSubmissionForm: { ticketForms } });
          embed = webWidget.get();
          webWidget.render();

          embed.submitTicketSettings.loadTicketForms = jasmine.createSpy('loadTicketForms');
          embed.submitTicketSettings.loadTicketFields = jasmine.createSpy('loadTicketFields');
          spyOn(embed.instance, 'updateFrameLocale');
          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'webWidget.refreshLocale')();
        });

        it('should call loadTicketForms', () => {
          expect(embed.submitTicketSettings.loadTicketForms)
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

        it('should not call loadTicketFields', () => {
          expect(embed.submitTicketSettings.loadTicketFields)
            .not.toHaveBeenCalled();
        });
      });

      describe('when there are custom ticket fields', () => {
        const customFields = { ids: [10000, 10001] };

        beforeEach(() => {
          webWidget.create('', { ticketSubmissionForm: { customFields } });
          embed = webWidget.get();
          webWidget.render();

          embed.submitTicketSettings.loadTicketForms = jasmine.createSpy('loadTicketForms');
          embed.submitTicketSettings.loadTicketFields = jasmine.createSpy('loadTicketFields');
          spyOn(embed.instance.getChild(), 'forceUpdate');
          pluckSubscribeCall(mockMediator, 'webWidget.refreshLocale')();
        });

        it('should call loadTicketFields', () => {
          expect(embed.submitTicketSettings.loadTicketFields)
            .toHaveBeenCalledWith(customFields, 'fr');
        });

        it('should call forceUpdate on the child', () => {
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
    let contextualSearchSpy;

    beforeEach(() => {
      contextualSearchSpy = jasmine.createSpy('contextualSearch');
    });

    describe('without authenticated help center', () => {
      beforeEach(() => {
        webWidget.create('', { helpCenterForm: { contextualHelpEnabled: true } });
        webWidget.get().instance = {
          getRootComponent: () => {
            return {
              getHelpCenterComponent: () => {
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
        webWidget.create('',
          {
            helpCenterForm: {
              contextualHelpEnabled: true,
              signInRequired: true
            }
          }
        );
        webWidget.render();

        webWidget.get().instance = {
          getRootComponent: () => {
            return {
              getHelpCenterComponent: () => {
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
        webWidget.create('', { helpCenterForm: { contextualHelpEnabled: true } });
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
            webWidget.render();
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

            webWidget.render();
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
