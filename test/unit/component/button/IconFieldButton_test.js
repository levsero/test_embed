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
      './IconFieldButton.sass': {
        locals: {
          focused: 'isFocused',
          notFocused: 'notFocused',
          hovering: 'hovering',
          fullscreen: 'fullscreen'
        }
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
      .toMatch('notFocused');

    expect(button.props.className)
      .not.toMatch('fullscreen');
  });

  it('should display the correct classes when fullscreen', () => {
    const button = shallowRender(<IconFieldButton fullscreen={true} />);

    expect(button.props.className)
      .toMatch('fullscreen');

    expect(button.props.className)
      .not.toMatch('notFocused');
  });

  it('should display the correct classes when focus is true', () => {
    const button = shallowRender(<IconFieldButton focused={true} />);

    expect(button.props.className)
      .toMatch('isFocused');

    expect(button.props.className)
      .not.toMatch('notFocused');
  });

  it('should display the correct classes on mouse enter and leave', () => {
    const button = domRender(<IconFieldButton />);

    button.handleMouseEnter();

    expect(() => TestUtils.findRenderedDOMComponentWithClass(button, 'hovering'))
      .toBeTruthy();

    button.handleMouseLeave();

    expect(() => TestUtils.findRenderedDOMComponentWithClass(button, 'hovering'))
      .toThrow();
  });
});
