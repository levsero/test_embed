/** @jsx React.DOM */

describe('Container component', function() {
  var Container,
      mockRegistry,
      containerPath = buildSrcPath('component/Container');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
    });

    mockery.registerAllowable(containerPath);

    Container = require(containerPath).Container;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the `fullscreen` classnames when fullscreen is true', function() {

    var container = React.renderComponent(
          <Container fullscreen={true} />,
          global.document.body
        ),
        containerNode = ReactTestUtils
          .findRenderedDOMComponentWithClass(container, 'Container'),
        containerClasses;

    containerClasses = containerNode.props.className;

    expect(containerClasses)
      .toMatch('Container--fullscreen');

    expect(containerClasses)
      .not.toMatch('Container--popover');
  });

  it('should have the `popover` classnames when fullscreen is false', function() {

    var container = React.renderComponent(
          <Container />,
          global.document.body
        ),
        containerNode = ReactTestUtils
          .findRenderedDOMComponentWithClass(container, 'Container'),
        containerClasses;

    container.setState({fullscreen: false});

    containerClasses = containerNode.props.className;

    expect(containerClasses)
      .toMatch('Container--popover');

    expect(containerClasses)
      .not.toMatch('Container--fullscreen');
  });

});

