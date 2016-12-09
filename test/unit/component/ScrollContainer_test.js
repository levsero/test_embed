describe('ScrollContainer component', () => {
  let ScrollContainer;
  const containerPath = buildSrcPath('component/ScrollContainer');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React
    });

    mockery.registerAllowable(containerPath);

    ScrollContainer = requireUncached(containerPath).ScrollContainer;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the `is-mobile` className when fullscreen is true', () => {
    const container = shallowRender(<ScrollContainer fullscreen={true} />);

    expect(container.props.children[1].props.className)
      .toMatch('is-mobile');
  });

  it('should call `this.getContentContainer` when `this.scrollToBottom` is called', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);
    const spy = spyOn(scrollContainer, 'getContentContainer').and.callThrough();

    scrollContainer.scrollToBottom();

    expect(spy)
      .toHaveBeenCalled();
  });

  it('should set scrollTop to scrollHeight value when calling `this.scrollToBottom`', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

    spyOn(scrollContainer, 'getContentContainer')
      .and.returnValue({scrollHeight: 100, scrollTop: 0});

    scrollContainer.scrollToBottom();

    expect(scrollContainer.getContentContainer().scrollTop)
      .toEqual(100);
  });

  it('should change component state when calling `this.setScrollShadowVisible`', () => {
    const container = instanceRender(<ScrollContainer fullscreen={true} />);

    expect(container.state.scrollShadowVisible)
      .toEqual(false);

    container.setScrollShadowVisible(true);

    expect(container.state.scrollShadowVisible)
      .toEqual(true);
  });

  it('should have shadow class on footer if content is scrollable', () => {
    const container = domRender(<ScrollContainer fullscreen={true} />);

    container.setState({scrollShadowVisible: true});

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
      .toContain('ScrollContainer-footer--shadow');
  });

  it('should not contain certain classes when `this.props.hideZendeskLogo` is true', () => {
    // Should not contain
    // ScrollContainer-content - u-paddingTM
    // ScrollContainer-footer - u-paddingVM

    const container = domRender(<ScrollContainer hideZendeskLogo={true} />);

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .not.toMatch('u-paddingTM');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .toMatch('u-paddingTL');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
      .not.toMatch('u-paddingVM');
  });

  it('should contain expanded classes when `contentExpanded` prop is true', () => {
    const container = domRender(<ScrollContainer contentExpanded={true} />);

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .toContain('ScrollContainer--expanded');
  });

  it('should not contain `u-paddingTL` when `this.props.hideZendeskLogo` is false', () => {
    // Should not contain
    // ScrollContainer-content - u-paddingTL

    const container = domRender(<ScrollContainer hideZendeskLogo={false} />);

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .toMatch('u-paddingTM');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
      .not.toMatch('u-paddingTL');

    expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
      .toMatch('u-paddingVM');
  });

  describe('when this.props.footerContentHidden is true', () => {
    it('should contain `u-paddingVL` on the footer', () => {
      const container = domRender(<ScrollContainer footerContentHidden={true} />);

      expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
        .toMatch('u-paddingVL');
    });

    it('should contain `u-marginVS` on the footer', () => {
      const container = domRender(<ScrollContainer footerContentHidden={true} />);

      expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
        .toMatch('u-marginVS');
    });
  });

  describe('props', () => {
    let container;

    describe('containerClasses', () => {
      beforeEach(() => {
        container = domRender(<ScrollContainer containerClasses='baz' />);
      });

      it('should apply them to container', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
          .toMatch('baz');
      });

      it('should not apply them to the footer', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
          .not.toMatch('baz');
      });
    });

    describe('footerClasses', () => {
      beforeEach(() => {
        container = domRender(<ScrollContainer footerClasses='baz' />);
      });

      it('should apply them to footer', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-footer').className)
          .toMatch('baz');
      });

      it('should not apply them to the container', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.ScrollContainer-content').className)
          .not.toMatch('baz');
      });
    });
  });
});

