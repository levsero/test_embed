describe('embed.helpCenter', () => {
  let helpCenter,
    mockRegistry,
    frameConfig,
    mockSettingsValue,
    focusField,
    mockIsOnHelpCenterPageValue,
    mockIsOnHostMappedDomainValue,
    mockGetTokenValue,
    mockIsMobileBrowser,
    targetCancelHandlerSpy,
    mockIsIE;
  const helpCenterPath = buildSrcPath('embed/helpCenter/helpCenter');
  const resetState = jasmine.createSpy();
  const backtrackSearch = jasmine.createSpy();
  const performSearch = jasmine.createSpy();
  const contextualSearch = jasmine.createSpy();
  const authenticateSpy = jasmine.createSpy();
  const revokeSpy = jasmine.createSpy();
  const getHelpCenterComponent = jasmine.createSpy();
  const setChatOnline = jasmine.createSpy();

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
      'component/helpCenter/HelpCenter': {
        HelpCenter: React.createClass({
          getInitialState: () => {
            return {
              topics: [],
              searchCount: 0,
              searchTerm: '',
              hasSearched: false,
              showIntroScreen: false
            };
          },
          resetState: resetState,
          backtrackSearch: backtrackSearch,
          contextualSearch: contextualSearch,
          performSearch: performSearch,
          focusField: focusField,
          setChatOnline: setChatOnline,
          getHelpCenterComponent: getHelpCenterComponent,
          render: () => {
            return (
              <div className='mock-helpCenter'>
                <mockForm ref='helpCenterForm' />
              </div>
            );
          }
        })
      },
      './helpCenter.scss': '',
      './helpCenterFrame.scss': '',
      'embed/frameFactory': {
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory
      },
      'utility/devices': {
        setScaleLock: noop,
        isMobileBrowser: () => mockIsMobileBrowser,
        isIE: () => mockIsIE,
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

    mockery.registerAllowable(helpCenterPath);

    helpCenter = requireUncached(helpCenterPath).helpCenter;

    frameConfig = {
      onShow: jasmine.createSpy('onShow'),
      onHide: jasmine.createSpy('onHide'),
      afterShowAnimate: jasmine.createSpy('afterShowAnimate')
    };
  });

  afterEach(() => {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', () => {
    it('should add a new help center component to the helpCenter array', () => {
      expect(_.keys(helpCenter.list()).length)
        .toEqual(0);

      helpCenter.create('carlos');

      expect(_.keys(helpCenter.list()).length)
        .toEqual(1);

      const carlos = helpCenter.get('carlos');

      expect(carlos)
        .toBeDefined();

      expect(carlos.component)
        .toBeDefined();
    });

    it('changes config.buttonLabelKey if buttonLabelKey is set', () => {
      helpCenter.create('carlos', { buttonLabelKey: 'test_label' });

      const carlos = helpCenter.get('carlos');

      expect(carlos.config.buttonLabelKey)
        .toEqual('test_label');
    });

    it('changes config.formTitleKey if formTitleKey is set', () => {
      helpCenter.create('carlos', { formTitleKey: 'test_title' });

      const carlos = helpCenter.get('carlos');

      expect(carlos.config.formTitleKey)
        .toEqual('test_title');
    });

    it('changes config.viewMoreEnabled if viewMore setting is available', () => {
      mockSettingsValue = false;

      helpCenter.create('carlos', { viewMoreEnabled: true });

      const carlos = helpCenter.get('carlos');

      expect(carlos.config.viewMoreEnabled)
        .toEqual(false);
    });

    describe('frameFactory', () => {
      let mockFrameFactory,
        mockFrameFactoryCall,
        childFn,
        params;

      beforeEach(() => {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        helpCenter.create('carlos', frameConfig);
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
      });

      it('should apply the configs', () => {
        const carlos = helpCenter.get('carlos');
        const payload = childFn({});

        expect(payload.props.buttonLabelKey)
          .toEqual(carlos.config.buttonLabelKey);

        expect(payload.props.formTitleKey)
          .toEqual(carlos.config.formTitleKey);
      });
      it('should pass in zendeskHost from transport.getZendeskHost', () => {
        const payload = childFn({});

        expect(payload.props.zendeskHost)
          .toEqual('zendesk.host');
      });

      it('should the showBackButton state on the child component to false onBack', () => {
        const mockSetState = jasmine.createSpy();
        const mockFrame = {
          getRootComponent() {
            return { setState: noop };
          },
          getChild() {
            return {
              setState: mockSetState
            };
          }
        };

        params.onBack(mockFrame);

        const mockSetStateArgs = mockSetState.calls.mostRecent().args;

        expect(mockSetState)
          .toHaveBeenCalled();

        expect(mockSetStateArgs[0].showBackButton)
          .toEqual(false);
      });

      describe('mediator broadcasts', () => {
        let mockMediator;

        beforeEach(() => {
          mockMediator = mockRegistry['service/mediator'].mediator;
        });

        it('should broadcast <name>.onClose with onClose', () => {
          params.onClose();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onClose');
        });

        it('should broadcast <name>.onNextClick with HelpCenterForm.onNextClick', () => {
          const payload = childFn({});

          payload.props.onNextClick();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onNextClick', undefined);
        });

        it('should broadcast <name>.onSearch with onSearch', () => {
          const payload = childFn({});
          const params = {searchString: 'searchString', searchLocale: 'en-US'};

          payload.props.onSearch(params);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onSearch', params);
        });

        it('should not call focusField in afterShowAnimate for non-IE browser', () => {
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');

          const helpCenterFrame = helpCenter.get('carlos').instance;

          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.afterShowAnimate(helpCenterFrame);
          expect(focusField)
            .not.toHaveBeenCalled();
        });

        it('should call focusField in afterShowAnimate for IE browser', () => {
          mockIsIE = true;

          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');

          const helpCenterFrame = helpCenter.get('carlos').instance;

          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.afterShowAnimate(helpCenterFrame);

          expect(focusField)
            .toHaveBeenCalled();
        });

        it('should hide virtual keyboard onHide', () => {
          mockIsMobileBrowser = true;
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');

          const helpCenterFrame = helpCenter.get('carlos').instance;

          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.onHide(helpCenterFrame);

          expect(resetState)
            .toHaveBeenCalled();
        });

        it('should back track search on hide', () => {
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');

          const helpCenterFrame = helpCenter.get('carlos').instance;

          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.onHide(helpCenterFrame);

          expect(backtrackSearch)
            .toHaveBeenCalled();
        });
      });
    });

    it('should switch iframe styles based on isMobileBrowser()', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      mockIsMobileBrowser = true;

      helpCenter.create('carlos');

      const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
      const iframeStyle = mockFrameFactoryCall[1].frameStyle;

      expect(iframeStyle.left)
        .toBeUndefined();

      expect(iframeStyle.right)
        .toBeUndefined();
    });

    it('should switch container styles based on isMobileBrowser()', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const childFnParams = {
        updateFrameSize: () => {}
      };

      mockIsMobileBrowser = true;

      helpCenter.create('carlos');

      const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
      const payload = mockFrameFactoryCall[0](childFnParams);

      expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
    });
  });

  describe('get', () => {
    it('should return the correct helpCenter form', () => {
      helpCenter.create('carlos');
      const carlos = helpCenter.get('carlos');

      expect(carlos)
        .toBeDefined();
    });
  });

  describe('search senders', () => {
    let mockTransport,
      embed;

    beforeEach(() => {
      mockTransport = mockRegistry['service/transport'].transport;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      embed = helpCenter.get('carlos').instance.getRootComponent();
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

  describe('render', () => {
    it('should throw an exception if HelpCenter does not exist', () => {
      expect(() => helpCenter.render('non_existent_helpCenter'))
        .toThrow();
    });

    it('renders a helpCenter form to the document', () => {
      helpCenter.create('carlos');
      helpCenter.render('carlos');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-helpCenter').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(helpCenter.get('carlos').instance))
        .toEqual(true);
    });

    it('should only be allowed to render an helpCenter form once', () => {
      helpCenter.create('carlos');

      expect(() => helpCenter.render('carlos'))
        .not.toThrow();

      expect(() => helpCenter.render('carlos'))
        .toThrow();
    });

    it('applies helpCenter.scss to the frame factory', () => {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const mockCss = mockRegistry['./helpCenter.scss'];

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toEqual(mockCss);
    });

    describe('mediator subscriptions', () => {
      let mockMediator;

      beforeEach(() => {
        mockMediator = mockRegistry['service/mediator'].mediator;
        helpCenter.create('carlos');
        helpCenter.render('carlos');
      });

      it('should subscribe to <name>.show', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.show', jasmine.any(Function));

        jasmine.clock().install();
        pluckSubscribeCall(mockMediator, 'carlos.show')();
        jasmine.clock().tick(1);

        expect(helpCenter.get('carlos').instance.show.__reactBoundMethod)
          .toHaveBeenCalled();

        jasmine.clock().uninstall();
      });

      it('should subscribe to <name>.hide', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'carlos.hide')();

        expect(helpCenter.get('carlos').instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('subscribes to <name>.refreshLocale', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.refreshLocale', jasmine.any(Function));
      });

      it('should subscribe to <name>.setNextToChat', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.setNextToChat', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'carlos.setNextToChat')();

        expect(setChatOnline)
          .toHaveBeenCalledWith(true);
      });

      it('should subscribe to <name>.setNextToSubmitTicket', () => {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.setNextToSubmitTicket', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'carlos.setNextToSubmitTicket')();

        expect(setChatOnline)
          .toHaveBeenCalledWith(false);
      });

      describe('when subscribing to <name>.setHelpCenterSuggestions', () => {
        it('should subscribe to <name>.setHelpCenterSuggestions', () => {
          expect(mockMediator.channel.subscribe)
            .toHaveBeenCalledWith('carlos.setHelpCenterSuggestions', jasmine.any(Function));
        });

        describe('when mouse driven contextual search is enabled', () => {
          let targetListener;

          beforeEach(() => {
            targetListener = mockRegistry['utility/mouse'].mouse.target;

            helpCenter.create('carlos', { enableMouseDrivenContextualHelp: true });
            helpCenter.render('carlos');
          });

          it('should add the mouse target listener', () => {
            pluckSubscribeCall(mockMediator, 'carlos.setHelpCenterSuggestions')({ search: 'foo' });

            expect(targetListener)
              .toHaveBeenCalled();
          });

          describe('when user is on mobile', () => {
            beforeEach(() => {
              mockIsMobileBrowser = true;
              spyOn(helpCenter, 'keywordsSearch');
              pluckSubscribeCall(mockMediator, 'carlos.setHelpCenterSuggestions')({ search: 'foo' });
            });

            it('should call keywordsSearch', () => {
              expect(helpCenter.keywordsSearch)
                .toHaveBeenCalledWith('carlos', { search: 'foo' });
            });
          });
        });

        describe('when mouse driven contextual search is disabled', () => {
          beforeEach(() => {
            spyOn(helpCenter, 'keywordsSearch');
            pluckSubscribeCall(mockMediator, 'carlos.setHelpCenterSuggestions')({ search: 'foo' });
          });

          it('should call keywordsSearch', () => {
            expect(helpCenter.keywordsSearch)
              .toHaveBeenCalledWith('carlos', { search: 'foo' });
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
          helpCenter.create('carlos', { contextualHelpEnabled: true });
          helpCenter.get('carlos').instance = {
            getRootComponent: () => {
              return {
                contextualSearch: contextualSearchSpy
              };
            }
          };

          helpCenter.postRender('carlos');
        });

        it('calls contextual search with correct options', () => {
          helpCenter.keywordsSearch('carlos', { search: 'foo' });

          expect(contextualSearchSpy)
            .toHaveBeenCalledWith({ search: 'foo' });
        });

        describe('when url option is true', () => {
          it('should skip mouse distance check and call contextual search with correct options', () => {
            helpCenter.keywordsSearch('carlos', { url: true });

            expect(contextualSearchSpy)
              .toHaveBeenCalledWith({ url: true, pageKeywords: 'foo bar' });
          });
        });
      });

      describe('with authenticated help center', () => {
        let mockMediator;

        beforeEach(() => {
          mockMediator = mockRegistry['service/mediator'].mediator;
          helpCenter.create('carlos', { contextualHelpEnabled: true, signInRequired: true });
          helpCenter.render('carlos');

          helpCenter.get('carlos').instance = {
            getRootComponent: () => {
              return {
                contextualSearch: contextualSearchSpy
              };
            }
          };

          jasmine.clock().install();
        });

        it('should wait until authenticate is true before searching', () => {
          // Simulate the page load contextual request that is sent when mouse distance
          // is less than minimum.
          helpCenter.keywordsSearch('carlos', { url: true }, {
            distance: 0.24,
            speed: 0
          });
          jasmine.clock().tick();

          expect(contextualSearchSpy)
            .not.toHaveBeenCalled();

          pluckSubscribeCall(mockMediator, 'carlos.isAuthenticated')();
          jasmine.clock().tick();
          helpCenter.keywordsSearch('carlos', { url: true });
          jasmine.clock().tick();

          expect(contextualSearchSpy)
            .toHaveBeenCalledWith({ url: true, pageKeywords: 'foo bar' });
        });
      });
    });

    describe('postRender contextual help', () => {
      beforeEach(() => {
        helpCenter.create('carlos', { contextualHelpEnabled: true });
      });

      describe('when mouse driven contextual help is enabled', () => {
        let targetSpy;

        beforeEach(() => {
          targetSpy = mockRegistry['utility/mouse'].mouse.target;
          helpCenter.create('carlos', { contextualHelpEnabled: true, enableMouseDrivenContextualHelp: true });
        });

        it('should add the mouse target listener', () => {
          helpCenter.postRender('carlos');

          expect(targetSpy)
            .toHaveBeenCalled();
        });

        describe('when zE.activate API function has been used', () => {
          let mockMediator;

          beforeEach(() => {
            mockMediator = mockRegistry['service/mediator'].mediator;
            helpCenter.render('carlos');
          });

          describe('before post render', () => {
            beforeEach(() => {
              spyOn(helpCenter, 'keywordsSearch');
              pluckSubscribeCall(mockMediator, 'carlos.show')({ viaActivate: true });
              helpCenter.postRender('carlos');
            });

            it('should\'t add the mouse target listener', () => {
              expect(targetSpy)
                .not.toHaveBeenCalled();
            });

            it('should call keywordsSearch', () => {
              expect(helpCenter.keywordsSearch)
                .toHaveBeenCalledWith('carlos', { url: true });
            });
          });

          describe('after post render', () => {
            beforeEach(() => {
              helpCenter.postRender('carlos');
              pluckSubscribeCall(mockMediator, 'carlos.show')({ viaActivate: true });
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

            helpCenter.render('carlos');
            pluckSubscribeCall(mockMediator, 'carlos.setHelpCenterSuggestions')(['foo']);

            targetSpy.calls.reset();

            helpCenter.postRender('carlos');
          });

          it('should\'t add the mouse target listener', () => {
            expect(targetSpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when the user is on a help center host page', () => {
          beforeEach(() => {
            mockIsOnHelpCenterPageValue = true;
            helpCenter.postRender('carlos');
          });

          it('should\'t add the mouse target listener', () => {
            expect(targetSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when mouse driven contextual help is disabled', () => {
        beforeEach(() => {
          spyOn(helpCenter, 'keywordsSearch');
        });

        it('should call keywordSearch', () => {
          helpCenter.postRender('carlos');

          expect(helpCenter.keywordsSearch)
            .toHaveBeenCalledWith('carlos', { url: true });
        });

        describe('when the user has manually set suggestions', () => {
          beforeEach(() => {
            const mockMediator = mockRegistry['service/mediator'].mediator;

            helpCenter.render('carlos');
            pluckSubscribeCall(mockMediator, 'carlos.setHelpCenterSuggestions')(['foo']);

            helpCenter.keywordsSearch.calls.reset();

            helpCenter.postRender('carlos');
          });

          it('should\'t call keywordSearch', () => {
            expect(helpCenter.keywordsSearch)
              .not.toHaveBeenCalled();
          });
        });

        describe('when the user is on a help center host page', () => {
          beforeEach(() => {
            mockIsOnHelpCenterPageValue = true;
            helpCenter.postRender('carlos');
          });

          it('should\'t call keywordSearch', () => {
            expect(helpCenter.keywordsSearch)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('postRender authentication', () => {
      it('should call authentication.revoke if there is a tokensRevokedAt property in the config', () => {
        helpCenter.create('carlos', { tokensRevokedAt: Math.floor(Date.now() / 1000) });
        helpCenter.postRender('carlos');

        const carlos = helpCenter.get('carlos');

        expect(revokeSpy)
          .toHaveBeenCalledWith(carlos.config.tokensRevokedAt);
      });

      it('should call authentication.authenticate if there is a jwt token in settings', () => {
        mockSettingsValue = { jwt: 'token' };

        helpCenter.create('carlos');
        helpCenter.postRender('carlos');

        expect(authenticateSpy)
          .toHaveBeenCalledWith('token');
      });
    });
  });
});
