describe('IconFieldButton component', () => {
  let IconFieldButton;

  const iconFieldButtonPath = buildSrcPath('component/button/IconFieldButton');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      'component/Icon': {
        Icon: noopReactComponent()
      },
      'utility/utils': {
        bindMethods: mockBindMethods
      }
    });

    mockery.registerAllowable(iconFieldButtonPath);

    IconFieldButton = requireUncached(iconFieldButtonPath).IconFieldButton;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should display the correct classes when not fullscreen', () => {
    const button = shallowRender(<IconFieldButton fullscreen={false} />);

    expect(button.props.className)
      .toMatch('u-fillGainsboro');

    expect(button.props.className)
      .not.toMatch('Button--fieldMobile');
  });

  it('should display the correct classes when fullscreen', () => {
    const button = shallowRender(<IconFieldButton fullscreen={true} />);

    expect(button.props.className)
      .toMatch('Button--fieldMobile');

    expect(button.props.className)
      .not.toMatch('u-fillGainsboro');
  });

  it('should display the correct classes when focus is true', () => {
    const button = shallowRender(<IconFieldButton focused={true} />);

    expect(button.props.className)
      .toMatch('u-fillAluminum');

    expect(button.props.className)
      .not.toMatch('u-fillGainsboro');
  });

  it('should display the correct classes on mouse enter and leave', () => {
    const button = domRender(<IconFieldButton />);

    button.handleMouseEnter();

    expect(() => TestUtils.findRenderedDOMComponentWithClass(button, 'u-userFillColor'))
      .toBeTruthy();

    button.handleMouseLeave();

    expect(() => TestUtils.findRenderedDOMComponentWithClass(button, 'u-userFillColor'))
      .toThrow();
  });
});
