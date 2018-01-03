describe('Container component', () => {
  let Container;
  const containerPath = buildSrcPath('component/container/Container');

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      './Container.scss': {
        locals: {
          'desktop': 'desktopClasses',
          'mobile': 'mobileClasses',
          'card': 'cardClasses'
        }
      }
    });

    mockery.registerAllowable(containerPath);

    Container = requireUncached(containerPath).Container;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('has mobileClasses when props.fullscreen is true', () => {
    const container = shallowRender(<Container fullscreen={true} />);

    expect(container.props.className)
      .toMatch('mobileClasses');

    expect(container.props.className)
      .not.toMatch('desktopClasses');
  });

  it('has desktopClasses when props.fullscreen is false', () => {
    const container = shallowRender(<Container />);

    expect(container.props.className)
      .toMatch('desktopClasses');

    expect(container.props.className)
      .not.toMatch('mobileClasses');
  });

  it('has cardClasses when props.card is true', () => {
    const container = shallowRender(<Container card={true} />);

    expect(container.props.className)
      .toMatch('cardClasses');
  });

  it('does not have cardClasses when props.card is false', () => {
    const container = shallowRender(<Container />);

    expect(container.props.className)
      .not.toMatch('cardClasses');
  });
});
