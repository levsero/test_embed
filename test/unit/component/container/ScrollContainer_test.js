describe('ScrollContainer component', () => {
  let ScrollContainer;
  const containerPath = buildSrcPath('component/container/ScrollContainer');

  beforeEach(() => {
    resetDOM();

    mockery.enable();

    initMockRegistry({
      'React': React,
      './ScrollContainer.sass': {
        locals: {
          contentMobile: 'contentMobileClasses',
          footer: 'footerClasses',
          footerShadow: 'footerShadowClasses',
          content: 'contentClasses',
          expanded: 'expandedClasses'
        }
      }
    });

    mockery.registerAllowable(containerPath);

    ScrollContainer = requireUncached(containerPath).ScrollContainer;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  it('should have the `contentMobileClasses` classes when fullscreen is true', () => {
    const container = shallowRender(<ScrollContainer fullscreen={true} />);

    expect(container.props.children[1].props.className)
      .toMatch('contentMobileClasses');
  });

  it('should set scrollTop to scrollHeight value when calling `this.scrollToBottom`', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

    spyOn(scrollContainer, 'getContentContainer')
      .and.returnValue({ scrollHeight: 100, scrollTop: 0 });

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

    container.setState({ scrollShadowVisible: true });

    expect(ReactDOM.findDOMNode(container).querySelector('.footerClasses').className)
      .toContain('footerShadowClasses');
  });

  it('should contain expanded classes when `contentExpanded` prop is true', () => {
    const container = domRender(<ScrollContainer contentExpanded={true} />);

    expect(ReactDOM.findDOMNode(container).querySelector('.contentClasses').className)
      .toContain('expandedClasses');
  });

  describe('props', () => {
    let container;

    describe('containerClasses', () => {
      beforeEach(() => {
        container = domRender(<ScrollContainer containerClasses='baz' />);
      });

      it('should apply them to container', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.contentClasses').className)
          .toMatch('baz');
      });

      it('should not apply them to the footer', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.footerClasses').className)
          .not.toMatch('baz');
      });
    });

    describe('footerClasses', () => {
      beforeEach(() => {
        container = domRender(<ScrollContainer footerClasses='baz' />);
      });

      it('should apply them to footer', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.footerClasses').className)
          .toMatch('baz');
      });

      it('should not apply them to the container', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.contentClasses').className)
          .not.toMatch('baz');
      });
    });
  });
});

