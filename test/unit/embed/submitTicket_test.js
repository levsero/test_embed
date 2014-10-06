/** @jsx React.DOM */

describe('embed.submitTicket', function() {
  var submitTicket,
      mockRegistry,
      frameConfig,
      defaultValue = 'abc123',
      submitTicketPath = buildSrcPath('embed/submitTicket/submitTicket');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'service/beacon': noop,
      'component/SubmitTicket': {
        SubmitTicket: jasmine.createSpy('mockSubmitTicket')
          .and.callFake(
            React.createClass({
              getInitialState: function() {
                return {
                  showNotification: false,
                  message: '',
                  uid: defaultValue
                };
              },
              render: function() {
                return (
                  /* jshint quotmark:false */
                  <div className='mock-submitTicket' />
                );
              }
            })
          )
      },
      './submitTicket.scss': jasmine.createSpy('mockCss'),
      './submitTicketFrame.scss': jasmine.createSpy('mockFrameCss'),
      'embed/frameFactory': {
        frameFactory: require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
        frameMethods: require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods
      },
      'utility/utils': {
        setScaleLock: function() {}
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

    mockery.registerAllowable(submitTicketPath);

    submitTicket = require(submitTicketPath).submitTicket;

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
    it('show add a new submit ticket form to the submitTicket array', function() {
      var bob;

      expect(_.keys(submitTicket.list()).length)
        .toEqual(0);

      submitTicket.create('bob');

      expect(_.keys(submitTicket.list()).length)
        .toEqual(1);

      bob = submitTicket.get('bob');

      expect(bob)
        .toBeDefined();

      expect(bob.component)
        .toBeDefined();
    });

    describe('mockFrameFactoryRecentCall', function() {
      var mockFrameFactory,
          mockFrameFactoryRecentCall;

      beforeEach(function() {
        mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory;
        submitTicket.create('bob', frameConfig);
        mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;
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
      submitTicket = require(submitTicketPath).submitTicket;
      submitTicket.create('bob');

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

      submitTicket = require(submitTicketPath).submitTicket;

      submitTicket.create('bob');

      mockFrameFactoryRecentCall = mockFrameFactory.calls.mostRecent().args;

      payload = mockFrameFactoryRecentCall[0](childFnParams);

      expect(payload.props.style)
        .toEqual({height: '100%', width: '100%'});
    });

  });

  describe('get', function() {
    it('should return the correct submitTicket form', function() {
      var bob;

      submitTicket.create('bob');
      bob = submitTicket.get('bob');

      expect(bob)
        .toBeDefined();
    });
  });

  describe('render', function() {
    it('should throw an exception if SubmitTicket does not exist', function() {

      expect(function() {
        submitTicket.render('non_existent_submitTicket');
      }).toThrow();
    });

    it('renders a submitTicket form to the document', function() {
      var mockSubmitTicket = mockRegistry['component/SubmitTicket'].SubmitTicket;

      submitTicket.create('bob');
      submitTicket.render('bob');

      expect(document.querySelectorAll( '.mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll( '.mock-frame .mock-submitTicket').length)
        .toEqual(1);

      expect(ReactTestUtils.isCompositeComponent(submitTicket.get('bob').instance))
        .toEqual(true);

      expect(mockSubmitTicket)
        .toHaveBeenCalled();
    });

    it('should only be allowed to render an submitTicket form once', function() {
      submitTicket.create('bob');

      expect(function() {
        submitTicket.render('bob');
      }).not.toThrow();

      expect(function() {
        submitTicket.render('bob');
      }).toThrow();
    });

    it('applies submitTicket.scss to the frame', function() {
      var mockFrameFactory = mockRegistry['embed/frameFactory'].frameFactory,
          mockCss = mockRegistry['./submitTicket.scss'],
          mockFrameFactoryCss;

      submitTicket.create('bob');
      submitTicket.render('bob');

      mockFrameFactoryCss = mockFrameFactory.calls.mostRecent().args[1].css;

      expect(mockFrameFactoryCss)
        .toBe(mockCss);
    });
  });

  describe('show', function() {
    it('should call show on the embed', function() {
      var mockFrameMethods = mockRegistry['embed/frameFactory'].frameMethods;

      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.show('bob');

      expect(mockFrameMethods.show)
        .toHaveBeenCalled();
    });
  });

  describe('hide', function() {
    it('should call hide on embed', function() {
      var mockFrameMethods = mockRegistry['embed/frameFactory'].frameMethods;

      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.hide('bob');

      expect(mockFrameMethods.hide)
        .toHaveBeenCalled();
    });
  });
});
