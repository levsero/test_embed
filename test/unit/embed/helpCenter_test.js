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
      'component/HelpCenter': {
        HelpCenter: jasmine.createSpy('mockHelpCenter')
          .andCallFake(
            React.createClass({
              getInitialState: function() {
                return {
                  topics: [],
                  searchTitle: 'abc123',
                  searchCount: 0,
                  searchTerm: ''
                };
              },
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
      'utility/globals': {
        document: global.document
      },
      'imports?_=lodash!lodash': _
    });


    mockery.registerAllowable(helpCenterPath);

    helpCenter = require(helpCenterPath).helpCenter;

    frameConfig = {
      onShow: jasmine.createSpy('onShow'),
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
        helpCenter.create('bob', frameConfig);
        mockFrameFactoryRecentCall = mockFrameFactory.mostRecentCall.args;
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

      helpCenter.create('bob');
      helpCenter.render('bob');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-helpCenter').length)
        .toEqual(1);

      expect(ReactTestUtils.isCompositeComponent(helpCenter.get('bob').instance))
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

      helpCenter.create('bob');
      helpCenter.render('bob');

      mockFrameFactoryCss = mockFrameFactory.mostRecentCall.args[1].css;

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
