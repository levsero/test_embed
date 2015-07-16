describe('SubmitTicketForm component', function() {
  var SubmitTicketForm,
      onSubmit,
      mockRegistry;
  const submitTicketFormPath = buildSrcPath('component/SubmitTicketForm');

  beforeEach(function() {

    onSubmit = jasmine.createSpy();

    resetDOM();

    mockery.enable({
      warnOnReplace:false,
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
      'component/Button': {
        Button: React.createClass({
            render: function() {
              return <input type='submit' disabled={this.props.disabled} />;
            }
          })
      },
      'component/FormField': {
        Field: noopReactComponent(),
        getCustomFields: function() {
          return {};
        }
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['t', 'setLocale', 'init', 'isRTL'])
      },
      'lodash': _
    });

    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(submitTicketFormPath);

    SubmitTicketForm = require(submitTicketFormPath).SubmitTicketForm;

  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly render form with noValidate attribute', function() {
    var submitTicketForm = React.render(
      <SubmitTicketForm />,
      global.document.body
    );

    expect(submitTicketForm.getDOMNode().getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    const submitTicketForm = React.render(
      <SubmitTicketForm submit={onSubmit} />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(submitTicketForm.getDOMNode());

    expect(onSubmit)
      .toHaveBeenCalled();
  });

  it('should change state and alter submit button on valid submit', function() {
    const submitTicketForm = React.render(
      <SubmitTicketForm submit={onSubmit} />,
      global.document.body
    );
    const submitTicketFormNode = submitTicketForm.getDOMNode();
    const submitElem = submitTicketFormNode.querySelector('input[type="submit"]');
    const i18n = mockRegistry['service/i18n'].i18n;

    i18n.t.and.returnValue('Foobar...');

    expect(submitElem.disabled)
      .toEqual(true);

    submitTicketForm.setState({isValid: true});

    expect(submitElem.disabled)
      .toEqual(false);

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(false);

    ReactTestUtils.Simulate.submit(submitTicketForm.getDOMNode());

    expect(submitTicketForm.state.isSubmitting)
      .toEqual(true);

    expect(submitElem.disabled)
      .toEqual(true);
  });
});
