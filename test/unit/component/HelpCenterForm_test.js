/** @jsx React.DOM */

describe('HelpCenterForm component', function() {
  var HelpCenterForm,
      onSubmit,
      onSearch,
      mockRegistry,
      helpCenterFormPath = buildSrcPath('component/HelpCenterForm');

  beforeEach(function() {

    onSubmit = jasmine.createSpy();
    onSearch = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace:false,
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Loading': {
        Loading: noop
      },
      'component/Button': {
        Button: jasmine.createSpy('mockButton')
          .and.callFake(React.createClass({
            render: function() {
              /* jshint quotmark:false */
              return (
                <input onClick={this.props.handleClick} />
              );
            }
          }))
      },
      'component/FormField': {
        SearchField: noop
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t', 'setLocale', 'init'])
      },
      'imports?_=lodash!lodash': _
    });

    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(helpCenterFormPath);

    HelpCenterForm = require(helpCenterFormPath).HelpCenterForm;

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly render form with noValidate attribute', function() {
    var helpCenterForm = React.renderComponent(
      <HelpCenterForm />,
      global.document.body
    );

    expect(helpCenterForm.getDOMNode().getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    var helpCenterForm = React.renderComponent(
      <HelpCenterForm onSubmit={onSubmit} />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(helpCenterForm.getDOMNode());

    expect(onSubmit)
      .toHaveBeenCalled();
  });

  it('should call onSearch when input value changes', function() {
    var helpCenterForm = React.renderComponent(
          <HelpCenterForm onSearch={onSearch} />,
          global.document.body
        ),
        helpCenterFormNode = helpCenterForm.getDOMNode();

    ReactTestUtils.Simulate.change(helpCenterFormNode.querySelector('input'));

    expect(onSearch)
      .toHaveBeenCalled();
  });
});
