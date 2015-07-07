describe('ScrollContainer component', function() {
  var ScrollContainer,
      mockRegistry,
      containerPath = buildSrcPath('component/ScrollContainer');

  beforeEach(function() {

    resetDOM();

    mockery.enable({
      useCleanCache: true
    });

    mockRegistry = initMockRegistry({
      'react/addons': React,
    });

    mockery.registerAllowable(containerPath);

    ScrollContainer = require(containerPath).ScrollContainer;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the `is-mobile` classname when fullscreen is true', function() {

    var container = React.render(
          <ScrollContainer fullscreen={true} />,
          global.document.body
        ),
        containerNode = ReactTestUtils
          .findRenderedDOMComponentWithClass(container, 'ScrollContainer-content'),
        containerClasses;

    containerClasses = containerNode.props.className;

    expect(containerClasses)
      .toMatch('is-mobile');
  });

  it('should call `this.checkScrollOffset` on componentDidMount', function() {

    var stub = spyOn(ScrollContainer.type.prototype.__reactAutoBindMap, 'checkScrollOffset');

    React.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );

    expect(stub)
      .toHaveBeenCalled();
  });

  it('should call `this.checkScrollOffset` on componentDidUpdate', function() {

    var stub = spyOn(ScrollContainer.type.prototype.__reactAutoBindMap, 'checkScrollOffset'),
        container = React.render(
          <ScrollContainer fullscreen={true} />,
          global.document.body
        );

    expect(stub)
      .toHaveBeenCalled();

    container.setState({foo: true});

    expect(stub)
      .toHaveBeenCalled();

    expect(stub.calls.count())
      .toEqual(2);
  });

  it('should have shadow class on footer if content is scrollable', function() {

    var container = React.render(
          <ScrollContainer fullscreen={true} />,
          global.document.body
        ),
        containerNode;

    container.setState({scrollableContent: true});
    containerNode = ReactTestUtils
      .findRenderedDOMComponentWithClass(container, 'ScrollContainer-footer'),

    expect(containerNode.props.className)
      .toMatch('ScrollContainer-footer--shadow');
  });
});

