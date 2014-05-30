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
      mockComponent = jasmine.createSpy('mockComponent')
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
      SubmitTicket: mockComponent
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
        .toBe(0);

      submitTicket.create('bob');

      expect(mockComponent)
        .toHaveBeenCalled();

      expect(_.keys(submitTicket.list()).length)
        .toBe(1);

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
        .not.toBeUndefined();
    });

  });

  describe('getFormComponent', function() {
    it('should return the correct submitTicket component', function() {
      var bob;

      submitTicket.create('bob');
      bob = submitTicket.getFormComponent('bob');

      expect(bob)
        .not.toBeUndefined();
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

      expect(document.querySelectorAll('body > div > .mock-modal').length)
        .toBe(1);

      expect(document.querySelectorAll('body > div > .mock-modal > .mock-frame').length)
        .toBe(1);

      expect(document.querySelectorAll('body > div > .mock-modal > .mock-frame > .mock-submitTicket').length)
        .toBe(1);
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
      var state;

      submitTicket.create('bob');
      submitTicket.render('bob');

      state = submitTicket.get('bob').component.state.show;

      submitTicket.show('bob');

      expect(submitTicket.get('bob').component.state.show).not.toBe(state);
    });
  });

  describe('hide', function() {
    it('should change the forms state to hide it', function() {
      var state;

      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.show('bob');

      state = submitTicket.get('bob').component.state.show;

      submitTicket.hide('bob');

      expect(submitTicket.get('bob').component.state.show).not.toBe(state);
    });

    it('should reset the state of the form if show notification is true', function() {
      var component;

      submitTicket.create('bob');
      submitTicket.render('bob');
      submitTicket.show('bob');

      component = submitTicket.getFormComponent('bob');
      component.setState({showNotification: true, message: 'something'});

      expect(component.state).not.toEqual(component.getInitialState());

      submitTicket.hide('bob');

      expect(component.state).toEqual(component.getInitialState());
    });
  });

  describe('toggleVisibility', function() {
    it('should change the forms state', function() {
      var state;

      submitTicket.create('bob');
      submitTicket.render('bob');

      state = submitTicket.get('bob').component.state.show;

      submitTicket.toggleVisibility('bob');

      expect(submitTicket.get('bob').component.state.show).not.toBe(state);

      submitTicket.toggleVisibility('bob');

      expect(submitTicket.get('bob').component.state.show).toBe(state);
    });

    it('should reset the state of the form if show notification is true', function() {
      var component;

      submitTicket.create('bob');
      submitTicket.render('bob');

      component = submitTicket.getFormComponent('bob');
      component.setState({showNotification: true, message: 'something'});

      expect(component.state).not.toEqual(component.getInitialState());

      submitTicket.toggleVisibility('bob');
      submitTicket.toggleVisibility('bob');

      expect(component.state).toEqual(component.getInitialState());
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

      expect(component.state).toEqual(component.getInitialState());
    });
  });
});
