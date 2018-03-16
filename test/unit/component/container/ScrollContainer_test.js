describe('ScrollContainer component', () => {
  let ScrollContainer;
  const containerPath = buildSrcPath('component/container/ScrollContainer');
  const windowHeight = 500;

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'React': React,
      './ScrollContainer.scss': {
        locals: {
          contentMobile: 'contentMobileClasses',
          footer: 'footerClasses',
          footerShadow: 'footerShadowClasses',
          content: 'contentClasses',
          contentBigheader: 'contentBigheaderClasses',
          userHeader: 'userHeaderClassesYo',
          container: 'containerClasses',
          containerDesktop: 'containerDesktopClasses'
        }
      },
      'utility/globals': {
        win: {
          innerHeight: windowHeight
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

  it('has "container" classes when fullscreen is true', () => {
    const container = shallowRender(<ScrollContainer fullscreen={true} />);

    expect(container.props.className)
      .toMatch('containerClasses');
  });

  it('has "containerDesktop" classes when fullscreen is false', () => {
    const container = shallowRender(<ScrollContainer />);

    expect(container.props.className)
      .toMatch('containerDesktopClasses');
  });

  describe('when headerContent is not null', () => {
    describe('when fullscreen is true', () => {
      it('should have `contentBigheader` classes', () => {
        const container = shallowRender(<ScrollContainer fullscreen={true} headerContent={<div />} />);

        expect(container.props.children[1].props.className)
          .toMatch('contentBigheaderClasses');
      });
    });

    describe('when fullscreen is false', () => {
      it('should not have `contentBigheader` classes', () => {
        const container = shallowRender(<ScrollContainer fullscreen={false} headerContent={<div />} />);

        expect(container.props.children[1].props.className)
          .not.toMatch('contentBigheaderClasses');
      });
    });

    it('has `userHeader` classes', () => {
      const container = shallowRender(<ScrollContainer headerContent={<div />} />);

      expect(container.props.children[0].props.className)
        .toMatch('userHeaderClassesYo');
    });
  });

  it('should set scrollTop to scrollHeight value when calling `this.scrollToBottom`', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

    scrollContainer.content.scrollHeight = 100;

    scrollContainer.scrollToBottom();

    expect(scrollContainer.content.scrollTop)
      .toEqual(100);
  });

  it('should change component state when calling `this.setScrollShadowVisible`', () => {
    const container = domRender(<ScrollContainer fullscreen={true} />);

    expect(container.state.scrollShadowVisible)
      .toEqual(false);

    container.setScrollShadowVisible(true);

    expect(container.state.scrollShadowVisible)
      .toEqual(true);
  });

  it('should have shadow class on footer if content is scrollable', () => {
    const container = domRender(<ScrollContainer footerContent='foo' fullscreen={true} />);

    container.setState({ scrollShadowVisible: true });

    expect(ReactDOM.findDOMNode(container).querySelector('.footerClasses').className)
      .toContain('footerShadowClasses');
  });

  describe('props', () => {
    let container;

    describe('containerClasses', () => {
      beforeEach(() => {
        container = domRender(<ScrollContainer footerContent='foo' containerClasses='baz' />);
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
        container = domRender(<ScrollContainer footerContent='foo' footerClasses='baz' />);
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

  describe('re-render', () => {
    let container,
      component,
      mockScrollTop;

    describe('when the component re-renders', () => {
      beforeEach(() => {
        mockScrollTop = 150;
        component = domRender(<ScrollContainer />);
        container = component.content;
        container.scrollTop = mockScrollTop;

        component.componentWillUpdate();
      });

      it('reinstates the old scrollTop value', () => {
        const newScrollTopValue = 1337;

        expect(container.scrollTop)
          .toEqual(mockScrollTop);

        component.scrollTop = newScrollTopValue;
        component.componentDidUpdate();

        expect(container.scrollTop)
          .toEqual(newScrollTopValue);
      });
    });
  });

  describe('renderFooter', () => {
    let result;

    describe('when the footerContent is an empty array', () => {
      beforeEach(() => {
        const scrollContainer = instanceRender(<ScrollContainer footerContent={[]} />);

        result = scrollContainer.renderFooter();
      });

      it('returns a footer element', () => {
        expect(result.type)
          .toEqual('footer');
      });
    });

    describe('when the footerContent is a null value', () => {
      beforeEach(() => {
        const scrollContainer = instanceRender(<ScrollContainer footerContent={[]} />);

        result = scrollContainer.renderFooter();
      });

      it('returns a footer element', () => {
        expect(result.type)
          .toEqual('footer');
      });
    });

    describe('when the footerContent is a valid node value', () => {
      beforeEach(() => {
        const scrollContainer = instanceRender(<ScrollContainer footerContent='bobby' />);

        result = scrollContainer.renderFooter();
      });

      it('returns a footer element', () => {
        expect(result.type)
          .toEqual('footer');
      });
    });
  });
});
