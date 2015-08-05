describe('embed.helpCenter', function() {
  let helpCenter,
      mockRegistry,
      frameConfig,
      focusField;
  const helpCenterPath = buildSrcPath('embed/helpCenter/helpCenter');
  const resetSearchFieldState = jasmine.createSpy();
  const hideVirtualKeyboard = jasmine.createSpy();
  const backtrackSearch = jasmine.createSpy();

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
              hasSearched: false
            };
          },
          resetSearchFieldState: resetSearchFieldState,
          hideVirtualKeyboard: hideVirtualKeyboard,
          backtrackSearch: backtrackSearch,
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
        generateUserCSS: jasmine.createSpy().and.returnValue('')
      },
      'utility/globals': {
        document: global.document,
        getDocumentHost: function() {
          return document.body;
        }
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

      it('should pass in zendeskHost from transport.getZendeskHost', function() {
        const payload = childFn({});

        expect(payload.props.zendeskHost)
          .toEqual('zendesk.host');
      });

      describe('mediator broadcasts', function() {
        let mockMediator,
            helpCenterChild;

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
          helpCenterChild = helpCenter.get('carlos').instance.getChild();
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.onShow(helpCenterChild);

          expect(resetSearchFieldState)
            .toHaveBeenCalled();
        });

        it('should not call focusField in afterShowAnimate for non-IE browser', function() {
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');
          helpCenterChild = helpCenter.get('carlos').instance.getChild();
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.afterShowAnimate(helpCenterChild);
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
          helpCenterChild = helpCenter.get('carlos').instance.getChild();
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.afterShowAnimate(helpCenterChild);

          expect(focusField)
            .toHaveBeenCalled();
        });

        it('should hide virtual keyboard onHide', function() {
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');
          helpCenterChild = helpCenter.get('carlos').instance.getChild();
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.onHide(helpCenterChild);

          expect(hideVirtualKeyboard)
            .toHaveBeenCalled();
        });

        it('should back track search on hide', function() {
          helpCenter = require(helpCenterPath).helpCenter;
          helpCenter.create('carlos', frameConfig);
          helpCenter.render('carlos');
          helpCenterChild = helpCenter.get('carlos').instance.getChild();
          mockFrameFactoryCall = mockFrameFactory.calls.mostRecent().args;
          params = mockFrameFactoryCall[1];

          params.onHide(helpCenterChild);

          expect(backtrackSearch)
            .toHaveBeenCalled();
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
          carlosHelpCenter,
          carlosHelpCenterForm;

      beforeEach(function() {
        mockMediator = mockRegistry['service/mediator'].mediator;
        mockI18n = mockRegistry['service/i18n'].i18n;
        helpCenter.create('carlos');
        helpCenter.render('carlos');
        carlos = helpCenter.get('carlos');
        carlosHelpCenter = carlos.instance.getChild().refs.rootComponent;
        carlosHelpCenterForm = carlosHelpCenter.refs.helpCenterForm;
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
          .toHaveBeenCalledWith('embeddable_framework.helpCenter.submitButton.label.submitTicket');

        expect(carlosHelpCenter.state.buttonLabel)
          .toEqual('submitTicket label');
      });
    });

  });
});
