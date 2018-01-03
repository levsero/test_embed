describe('ButtonGroup component', () => {
  let ButtonGroup;
  const buttonPath = buildSrcPath('component/button/ButtonGroup');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      './ButtonGroup.scss': {
        locals: {
          buttonLeft: 'left',
          buttonRight: 'right'
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
      .toMatch('right');

    expect(buttonGroup.props.className)
      .not.toMatch('left');
  });

  it('should have rtl classes when rtl prop is true', () => {
    const buttonGroup = shallowRender(<ButtonGroup rtl={true} />);

    expect(buttonGroup.props.className)
      .toMatch('left');

    expect(buttonGroup.props.className)
      .not.toMatch('right');
  });
});
