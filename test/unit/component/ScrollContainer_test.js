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

  it('should call `this.getContentContainer` when `this.scrollToBottom` is called', function() {

    var stub = spyOn(ScrollContainer.type.prototype.__reactAutoBindMap, 'getContentContainer')
                 .and.callThrough(),
        scrollContainer = React.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );

    scrollContainer.scrollToBottom();

    expect(stub)
      .toHaveBeenCalled();
  });

  it('should set scrollTop to scrollHeight value when calling `this.scrollToBottom`', function() {

    spyOn(ScrollContainer.type.prototype.__reactAutoBindMap, 'getContentContainer')
      .and.returnValue({scrollHeight: 100, scrollTop: 0});

    var scrollContainer = React.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );

    scrollContainer.scrollToBottom();

    expect(scrollContainer.getContentContainer().scrollTop)
      .toEqual(100);
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

