/** @jsx React.DOM */

describe('embed.helpCenter', function() {
  var helpCenter,
      mockRegistry,
      frameConfig,
      helpCenterPath = buildSrcPath('embed/helpCenter/helpCenter');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/beacon': noop,
      'service/i18n': noop,
      'service/transport': {
        transport: {
          getZendeskHost: function() {
            return 'zendesk.host';
          }
        }
      },
      'component/HelpCenter': {
        HelpCenter: jasmine.createSpy('mockHelpCenter')
          .and.callFake(
            React.createClass({
              getInitialState: function() {
                return {
                  topics: [],
                  searchCount: 0,
                  searchTerm: '',
                  hasSearched: false
                };
              },
              focusField: noop,
              render: function() {
                return (
                  /* jshint quotmark:false */
                  <div className='mock-helpCenter' />
                );
              }
            })
          )
      },
      './helpCenter.scss': jasmine.createSpy('mockCss'),
      './helpCenterFrame.scss': jasmine.createSpy('mockFrameCss'),
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/devices': {
        isMobileBrowser: function() {
          return false;
        }
      },
      'utility/utils': {
        setScaleLock: noop
      },
      'utility/globals': {
        document: global.document
      },
      'imports?_=lodash!lodash': _
    });


    mockery.registerAllowable(helpCenterPath);

    helpCenter = require(helpCenterPath).helpCenter;

    frameConfig = {
      onShow: jasmine.createSpy('onShow').and.callFake(noop),
      onHide: jasmine.createSpy('onHide')
    };
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('create', function() {
    it('should add a new help center component to the helpCenter array', function() {
      var carlos;

      expect(_.keys(helpCenter.list()).length)
        .toEqual(0);

      helpCenter.create('carlos');

      expect(_.keys(helpCenter.list()).length)
        .toEqual(1);

      carlos = helpCenter.get('carlos');

      expect(carlos)
        .toBeDefined();

      expect(carlos.component)
        .toBeDefined();

    });

    describe('mockFrameFactoryRecentCall', function() {
      var mockFrameFactory,
          mockFrameFactoryRecentCall;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        helpCenter.create('carlos', frameConfig);

        helpCenter.render('carlos');
        mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;
      });

      it('should pass in zendeskHost from transport.getZendeskHost', function() {
        var childFn,
            payload;

        childFn = mockFrameFactoryRecentCall[0];

        payload = childFn({});

        expect(payload.props.children.props.zendeskHost)
          .toEqual('zendesk.host');
      });

      it('should call onHide/Show config methods if passed in', function() {
        var params = mockFrameFactoryRecentCall[1];

        params.onShow();

        expect(frameConfig.onShow)
          .toHaveBeenCalled();

        params.onHide();

        expect(frameConfig.onHide)
          .toHaveBeenCalled();
      });
    });

    it('should switch iframe styles based on isMobileBrowser()', function() {
     var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
         mockFrameFactoryRecentCall,
         iframeStyle;

      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });
      mockery.resetCache();
      helpCenter = require(helpCenterPath).helpCenter;
      helpCenter.create('carlos');

      mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;

      iframeStyle = mockFrameFactoryRecentCall[1].style;

      expect(iframeStyle.left)
        .toBeUndefined();

      expect(iframeStyle.right)
        .toBeUndefined();
    });

    it('should switch container styles based on isMobileBrowser()', function() {
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockFrameFactoryRecentCall,
          childFnParams = {
            updateFrameSize: function() {}
          },
          payload;

      mockery.registerMock('utility/devices', {
        isMobileBrowser: function() {
          return true;
        }
      });

      mockery.resetCache();

      helpCenter = require(helpCenterPath).helpCenter;

      helpCenter.create('carlos');

      mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;

      payload = mockFrameFactoryRecentCall[0](childFnParams);

      expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
    });
  });

  describe('get', function() {
    it('should return the correct helpCenter form', function() {
      var carlos;

      helpCenter.create('carlos');
      carlos = helpCenter.get('carlos');

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
      var mockHelpCenter = mockRegistry['component/HelpCenter'].HelpCenter;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-helpCenter').length)
        .toEqual(1);

      expect(ReactTestUtils.isCompositeComponent(helpCenter.get('carlos').instance))
        .toEqual(true);

      expect(mockHelpCenter)
        .toHaveBeenCalled();
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
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockCss = mockRegistry['./helpCenter.scss'],
          mockFrameFactoryCss;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toBe(mockCss);
    });
  });

  describe('show', function() {
    it('should trigger the show function on the parent frame', function() {
      var mockFrameMethods = mockRegistry['embed/frameFactory'].frameMethods;

      helpCenter.create('carlos');
      helpCenter.render('carlos');
      helpCenter.show('carlos');

      expect(mockFrameMethods.show)
        .toHaveBeenCalled();
    });
  });

  describe('hide', function() {
    it('should trigger the hide function of the parent frame', function() {
      var mockFrameMethods = mockRegistry['embed/frameFactory'].frameMethods;

      helpCenter.create('carlos');
      helpCenter.render('carlos');
      helpCenter.hide('carlos');

      expect(mockFrameMethods.hide)
        .toHaveBeenCalled();
    });
  });

});
