describe('ButtonIcon', () => {
  let ButtonIcon,
    mockIsIeValue;
  const buttonIconPath = buildSrcPath('component/button/ButtonIcon');

  beforeEach(() => {
    resetDOM();

    mockIsIeValue = false;

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: NoopReactComponent()
      },
      'utility/devices': {
        isIE: () => mockIsIeValue
      }
    });

    mockery.registerAllowable(buttonIconPath);

    ButtonIcon = requireUncached(buttonIconPath).ButtonIcon;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have IE classes when isIE is false', () => {
    const button = shallowRender(<ButtonIcon />);

    expect(button.props.className)
      .toMatch('u-flex');
    expect(button.props.className)
      .not.toMatch('u-paddingBXL');
  });

  it('should have IE classes when isIE is true', () => {
    mockIsIeValue = true;

    const button = shallowRender(<ButtonIcon />);

    expect(button.props.className)
      .not.toMatch('u-flex');
    expect(button.props.className)
      .toMatch('u-paddingBXL');
  });
});
