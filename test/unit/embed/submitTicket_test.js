/** @jsx React.DOM */

describe('embed.submitTicket', function() {
  var submitTicket,
      defaultValue = 'abc123',
      mockGlobals = {
        document: global.document
      },
      frameConfig = {
        onShow: jasmine.createSpy('onShow'),
        onHide: jasmine.createSpy('onHide')
      },
      mockFrame = jasmine.createSpy('mockFrame')
        .andCallFake(
          React.createClass({
            hide: function() {
              this.setState({show: false});
            },
            show: function() {
              this.setState({show: true});
            },
            getInitialState: function() {
              return {
                show: true
              };
            },
            render: function() {
              return (
                /* jshint quotmark:false */
                <div className='mock-frame'>
                  {this.props.children}
                </div>
              );
            }
          })
        ),
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
      mockResetHandler = jasmine.createSpy(),
      mockCss = jasmine.createSpy('mockCss'),
      submitTicketPath = buildSrcPath('embed/submitTicket/submitTicket');

  beforeEach(function() {

    resetDOM();

    mockery.enable();
    mockery.registerMock('component/Frame', {
      Frame: mockFrame
    });
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
      submitTicket.render('bob');

      expect(mockSubmitTicket)
        .toHaveBeenCalled();

      expect(_.keys(submitTicket.list()).length)
        .toEqual(1);

      bob = submitTicket.get('bob');

      expect(bob)
        .toBeDefined();

      expect(bob.component)
        .toBeDefined();
    });

    it('passes SubmitTicket correctly into frameFactory', function() {

      var childFn,
          component,
          submitTicketInstance,
          body = global.document.body;

      submitTicket.create('bob', frameConfig);

      childFn = mockFrameFactory.mostRecentCall.args[0];

      component = React.createClass({
        render: function() {
          return childFn({
            hideHandler: mockHideHandler,
            resetHandler: mockResetHandler
          });
        }
      });

      submitTicketInstance = React.renderComponent(<component />, body);
      submitTicketInstance = submitTicketInstance.refs.submitTicket;

      expect(submitTicketInstance.props.hide)
        .toBe(mockHideHandler);

      expect(submitTicketInstance.props.reset)
        .toBe(mockResetHandler);

    });

    it('calling hideHandler on embed calls frameFactory methods', function() {
      var params = mockFrameFactory.mostRecentCall.args[1];

      var mockSubmitTicketHide = jasmine.createSpy('mockSubmitTicketHide');
      var mockSubmitTicketReset = jasmine.createSpy('mockSubmitTicketReset');

      var mockFrameFactoryScope = {
        getChild: function() {
          return {
            refs: {
              submitTicket: {
                state: {
                  showNotification: true
                }
              }
            }
          };
        },
        hide: mockSubmitTicketHide,
        reset: mockSubmitTicketReset
      };

      params.extend.hideHandler.bind(mockFrameFactoryScope)();

      expect(mockSubmitTicketHide)
        .toHaveBeenCalled();

      expect(mockSubmitTicketReset)
        .toHaveBeenCalled();
    });

    it('should call onHide/Show config methods if passed in', function() {
      var params = mockFrameFactory.mostRecentCall.args[1];

      params.onShow();

      expect(frameConfig.onShow)
        .toHaveBeenCalled();

      params.onHide();

      expect(frameConfig.onHide)
        .toHaveBeenCalled();
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
