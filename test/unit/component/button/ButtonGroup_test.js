describe('ButtonGroup component', () => {
  let ButtonGroup;
  const buttonPath = buildSrcPath('component/button/ButtonGroup');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      './ButtonGroup.sass': {
        locals: {
          rtl: 'rtlClasses',
          ltr: 'ltrClasses'
        }
      }
    });

    mockery.registerAllowable(buttonPath);
    ButtonGroup = requireUncached(buttonPath).ButtonGroup;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should not have rtl classes when rtl prop is false', () => {
    const buttonGroup = shallowRender(<ButtonGroup />);

    expect(buttonGroup.props.className)
      .toMatch('ltrClasses');

    expect(buttonGroup.props.className)
      .not.toMatch('rtlClasses');
  });

  it('should have rtl classes when rtl prop is true', () => {
    const buttonGroup = shallowRender(<ButtonGroup rtl={true} />);

    expect(buttonGroup.props.className)
      .toMatch('rtlClasses');

    expect(buttonGroup.props.className)
      .not.toMatch('ltrClasses');
  });
});

