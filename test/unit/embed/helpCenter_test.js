/** @jsx React.DOM */

describe('embed.helpCenter', function() {
  var helpCenter,
      mockGlobals = {
        document: global.document
      },
      mockHelpCenter = jasmine.createSpy('mockHelpCenter')
        .andCallFake(
          React.createClass({
            render: function() {
              return (
                /* jshint quotmark:false */
                <div className='mock-helpCenter' />
              );
            }
          })
        ),
      frameFactoryConfig,
      mockCss = 'mockCss',
      mockFrameFactory = require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
      mockFrameMethods = require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods,
      helpCenterPath = buildSrcPath('embed/helpCenter/helpCenter');

  beforeEach(function() {

    resetDOM();

    frameFactoryConfig = {
      onShow: jasmine.createSpy('onShow'),
      onHide: jasmine.createSpy('onHide')
    },

    mockery.enable();
    mockery.registerMock('embed/frameFactory', {
      frameFactory: mockFrameFactory
    });
    mockery.registerMock('component/HelpCenter', {
      HelpCenter: mockHelpCenter
    });
    mockery.registerMock('./helpCenter.scss', mockCss);
    mockery.registerMock('utility/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', _);
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    mockery.registerAllowable('./properties/width');
    mockery.registerAllowable('./parsers');
    mockery.registerAllowable(helpCenterPath);

    helpCenter = require(helpCenterPath).helpCenter;
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
      var mockFrameFactoryRecentCall;

      beforeEach(function() {
        helpCenter.create('carlos', frameFactoryConfig);
        mockFrameFactoryRecentCall = mockFrameFactory.mostRecentCall.args;
      });

      it('passes HelpCenter correctly into frameFactory', function() {
        var mockHideHandler = noop,
            component = React.createClass({
              render: function() {
                return childFn({
                  hideHandler: mockHideHandler
                });
              }
            }),
            childFn = mockFrameFactoryRecentCall[0],
            helpCenter = React.renderComponent(
              <component />,
              global.document.body
            ),
            hideButton = helpCenter.refs.hideButton.props;

        expect(hideButton.onClick)
          .toBe(mockHideHandler);

        expect(hideButton.onTouchEnd)
          .toBe(mockHideHandler);
      });

      it('should call onHide/Show config methods if passed in', function() {
        var params = mockFrameFactoryRecentCall[1];

        params.onShow();

        expect(frameFactoryConfig.onShow)
          .toHaveBeenCalled();

        params.onHide();

        expect(frameFactoryConfig.onHide)
          .toHaveBeenCalled();
      });
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
      var carlos;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      expect(mockHelpCenter)
        .toHaveBeenCalled();

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame > div > .mock-helpCenter').length)
        .toEqual(1);

      carlos = helpCenter.get('carlos');

      expect(carlos.instance)
        .toBeDefined();
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
      var mockFrameFactoryCss;

      helpCenter.create('carlos');
      helpCenter.render('carlos');

      mockFrameFactoryCss = mockFrameFactory.mostRecentCall.args[1].css;

      expect(mockFrameFactoryCss)
        .toEqual(mockCss);
    });
  });

  describe('show', function() {
    it('should trigger the show function on the parent frame', function() {
      helpCenter.create('carlos');
      helpCenter.render('carlos');
      helpCenter.show('carlos');

      expect(mockFrameMethods.show)
        .toHaveBeenCalled();
    });
  });

  describe('hide', function() {
    it('should trigger the hide function of the parent frame', function() {
      helpCenter.create('carlos');
      helpCenter.render('carlos');
      helpCenter.hide('carlos');

      expect(mockFrameMethods.hide)
        .toHaveBeenCalled();
    });
  });

});
