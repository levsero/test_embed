describe('embed.helpCenter', function() {
  let helpCenter,
    mockRegistry,
    frameConfig,
    mockSettingsValue,
    focusField,
    mockIsOnHelpCenterPageValue,
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

  beforeEach(function() {
    const mockForm = noopReactComponent();

    mockSettingsValue = '';
    mockIsOnHelpCenterPageValue = false;
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
          getZendeskHost: function() {
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
          getInitialState: function() {
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
          getHelpCenterComponent: getHelpCenterComponent,
          render: function() {
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
        frameFactory: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: requireUncached(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowser,
        isIE: () => mockIsIE
      },
      'utility/mouse': {
        mouse: {
          target: jasmine.createSpy('mouseTarget').and.returnValue(targetCancelHandlerSpy)
        }
      },
      'utility/utils': {
        setScaleLock: noop,
        generateUserCSS: jasmine.createSpy().and.returnValue(''),
        getPageKeywords: jasmine.createSpy().and.returnValue('foo bar'),
        cappedIntervalCall: (callback) => { callback(); }
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPageValue
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'service/authentication' : {
        authentication: {
          getToken: noop,
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

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', function() {
    it('should add a new help center component to the helpCenter array', function() {
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

    it('changes config.buttonLabelKey if buttonLabelKey is set', function() {
      helpCenter.create('carlos', { buttonLabelKey: 'test_label' });

      const carlos = helpCenter.get('carlos');

      expect(carlos.config.buttonLabelKey)
        .toEqual('test_label');
    });

    it('changes config.formTitleKey if formTitleKey is set', function() {
      helpCenter.create('carlos', { formTitleKey: 'test_title' });

      const carlos = helpCenter.get('carlos');

      expect(carlos.config.formTitleKey)
        .toEqual('test_title');
    });

    describe('frameFactory', function() {
      let mockFrameFactory,
        mockFrameFactoryCall,
        childFn,
        params;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        helpCenter.create('carlos', frameConfig);
        mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
        childFn = mockFrameFactoryCall[0];
        params = mockFrameFactoryCall[1];
      });

      it('should apply the configs', function() {
        const carlos = helpCenter.get('carlos');
        const payload = childFn({});

        expect(payload.props.buttonLabelKey)
          .toEqual(carlos.config.buttonLabelKey);

        expect(payload.props.formTitleKey)
          .toEqual(carlos.config.formTitleKey);
      });
      it('should pass in zendeskHost from transport.getZendeskHost', function() {
        const payload = childFn({});

        expect(payload.props.zendeskHost)
          .toEqual('zendesk.host');
      });

      it('should the showBackButton state on the child component to false onBack', function() {
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

      describe('mediator broadcasts', function() {
        let mockMediator;

        beforeEach(function() {
          mockMediator = mockRegistry['service/mediator'].mediator;
        });

        it('should broadcast <name>.onClose with onClose', function() {
          params.onClose();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onClose');
        });

        it('should broadcast <name>.onNextClick with HelpCenterForm.onNextClick', function() {
          const payload = childFn({});

          payload.props.onNextClick();

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onNextClick');
        });

        it('should broadcast <name>.onSearch with onSearch', function() {
          const payload = childFn({});
          const params = {searchString: 'searchString', searchLocale: 'en-US'};

          payload.props.onSearch(params);

          expect(mockMediator.channel.broadcast)
            .toHaveBeenCalledWith('carlos.onSearch', params);
        });

        it('should not call focusField in afterShowAnimate for non-IE browser', function() {
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

        it('should call focusField in afterShowAnimate for IE browser', function() {
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

        it('should hide virtual keyboard onHide', function() {
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

        it('should back track search on hide', function() {
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

    it('should switch iframe styles based on isMobileBrowser()', function() {
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

    it('should switch container styles based on isMobileBrowser()', function() {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const childFnParams = {
        updateFrameSize: function() {}
      };

      mockIsMobileBrowser = true;

      helpCenter.create('carlos');

      const mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
      const payload = mockFrameFactoryCall[0](childFnParams);

      expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
    });
  });

  describe('get', function() {
    it('should return the correct helpCenter form', function() {
      helpCenter.create('carlos');
      const carlos = helpCenter.get('carlos');

      expect(carlos)
        .toBeDefined();
    });
  });

  describe('searchSender', function() {
    it('calls transport.send with regular search endpoint when called', () => {
      const mockTransport = mockRegistry['service/transport'].transport;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      const embed = helpCenter.get('carlos').instance.getRootComponent();

      embed.props.searchSender();

      expect(mockTransport.send)
        .toHaveBeenCalled();

      const recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      expect(recentCallArgs.path)
        .toEqual('/api/v2/help_center/search.json');
    });
  });

  describe('contextualSearchSender', function() {
    it('calls transport.send with contextual search endpoint when called', () => {
      const mockTransport = mockRegistry['service/transport'].transport;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      const embed = helpCenter.get('carlos').instance.getRootComponent();

      embed.props.contextualSearchSender();

      const recentCallArgs = mockTransport.send.calls.mostRecent().args[0];

      expect(recentCallArgs.path)
        .toEqual('/api/v2/help_center/articles/embeddable_search.json');
    });
  });

  describe('restrictedImagesSender', function() {
    it('calls transport.send with passed in image url when called', () => {
      const mockTransport = mockRegistry['service/transport'].transport;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      const embed = helpCenter.get('carlos').instance.getRootComponent();
      const url = 'https://url.com/image';

      embed.props.imagesSender(url);

      const recentCallArgs = mockTransport.getImage.calls.mostRecent().args[0];

      expect(recentCallArgs.path)
        .toEqual(url);
    });
  });

  describe('render', function() {
    it('should throw an exception if HelpCenter does not exist', function() {
      expect(function() {
        helpCenter.render('non_existent_helpCenter');
      }).toThrow();
    });

    it('renders a helpCenter form to the document', function() {
      helpCenter.create('carlos');
      helpCenter.render('carlos');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-helpCenter').length)
        .toEqual(1);

      expect(TestUtils.isCompositeComponent(helpCenter.get('carlos').instance))
        .toEqual(true);
    });

    it('should only be allowed to render an helpCenter form once', function() {
      helpCenter.create('carlos');

      expect(function() {
        helpCenter.render('carlos');
      }).not.toThrow();

      expect(function() {
        helpCenter.render('carlos');
      }).toThrow();
    });

    it('applies helpCenter.scss to the frame factory', function() {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
      const mockCss = mockRegistry['./helpCenter.scss'];

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      const mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toEqual(mockCss);
    });

    describe('mediator subscriptions', function() {
      let mockMediator,
        mockI18n,
        carlos,
        carlosHelpCenter;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockI18n = mockRegistry['service/i18n'].i18n;
        helpCenter.create('carlos');
        helpCenter.render('carlos');
        carlos = helpCenter.get('carlos');
        carlosHelpCenter = carlos.instance.getChild().refs.rootComponent;
      });

      it('should subscribe to <name>.show', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.show', jasmine.any(Function));

        jasmine.clock().install();
        pluckSubscribeCall(mockMediator, 'carlos.show')();
        jasmine.clock().tick(1);

        expect(helpCenter.get('carlos').instance.show.__reactBoundMethod)
          .toHaveBeenCalled();

        jasmine.clock().uninstall();
      });

      it('should subscribe to <name>.hide', function() {
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.hide', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'carlos.hide')();

        expect(helpCenter.get('carlos').instance.hide.__reactBoundMethod)
          .toHaveBeenCalled();
      });

      it('should subscribe to <name>.setNextToChat', function() {
        mockI18n.t.and.returnValue('chat label');

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.setNextToChat', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'carlos.setNextToChat')();

        expect(mockI18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.chat');

        expect(carlosHelpCenter.state.buttonLabel)
          .toEqual('chat label');
      });

      it('should subscribe to <name>.setNextToSubmitTicket', function() {
        mockI18n.t.and.returnValue('submitTicket label');

        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.setNextToSubmitTicket', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'carlos.setNextToSubmitTicket')();

        expect(mockI18n.t)
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.submitTicket.message');

        expect(carlosHelpCenter.state.buttonLabel)
          .toEqual('submitTicket label');
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

      describe('with authenticated help center', function() {
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

        it('should wait until authenticate is true before searching', function() {
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

    describe('postRender authentication', function() {
      it('should call authentication.revoke if there is a tokensRevokedAt property in the config', function() {
        helpCenter.create('carlos', { tokensRevokedAt: Math.floor(Date.now() / 1000) });
        helpCenter.postRender('carlos');

        const carlos = helpCenter.get('carlos');

        expect(revokeSpy)
          .toHaveBeenCalledWith(carlos.config.tokensRevokedAt);
      });

      it('should call authentication.authenticate if there is a jwt token in settings', function() {
        mockSettingsValue = { jwt: 'token' };

        helpCenter.create('carlos');
        helpCenter.postRender('carlos');

        expect(authenticateSpy)
          .toHaveBeenCalledWith('token');
      });
    });
  });
});
