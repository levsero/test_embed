/** @jsx React.DOM */

describe('embed.submitTicket', function() {
  var submitTicket,
      mockGlobals = {
        document: global.document
      },
      mockFrame = jasmine.createSpy('mockFrame')
        .andCallFake(
          React.createClass({
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
      mockModal = jasmine.createSpy('mockModal')
        .andCallFake(
          React.createClass({
            getInitialState: function() {
              return {show: false};
            },
            render: function() {
              return (
                /* jshint quotmark:false */
                <div className='mock-modal'>
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
              return {showNotification: false, message: ''};
            },
            render: function() {
              return (
                /* jshint quotmark:false */
                <div className='mock-submitTicket' />
              );
            }
          })
        ),
      mockCss = jasmine.createSpy('mockCss'),
      submitTicketPath = buildPath('embed/submitTicket/submitTicket');

  beforeEach(function() {

    resetDOM();

    mockery.enable();
    mockery.registerMock('component/Frame', {
      Frame: mockFrame
    });
    mockery.registerMock('component/SubmitTicket', {
      SubmitTicket: mockSubmitTicket
    });
    mockery.registerMock('component/Modal', {
      Modal: mockModal
    });
    mockery.registerMock('./submitTicket.scss', mockCss);
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

  describe('getFormComponent', function() {
    it('should return the correct submitTicket component', function() {
      var bob;

      submitTicket.create('bob');
      bob = submitTicket.getFormComponent('bob');

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

      expect(document.querySelectorAll('.mock-modal').length)
        .toEqual(1);

      expect(document.querySelectorAll('.mock-modal > .mock-frame').length)
        .toEqual(1);

      expect(document.querySelectorAll('.mock-modal > .mock-frame > .mock-submitTicket').length)
        .toEqual(1);
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
      var mockFrameCss;

      submitTicket.create('bob');
      submitTicket.render('bob');

      mockFrameCss = mockFrame.mostRecentCall.args[0].css;

      expect(mockFrameCss)
        .toBe(mockCss);
    });
  });

  describe('show', function() {
    it('should change the forms state to show it', function() {
      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.show('bob');

      expect(submitTicket.get('bob').component.state.show)
        .toEqual(true);
    });
  });

  describe('hide', function() {
    it('should change the forms state to hide it', function() {
      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.show('bob');
      submitTicket.hide('bob');

      expect(submitTicket.get('bob').component.state.show)
        .toEqual(false);
    });
  });

  describe('toggleVisibility', function() {
    it('should change the forms state', function() {
      var state;

      submitTicket.create('bob');
      submitTicket.render('bob');

      state = submitTicket.get('bob').component.state.show;

      submitTicket.toggleVisibility('bob');

      expect(submitTicket.get('bob').component.state.show)
        .not.toEqual(state);

      submitTicket.toggleVisibility('bob');

      expect(submitTicket.get('bob').component.state.show)
        .toEqual(state);
    });

    it('should reset the state of the form if show notification is true', function() {
      var component;

      submitTicket.create('bob');
      submitTicket.render('bob');

      component = submitTicket.getFormComponent('bob');
      component.setState({showNotification: true, message: 'something'});

      expect(component.state)
        .not.toEqual(component.getInitialState());

      submitTicket.toggleVisibility('bob');

      expect(component.state)
        .toEqual(component.getInitialState());
    });
  });

  describe('reset', function() {
    it('should reset the form back it its initial state', function() {
      var component;

      submitTicket.create('bob');
      submitTicket.render('bob');

      component = submitTicket.getFormComponent('bob');
      component.setState({showNotification: true, message: 'something'});

      submitTicket.reset('bob');

      expect(component.state)
        .toEqual(component.getInitialState());
    });
  });
});
