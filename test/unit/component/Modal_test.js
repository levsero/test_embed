/** @jsx React.DOM */
var Modal;

describe('Modal component', function() {
  beforeEach(function() {
    resetDOM();

    mockery.enable({
      warnOnReplace:false
    });
    mockery.registerMock('mixin/validation', {
      validation: {
        baseValidation: noop,
        emailValidation: noop,
        ValidationMixin: noop
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

  it('should call the onRequestClose function when clicked on', function () {
    var onRequestClose = jasmine.createSpy(),
        modal = React.renderComponent(<Modal onRequestClose={onRequestClose} />, global.document.body);

    ReactTestUtils.Simulate.click(modal.getDOMNode());

    expect(onRequestClose).toHaveBeenCalled();
  });

  it('should correctly set the initial states when created', function () {
    var modal = React.renderComponent(<Modal />, global.document.body);
    expect(modal.state.show).toBe(false);
  });
});

