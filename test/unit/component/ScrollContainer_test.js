describe('ScrollContainer component', function() {
  let ScrollContainer,
      mockRegistry;
  const containerPath = buildSrcPath('component/ScrollContainer');

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

  it('should have the `is-mobile` className when fullscreen is true', function() {

    const container = React.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );
    const containerNode = ReactTestUtils
      .findRenderedDOMComponentWithClass(container, 'ScrollContainer-content');

    const containerClasses = containerNode.props.className;

    expect(containerClasses)
      .toMatch('is-mobile');
  });

  it('should call `this.getContentContainer` when `this.scrollToBottom` is called', function() {

    const stub = spyOn(ScrollContainer.type.prototype.__reactAutoBindMap, 'getContentContainer')
      .and.callThrough();
    const scrollContainer = React.render(
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

    const scrollContainer = React.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );

    scrollContainer.scrollToBottom();

    expect(scrollContainer.getContentContainer().scrollTop)
      .toEqual(100);
  });

  it('should change component state when calling `this.setScrollShadowVisible`', function() {

    const container = React.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );

    expect(container.state.scrollShadowVisible)
      .toEqual(false);

    container.setScrollShadowVisible(true);

    expect(container.state.scrollShadowVisible)
      .toEqual(true);

    expect(container.getDOMNode().querySelector('.ScrollContainer-footer').className)
      .toContain('ScrollContainer-footer--shadow');
  });

  it('should have shadow class on footer if content is scrollable', function() {

    const container = React.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );
    let containerNode;

    container.setState({scrollShadowVisible: true});

    containerNode = ReactTestUtils
      .findRenderedDOMComponentWithClass(container, 'ScrollContainer-footer'),

    expect(containerNode.props.className)
      .toMatch('ScrollContainer-footer--shadow');
  });

  it('should not contain certain classes when `this.state.footerPadding` is true', function() {
    // Should not contain
    // ScrollContainer-content - u-paddingTM
    // ScrollContainer-footer - u-paddingVM

    const container = React.render(
      <ScrollContainer footerPadding={true} />,
      global.document.body
    );

    expect(container.props.footerPadding)
      .toEqual(true);

    expect(container.getDOMNode().querySelector('.ScrollContainer-content').className)
      .toMatch('u-paddingTM');

    expect(container.getDOMNode().querySelector('.ScrollContainer-content').className)
      .not.toMatch('u-paddingTL');

    expect(container.getDOMNode().querySelector('.ScrollContainer-footer').className)
      .toMatch('u-paddingVM');
  });

  it('should not contain `u-paddingTL` when `this.state.footerPadding` is false', function() {
    // Should not contain
    // ScrollContainer-content - u-paddingTL

    const container = React.render(
      <ScrollContainer footerPadding={false} />,
      global.document.body
    );

    expect(container.props.footerPadding)
      .toEqual(false);

    expect(container.getDOMNode().querySelector('.ScrollContainer-content').className)
      .not.toMatch('u-paddingTM');

    expect(container.getDOMNode().querySelector('.ScrollContainer-content').className)
      .toMatch('u-paddingTL');

    expect(container.getDOMNode().querySelector('.ScrollContainer-footer').className)
      .not.toMatch('u-paddingVM');
  });

  it('should change component state when calling `this.setScrollFooterPadding`', function() {

    const container = React.render(
      <ScrollContainer />,
      global.document.body
    );

    expect(container.state.footerPadding)
      .toEqual(false);

    container.setScrollFooterPadding(true);

    expect(container.state.footerPadding)
      .toEqual(true);

    expect(container.getDOMNode().querySelector('.ScrollContainer-content').className)
      .toMatch('u-paddingTM');

    expect(container.getDOMNode().querySelector('.ScrollContainer-content').className)
      .not.toMatch('u-paddingTL');

    expect(container.getDOMNode().querySelector('.ScrollContainer-footer').className)
      .toMatch('u-paddingVM');
  });

});

