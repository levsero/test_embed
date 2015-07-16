describe('HelpCenterForm component', function() {
  var HelpCenterForm,
      onSubmit,
      onSearch,
      mockRegistry;
  const helpCenterFormPath = buildSrcPath('component/HelpCenterForm');

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
      'component/FormField': {
        SearchField: noop
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          't',
          'isRTL'
        ])
      }
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
    const helpCenterForm = React.render(
      <HelpCenterForm />,
      global.document.body
    );

    expect(helpCenterForm.getDOMNode().getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    const helpCenterForm = React.render(
      <HelpCenterForm onSubmit={onSubmit} />,
      global.document.body
    );

    ReactTestUtils.Simulate.submit(helpCenterForm.getDOMNode());

    expect(onSubmit)
      .toHaveBeenCalled();
  });

  it('should call onSearch when input value changes', function() {
    const helpCenterForm = React.render(
      <HelpCenterForm onSearch={onSearch}>
        <input />
      </HelpCenterForm>,
      global.document.body
    );
    const helpCenterFormNode = helpCenterForm.getDOMNode();

    ReactTestUtils.Simulate.change(helpCenterFormNode.querySelector('input'));

    expect(onSearch)
      .toHaveBeenCalled();
  });
});
