describe('ScrollContainer component', function() {
  let ScrollContainer;
  const containerPath = buildSrcPath('component/ScrollContainer');

  beforeEach(function() {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React
    });

    mockery.registerAllowable(containerPath);

    ScrollContainer = requireUncached(containerPath).ScrollContainer;
  });

  afterEach(function() {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the `is-mobile` className when fullscreen is true', function() {
    const container = shallowRender(<ScrollContainer fullscreen={true} />);

    expect(container.props.children[1].props.className)
      .toMatch('is-mobile');
  });

  it('should call `this.getContentContainer` when `this.scrollToBottom` is called', function() {
    const scrollContainer = ReactDOM.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );
    const spy = spyOn(scrollContainer, 'getContentContainer').and.callThrough();

    scrollContainer.scrollToBottom();

    expect(spy)
      .toHaveBeenCalled();
  });

  it('should set scrollTop to scrollHeight value when calling `this.scrollToBottom`', function() {
    const scrollContainer = ReactDOM.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );

    spyOn(scrollContainer, 'getContentContainer')
      .and.returnValue({scrollHeight: 100, scrollTop: 0});

    scrollContainer.scrollToBottom();

    expect(scrollContainer.getContentContainer().scrollTop)
      .toEqual(100);
  });

  it('should change component state when calling `this.setScrollShadowVisible`', function() {
    const container = instanceRender(<ScrollContainer fullscreen={true} />);

    expect(container.state.scrollShadowVisible)
      .toEqual(false);

    container.setScrollShadowVisible(true);

    expect(container.state.scrollShadowVisible)
      .toEqual(true);
  });

  it('should have shadow class on footer if content is scrollable', function() {
    const container = ReactDOM.render(
      <ScrollContainer fullscreen={true} />,
      global.document.body
    );

    container.setState({scrollShadowVisible: true});

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
      .toContain('ScrollContainer-footer--shadow');
  });

  it('should not contain certain classes when `this.props.hideZendeskLogo` is true', function() {
    // Should not contain
    // ScrollContainer-content - u-paddingTM
    // ScrollContainer-footer - u-paddingVM

    const container = React.render(
      <ScrollContainer hideZendeskLogo={true} />,
      global.document.body
    );

    expect(container.props.hideZendeskLogo)
      .toEqual(true);

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .not.toMatch('u-paddingTM');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .toMatch('u-paddingTL');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
      .not.toMatch('u-paddingVM');
  });

  it('should not contain `u-paddingTL` when `this.props.hideZendeskLogo` is false', function() {
    // Should not contain
    // ScrollContainer-content - u-paddingTL

    const container = React.render(
      <ScrollContainer hideZendeskLogo={false} />,
      global.document.body
    );

    expect(container.props.hideZendeskLogo)
      .toEqual(false);

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .toMatch('u-paddingTM');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .not.toMatch('u-paddingTL');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
      .toMatch('u-paddingVM');
  });
});

