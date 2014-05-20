/** @jsx React.DOM */
var Modal, baseModal, propsModal, div;

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
    div = document.body.appendChild(document.createElement('div'));
    baseModal = <Modal />;
    propsModal = <Modal onRequestClose={onRequestClose} />;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();

    if(div) {
      div.parentNode.removeChild(div);
    }
  });

  it('should be added to the document when called', function () {
    var modal = React.renderComponent(baseModal, div);
    expect(modal.getDOMNode()).toBeDefined();
  });

  it('should have the correct props when defined', function () {
    expect(baseModal.props.onRequestClose).toBeUndefined();

    expect(propsModal.props.onRequestClose).toBeDefined();
  });

  it('should call the onRequestClose function when clicked on', function () {
    var onRequestClose = jasmine.createSpy(function(){}),
        modal = React.renderComponent(<Modal onRequestClose={onRequestClose} />, div);

    ReactTestUtils.Simulate.click(modal.refs.m);

    expect(onRequestClose).toHaveBeenCalled();
  });

  it('should correctly set the initial states when created', function () {
    var modal = React.renderComponent(baseModal, div);
    expect(modal.state.show).toBe(false);
  });
});

