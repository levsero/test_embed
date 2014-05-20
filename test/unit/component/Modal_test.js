/** @jsx React.DOM */
var Modal;

describe('Modal component', function() {
  beforeEach(function() {

    mockery.enable({
      warnOnReplace:false
    });
    mockery.registerMock('mixin/validation', {
      validation: {
        baseValidation: [{test: function() {}, message: ''}],
        emailValidation: function() {},
        ValidationMixin: function() {}
      }
    });
    mockery.registerMock('imports?_=lodash!lodash', _ );

    var modalPath = buildPath('component/Modal');

    mockery.registerAllowable('react');
    mockery.registerAllowable(modalPath);

    Modal = require(modalPath).Modal;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should be added to the document when called', function () {
    var modal = React.renderComponent(<Modal />, global.document.body);

    expect(modal.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    var modal1 = <Modal />;
    expect(modal1.props.onRequestClose).toBeUndefined();

    var onRequestClose = function(){},
        modal2 = <Modal onRequestClose={onRequestClose} />;
    expect(modal2.props.onRequestClose).toBeDefined();
  });

  it('should call the onRequestClose function when clicked on', function () {
    var onRequestClose = jasmine.createSpy(function(){}),
        modal = React.renderComponent(<Modal onRequestClose={onRequestClose} />, global.document.body);

    ReactTestUtils.Simulate.click(modal.refs.m);

    expect(onRequestClose).toHaveBeenCalled();
  });

  it('should correctly set the initial states when created', function () {
    var modal = React.renderComponent(<Modal />, global.document.body);

    expect(modal.state.show).toBe(false);
  });
});

