describe('embed.helpCenter', function() {
  let helpCenter,
    mockRegistry,
    frameConfig,
    focusField;
  const helpCenterPath = buildSrcPath('embed/helpCenter/helpCenter');
  const resetSearchFieldState = jasmine.createSpy();
  const hideVirtualKeyboard = jasmine.createSpy();
  const backtrackSearch = jasmine.createSpy();
  const performSearch = jasmine.createSpy();
  const contextualSearch = jasmine.createSpy();

  beforeEach(function() {
    const mockForm = noopReactComponent();

    focusField = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/beacon': {
        beacon: jasmine.createSpyObj('beacon', ['track'])
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t'])
      },
      'service/transport': {
        transport: {
          send: jasmine.createSpy('transport.send'),
          getZendeskHost: function() {
            return 'zendesk.host';
          }
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      'component/HelpCenter': {
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
          resetSearchFieldState: resetSearchFieldState,
          hideVirtualKeyboard: hideVirtualKeyboard,
          backtrackSearch: backtrackSearch,
          contextualSearch: contextualSearch,
          performSearch: performSearch,
          focusField: focusField,
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
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        },
        isIE: function() {
          return false;
        }
      },
      'utility/utils': {
        setScaleLock: noop,
        generateUserCSS: jasmine.createSpy().and.returnValue(''),
        getPageKeywords: jasmine.createSpy().and.returnValue('foo bar')
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
      },
      'service/transitionFactory' : {
        transitionFactory: require(buildTestPath('unit/mockTransitionFactory')).mockTransitionFactory
      },
      'lodash': _
    });

    mockery.registerAllowable(helpCenterPath);

    helpCenter = require(helpCenterPath).helpCenter;

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

        it('should reset form state onShow', function() {
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');
          const helpCenterFrame = helpCenter.get('carlos').instance;
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.onShow(helpCenterFrame);

          expect(resetSearchFieldState)
            .toHaveBeenCalled();
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
          mockery.registerMock('utility/devices', {
            isMobileBrowser: function() {
              return false;
            },
            isIE: function() {
              return true;
            }
          });
          mockery.resetCache();
          helpCenter = require(helpCenterPath).helpCenter;
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
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');
          const helpCenterFrame = helpCenter.get('carlos').instance;
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.onHide(helpCenterFrame);

          expect(hideVirtualKeyboard)
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

        it('should set showIntroScreen to true for satisfied conditions on hide', function() {
          // hasSearched === false &&
          // isMobileBrowser()

          mockery.registerMock('utility/devices', {
            isMobileBrowser: function() {
              return true;
            }
          });
          mockery.resetCache();
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');
          const helpCenterFrame = helpCenter.get('carlos').instance;
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          expect(helpCenterFrame.getRootComponent().state.showIntroScreen)
            .toEqual(false);

          params.onHide(helpCenterFrame);

          expect(helpCenterFrame.getRootComponent().state.showIntroScreen)
            .toEqual(true);
        });

        it('should not set showIntroScreen to true for unsatisfied conditions on hide', function() {
          mockery.registerMock('utility/devices', {
            isMobileBrowser: function() {
              return false;
            }
          });
          mockery.resetCache();
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');
          const helpCenterFrame = helpCenter.get('carlos').instance;
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          expect(helpCenterFrame.getRootComponent().state.showIntroScreen)
            .toEqual(false);

          params.onHide(helpCenterFrame);

          expect(helpCenterFrame.getRootComponent().state.showIntroScreen)
            .toEqual(false);
        });
      });

    });

    it('should switch iframe styles based on isMobileBrowser()', function() {
      const mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;

      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });
      mockery.resetCache();
      helpCenter = require(helpCenterPath).helpCenter;
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

      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });

      mockery.resetCache();

      helpCenter = require(helpCenterPath).helpCenter;

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
    it('calls transport.sendWithMeta when called', () => {
      const mockTransport = mockRegistry['service/transport'].transport;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      const embed = helpCenter.get('carlos').instance.getRootComponent();

      embed.props.searchSender();

      expect(mockTransport.send)
        .toHaveBeenCalled();
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

      expect(ReactTestUtils.isCompositeComponent(helpCenter.get('carlos').instance))
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

      it('should subscribe to <name>.setHelpCenterSuggestions', function() {
        const keywords = ['foo', 'bar'];
        expect(mockMediator.channel.subscribe)
          .toHaveBeenCalledWith('carlos.setHelpCenterSuggestions', jasmine.any(Function));

        pluckSubscribeCall(mockMediator, 'carlos.setHelpCenterSuggestions')(keywords);

        expect(contextualSearch)
          .toHaveBeenCalledWith(keywords);
      });
    });

    describe('postRender contextual help', function() {
      let getPageKeywordsSpy,
        contextualSearchSpy;

      beforeEach(function() {
        getPageKeywordsSpy = mockRegistry['utility/utils'].getPageKeywords;
        contextualSearchSpy = jasmine.createSpy('contextualSearch');

        helpCenter.create('carlos', { contextualHelpEnabled: true });

        const helpCenterFrame = helpCenter.get('carlos');
        helpCenterFrame.instance = {
          getRootComponent: () => {
            return {
              contextualSearch: contextualSearchSpy
            };
          }
        };
      });

      it('should call keywordSearch on non helpcenter pages', function() {
        mockRegistry['utility/globals'].location = {
          pathname: '/foo/bar'
        };
        mockery.resetCache();

        helpCenter.postRender('carlos');

        expect(getPageKeywordsSpy)
          .toHaveBeenCalled();

        // This is 'foo bar' because it's what the getPageKeywords spy returns
        expect(contextualSearchSpy)
          .toHaveBeenCalledWith({ search: 'foo bar' });
      });

      it('should\'t call keywordSearch on helpcenter pages', function() {
        mockRegistry['utility/globals'].location = {
          pathname: '/hc/1234-article-foo-bar'
        };
        mockery.resetCache();

        helpCenter.postRender('carlos');

        expect(getPageKeywordsSpy)
          .not.toHaveBeenCalled();
      });
    });
  });
});
