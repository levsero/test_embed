describe('Container component', () => {
  let Container;
  const containerPath = buildSrcPath('component/Container');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React
    });

    mockery.registerAllowable(containerPath);

    Container = requireUncached(containerPath).Container;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the `fullscreen` classnames when fullscreen is true', () => {
    const container = shallowRender(<Container fullscreen={true} />);

    expect(container.props.className)
      .toMatch('Container--fullscreen');

    expect(container.props.className)
      .not.toMatch('Container--popover');
  });

  it('should have the `popover` classnames when fullscreen is false', () => {
    const container = shallowRender(<Container />);

    expect(container.props.className)
      .toMatch('Container--popover');

    expect(container.props.className)
      .not.toMatch('Container--fullscreen');
  });

  it('should have the `expanded` classnames when expanded is true', () => {
    const container = shallowRender(<Container expanded={true} />);

    expect(container.props.className)
      .toMatch('Container--expanded');
  });
});
