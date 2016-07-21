describe('IconFieldButton component', function() {
  let IconFieldButton;

  const iconFieldButtonPath = buildSrcPath('component/button/IconFieldButton');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      }
    });

    mockery.registerAllowable(iconFieldButtonPath);

    IconFieldButton = requireUncached(iconFieldButtonPath).IconFieldButton;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should display the correct classes when not fullscreen', function() {
    const button = shallowRender(<IconFieldButton fullscreen={false} />);

    expect(button.props.className)
      .toMatch('Button--fieldDesktop');

    expect(button.props.className)
      .not.toMatch('Button--fieldMobile');
  });

  it('should display the correct classes when fullscreen', function() {
    const button = shallowRender(<IconFieldButton fullscreen={true} />);

    expect(button.props.className)
      .toMatch('Button--fieldMobile');

    expect(button.props.className)
      .not.toMatch('Button--fieldDesktop');
  });
});
