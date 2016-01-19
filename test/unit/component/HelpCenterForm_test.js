describe('HelpCenterForm component', function() {
  let HelpCenterForm, onSubmit;

  const helpCenterFormPath = buildSrcPath('component/HelpCenterForm');

  beforeEach(function() {
    onSubmit = jasmine.createSpy();

    resetDOM();
    jasmine.clock().install();

    mockery.enable({
      warnOnReplace: false
    });

    initMockRegistry({
      'React': React,
      'component/Loading': {
        LoadingEllipses: noopReactComponent()
      },
      'component/FormField': {
        SearchField: noopReactComponent()
      },
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', [
          'init',
          'setLocale',
          't',
          'isRTL'
        ])
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable('utility/globals');
    mockery.registerAllowable(helpCenterFormPath);

    HelpCenterForm = requireUncached(helpCenterFormPath).HelpCenterForm;
  });

  afterEach(function() {
    jasmine.clock().uninstall();
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should correctly render form with noValidate attribute', function() {
    const helpCenterForm = domRender(<HelpCenterForm />);

    expect(ReactDOM.findDOMNode(helpCenterForm).getAttribute('novalidate'))
      .toEqual('');
  });

  it('should call parent component submit when form is submitted', function() {
    const helpCenterForm = domRender(<HelpCenterForm onSubmit={onSubmit} />);

    helpCenterForm.handleSubmit({ preventDefault: noop });

    jasmine.clock().tick(0);

    expect(onSubmit)
      .toHaveBeenCalled();
  });
});
