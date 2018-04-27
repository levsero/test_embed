describe('ScrollContainer component', () => {
  let ScrollContainer;
  const containerPath = buildSrcPath('component/container/ScrollContainer');

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
      'utility/devices': {
        isMobileBrowser: () => {}
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

  it('sets scrollTop to value when calling `this.scrollTo`', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

    scrollContainer.content.scrollHeight = 100;

    scrollContainer.scrollTo(80);

    expect(scrollContainer.content.scrollTop)
      .toEqual(80);
  });

  describe('isAtTop', () => {
    it('returns true if scroll position is at the top', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

      scrollContainer.content.scrollTop = 0;

      expect(scrollContainer.isAtTop())
        .toEqual(true);
    });

    it('returns false if scroll position is not at the top', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

      scrollContainer.content.scrollTop = 10;

      expect(scrollContainer.isAtTop())
        .toEqual(false);
    });
  });

  describe('isAtBottom', () => {
    it('returns true if scroll position is at the bottom', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

      scrollContainer.content.scrollTop = 10;
      scrollContainer.content.clientHeight = 20;

      scrollContainer.content.scrollHeight = 30;

      expect(scrollContainer.isAtBottom())
        .toEqual(true);
    });

    it('returns false if scroll position is not at the bottom', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

      scrollContainer.content.scrollTop = 10;
      scrollContainer.content.clientHeight = 20;

      scrollContainer.content.scrollHeight = 40;

      expect(scrollContainer.isAtBottom())
        .toEqual(false);
    });
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

    describe('classes', () => {
      const className = 'scrollContainerClass';

      beforeEach(() => {
        container = domRender(<ScrollContainer classes={className} />);
      });

      it('should apply them to the top element', () => {
        expect(ReactDOM.findDOMNode(container).className)
          .toContain(className);
      });
    });

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

  describe('onContentScrolled', () => {
    const onContentScrolledSpy = jasmine.createSpy();
    let component;

    beforeEach(() => {
      component = domRender(<ScrollContainer onContentScrolled={onContentScrolledSpy} />);
    });

    it('is called when content element is scrolled', () => {
      TestUtils.Simulate.scroll(component.content);

      expect(onContentScrolledSpy)
        .toHaveBeenCalled();
    });
  });
});
