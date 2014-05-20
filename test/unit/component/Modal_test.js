/** @jsx React.DOM */
var Modal, baseModal, propsModal;

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

    var onRequestClose = function(){};
    baseModal = React.renderComponent(<Modal />, global.document.body);
    propsModal = <Modal onRequestClose={onRequestClose} />;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should be added to the document when called', function () {
    expect(baseModal.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    expect(baseModal.props.onRequestClose).toBeUndefined();

    expect(propsModal.props.onRequestClose).toBeDefined();
  });

  it('should call the onRequestClose function when clicked on', function () {
    var onRequestClose = jasmine.createSpy(function(){}),
        modal = React.renderComponent(<Modal onRequestClose={onRequestClose} />, global.document.body);

    ReactTestUtils.Simulate.click(modal.refs.m);

    expect(onRequestClose).toHaveBeenCalled();
  });

  it('should correctly set the initial states when created', function () {
    expect(baseModal.state.show).toBe(false);
  });
});

