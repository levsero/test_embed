describe('Container component', function() {
  let Container;
  const containerPath = buildSrcPath('component/Container');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    initMockRegistry({
      'React': React
    });

    mockery.registerAllowable(containerPath);

    Container = require(containerPath).Container;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the `fullscreen` classnames when fullscreen is true', function() {

    const container = React.render(
      <Container fullscreen={true} />,
      global.document.body
    );
    const containerNode = ReactTestUtils
      .findRenderedDOMComponentWithClass(container, 'Container');

    const containerClasses = containerNode.props.className;

    expect(containerClasses)
      .toMatch('Container--fullscreen');

    expect(containerClasses)
      .not.toMatch('Container--popover');
  });

  it('should have the `popover` classnames when fullscreen is false', function() {

    const container = React.render(
      <Container />,
      global.document.body
    );
    const containerNode = ReactTestUtils
      .findRenderedDOMComponentWithClass(container, 'Container');

    container.setState({ fullscreen: false });

    const containerClasses = containerNode.props.className;

    expect(containerClasses)
      .toMatch('Container--popover');

    expect(containerClasses)
      .not.toMatch('Container--fullscreen');
  });

});

