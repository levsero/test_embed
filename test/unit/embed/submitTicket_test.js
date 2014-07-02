/** @jsx React.DOM */

describe('embed.submitTicket', function() {
  var submitTicket,
      frameConfig,
      defaultValue = 'abc123',
      mockGlobals = {
        document: global.document
      },
      mockSubmitTicket = jasmine.createSpy('mockSubmitTicket')
        .andCallFake(
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
        ),
      mockFrameFactory = require(buildTestPath('unit/mockFrameFactory')).mockFrameFactory,
      mockFrameMethods = require(buildTestPath('unit/mockFrameFactory')).mockFrameMethods,
      mockHideHandler = jasmine.createSpy(),
      mockCss = jasmine.createSpy('mockCss'),
      submitTicketPath = buildSrcPath('embed/submitTicket/submitTicket');

  beforeEach(function() {

    resetDOM();

    mockery.enable();
    mockery.registerMock('component/SubmitTicket', {
      SubmitTicket: mockSubmitTicket
    });
    mockery.registerMock('./submitTicket.scss', mockCss);
    mockery.registerMock('embed/frameFactory', {
      frameFactory: mockFrameFactory
    });
    mockery.registerMock('util/globals', mockGlobals);
    mockery.registerMock('imports?_=lodash!lodash', _);
    mockery.registerAllowable('react');
    mockery.registerAllowable('./lib/React');
    mockery.registerAllowable('./properties/width');
    mockery.registerAllowable('./parsers');
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
      var mockFrameFactoryRecentCalls;

      beforeEach(function() {
        submitTicket.create('bob', frameConfig);
        mockFrameFactoryRecentCalls = mockFrameFactory.mostRecentCall.args;
      });

      it('passes SubmitTicket correctly into frameFactory', function() {

        var body = global.document.body,
            childFn = mockFrameFactoryRecentCalls[0],
            component = React.createClass({
              render: function() {
                return childFn({
                  hideHandler: mockHideHandler
                });
              }
            }),
            submitTicketInstance = React.renderComponent(<component />, body)
              .refs
              .submitTicket;

        expect(submitTicketInstance.props.hide)
          .toBe(mockHideHandler);
      });

      it('calling hideHandler on embed calls frameFactory methods', function() {
        var params = mockFrameFactoryRecentCalls[1],
            mockSubmitTicketHide = jasmine.createSpy('mockSubmitTicketHide'),
            mockSubmitTicketReset = jasmine.createSpy('mockSubmitTicketReset'),
            mockFrameFactoryScope = {
              getChild: function() {
                return {
                  refs: {
                    submitTicket: {
                      state: {
                        showNotification: true
                      },
                      reset: mockSubmitTicketReset
                    }
                  }
                };
              },
              hide: mockSubmitTicketHide
            };

        params.extend.hideHandler.bind(mockFrameFactoryScope)();

        expect(mockSubmitTicketHide)
          .toHaveBeenCalled();

        expect(mockSubmitTicketReset)
          .toHaveBeenCalled();
      });

      it('should call onHide/Show config methods if passed in', function() {
        var params = mockFrameFactoryRecentCalls[1];

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
      var mockFrameFactoryCss;

      submitTicket.create('bob');
      submitTicket.render('bob');

      mockFrameFactoryCss = mockFrameFactory.mostRecentCall.args[1].css;

      expect(mockFrameFactoryCss)
        .toBe(mockCss);
    });
  });

  describe('show', function() {
    it('should call show on the embed', function() {
      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.show('bob');

      expect(mockFrameMethods.show)
        .toHaveBeenCalled();
    });
  });

  describe('hide', function() {
    it('should call hide on embed', function() {
      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.hide('bob');

      expect(mockFrameMethods.hide)
        .toHaveBeenCalled();
    });
  });
});
