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
  const backtrackSearch = jasmine.createSpy();
  const performSearch = jasmine.createSpy();
  const contextualSearch = jasmine.createSpy();
  const authenticateSpy = jasmine.createSpy();
  const revokeSpy = jasmine.createSpy();

  beforeEach(() => {
    const mockForm = noopReactComponent();

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

    class WebWidgetChild {
      constructor() {
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

      render() {
        return (
          <mockForm ref='webWidgetForm' />
        );
      }
    }

    mockRegistry = initMockRegistry({
      'React': React,
      'service/beacon': {
        beacon: jasmine.createSpyObj('beacon', ['trackUserAction'])
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t'])
      },
      'service/transport': {
        transport: {
          send: jasmine.createSpy('transport.send'),
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
      'component/webWidget/WebWidget': {
        WebWidget: class {
          constructor() {
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
          render() {
            return (
              <div className='mock-webWidget'>
                <WebWidgetChild ref='rootComponent' />
              </div>
            );
          }
        }
      },
      './webWidget.scss': 'mockCSS',
      'component/loading/LoadingSpinner.sass': '',
      'component/submitTicket/SubmitTicket.sass': '',
      'component/submitTicket/SubmitTicketForm.sass': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory
      },
      'utility/devices': {
        isMobileBrowser() { return mockIsMobileBrowser; },
        setScaleLock: noop,
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
        }
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
        webWidget.create('faythe');
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

    describe('setUpHelpCenter', () => {
      describe('config', () => {
        beforeEach(() => {
          mockSettingsValue = false;

          const helpCenterConfig = {
            buttonLabelKey: 'test_label',
            formTitleKey: 'test_title',
            viewMoreEnabled: true
          };

          webWidget.create('faythe', { helpCenterForm: helpCenterConfig });

          faythe = webWidget.get('faythe');
        });

        it('changes config.buttonLabelKey if buttonLabelKey is set', () => {
          expect(faythe.config.helpCenterForm.buttonLabelKey)
            .toEqual('test_label');
        });

        it('changes config.formTitleKey if formTitleKey is set', () => {
          expect(faythe.config.helpCenterForm.formTitleKey)
            .toEqual('test_title');
        });

        it('changes config.viewMoreEnabled if viewMore setting is available', () => {
          expect(faythe.config.helpCenterForm.viewMoreEnabled)
            .toEqual(false);
        });

        it('does not change config.viewMoreEnabled if config.viewMoreEnabled is false', () => {
          mockSettingsValue = true;

          webWidget.create('faythe', { helpCenterForm: { viewMoreEnabled: false } });

          faythe = webWidget.get('faythe');

          expect(faythe.config.helpCenterForm.viewMoreEnabled)
            .toEqual(false);
        });
      });

      describe('search senders', () => {
        let mockTransport,
          embed;

        beforeEach(() => {
          mockTransport = mockRegistry['service/transport'].transport;

          webWidget.create('faythe');
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

        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        webWidget.create('faythe', frameConfig);
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        webWidgetFrame = webWidget.get('faythe').instance;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
        faythe = webWidget.get('faythe');
        payload = childFn({});
      });

      it('should apply the configs', () => {
        expect(payload.props.buttonLabelKey)
          .toEqual(faythe.config.buttonLabelKey);

        expect(payload.props.formTitleKey)
          .toEqual(faythe.config.formTitleKey);
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

        // Do i need this?
        it('should broadcast <name>.onClose with onClose', () => {
        });

        it('should broadcast <name>.onSearch with onSearch', () => {
          const params = {searchString: 'searchString', searchLocale: 'en-US'};

          payload.props.onSearch(params);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('helpCenterForm.onSearch', params);
        });

        it('should not call focusField in afterShowAnimate for non-IE browser', () => {
          // can I remove tghese?
          webWidget = require(webWidgetPath).webWidget;
          webWidget.create('faythe', frameConfig);
          webWidget.render('faythe');

          const webWidgetFrame = webWidget.get('faythe').instance;

          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.afterShowAnimate(webWidgetFrame);
          expect(focusField)
            .not.toHaveBeenCalled();
        });

        it('should call focusField in afterShowAnimate for IE browser', () => {
          mockIsIE = true;
          webWidget = require(webWidgetPath).webWidget;

          webWidget.create('faythe', frameConfig);
          webWidget.render('faythe');

          const webWidgetFrame = webWidget.get().instance;

          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.afterShowAnimate(webWidgetFrame);

          expect(focusField)
            .toHaveBeenCalled();
        });

        describe('onHide', () => {
          beforeEach(() => {
            // can I rmeove these?
            mockIsMobileBrowser = true;
            webWidget = require(webWidgetPath).webWidget;
            webWidget.create('faythe', frameConfig);
            webWidget.render('faythe');
            webWidgetFrame = webWidget.get('faythe').instance;
            mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
            params = mockFrameFactoryCall[1];
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
        });
      });
    });
  });

  describe('render', () => {
    it('renders a webWidget form to the document', () => {
      webWidget.create('faythe');
      webWidget.render('faythe');

      expect(document.querySelectorAll('.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll('.mock-frame .mock-webWidget').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(webWidget.get().instance))
        .toEqual(true);
    });

    it('should only be allowed to render an webWidget form once', () => {
      webWidget.create('faythe');

      expect(() => webWidget.render('faythe'))
        .not.toThrow();

      expect(() => webWidget.render('faythe'))
        .toThrow();
    });

    it('applies webWidget.scss to the frame factory', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      webWidget.create('faythe');
      webWidget.render('faythe');

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toContain('mockCSS');
    });
  });

  describe('setUpMediator', () => {
    let mockMediator,
      faythe;

    beforeEach(() => {
      mockMediator = mockRegistry['service/mediator'].mediator;
      webWidget.create();
      webWidget.render();
    });

    it('should subscribe to helpCenterForm.show', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('helpCenterForm.show', jasmine.any(Function));
    });

    it('should subscribe to helpCenterForm.hide', () => {
      expect(mockMediator.channel.subscribe)
        .toHaveBeenCalledWith('helpCenterForm.hide', jasmine.any(Function));
    });

    it('subscribes to helpCenterForm.refreshLocale', () => {
      // expect(mockMediator.channel.subscribe)
        // .toHaveBeenCalledWith('helpCenterForm.refreshLocale', jasmine.any(Function));
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

          webWidget.create('faythe', { helpCenterForm: { enableMouseDrivenContextualHelp: true } });
          webWidget.render('faythe');
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

    describe('keywordsSearch', () => {
      let contextualSearchSpy;

      beforeEach(() => {
        contextualSearchSpy = jasmine.createSpy('contextualSearch');
      });

      describe('without authenticated help center', () => {
        beforeEach(() => {
          webWidget.create('faythe', { helpCenterForm: { contextualHelpEnabled: true } });
          webWidget.get().instance = {
            getRootComponent: () => {
              return {
                refs: {
                  rootComponent: {
                    contextualSearch: contextualSearchSpy
                  }
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
          webWidget.create('faythe',
            {
              helpCenterForm: {
                contextualHelpEnabled: true,
                signInRequired: true
              }
            }
          );
          webWidget.render('faythe');

          webWidget.get().instance = {
            getRootComponent: () => {
              return {
                refs: {
                  rootComponent: {
                    contextualSearch: contextualSearchSpy
                  }
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
          webWidget.create('faythe', {
            helpCenterForm: {
              tokensRevokedAt: Math.floor(Date.now() / 1000)
            }
          });
          webWidget.postRender();

          faythe = webWidget.get();

          expect(revokeSpy)
            .toHaveBeenCalledWith(faythe.config.helpCenterForm.tokensRevokedAt);
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
          webWidget.create('faythe', { helpCenterForm: { contextualHelpEnabled: true } });
        });

        describe('when mouse driven contextual help is enabled', () => {
          let targetSpy;

          beforeEach(() => {
            targetSpy = mockRegistry['utility/mouse'].mouse.target;
            webWidget.create('faythe',
              {
                helpCenterForm: {
                  contextualHelpEnabled: true,
                  enableMouseDrivenContextualHelp: true
                }
              }
            );
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
              webWidget.render('faythe');
            });

            describe('before post render', () => {
              beforeEach(() => {
                spyOn(webWidget, 'keywordsSearch');
                pluckSubscribeCall(mockMediator, 'helpCenterForm.show')({ viaApi: true });
                webWidget.postRender('faythe');
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
              beforeEach(() => {
                webWidget.postRender();
                pluckSubscribeCall(mockMediator, 'helpCenterForm.show')({ viaApi: true });
              });

              it('should remove the mouse target listener', () => {
                expect(targetCancelHandlerSpy)
                  .toHaveBeenCalled();
              });
            });
          });

          describe('when the user has manually set suggestions', () => {
            beforeEach(() => {
              const mockMediator = mockRegistry['service/mediator'].mediator;

              webWidget.render('faythe');
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

              webWidget.render('faythe');
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
});
