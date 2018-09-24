describe('ScrollContainer component', () => {
  let ScrollContainer,
    container,
    mockIsFullScreen,
    result,
    mockWindowHeight,
    mockIsMobile = false;
  const containerPath = buildSrcPath('component/container/ScrollContainer');
  const MAX_WIDGET_HEIGHT = 550;
  const MIN_WIDGET_HEIGHT = 150;
  const WIDGET_MARGIN = 15;

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
          containerDesktop: 'containerDesktopClasses',
          flexContainer: 'flexContainer',
          desktop: 'desktop',
          mobile: 'mobile',
          title: 'title',
          titleMobile: 'titleMobile'
        }
      },
      'component/Refocus': noopReactComponent(),
      'constants/shared': {
        MAX_WIDGET_HEIGHT,
        MIN_WIDGET_HEIGHT,
        WIDGET_MARGIN
      },
      'utility/devices': {
        isMobileBrowser: () => mockIsMobile
      },
      'utility/globals': {
        win: {
          innerHeight: mockWindowHeight
        }
      }
    });

    mockery.registerAllowable(containerPath);

    ScrollContainer = requireUncached(containerPath).ScrollContainer;

    container = instanceRender(<ScrollContainer fullscreen={mockIsFullScreen} />);
    result = container.render();
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

  it('renders flexContainer class', () => {
    expect(result.props.className)
      .toContain('flexContainer');
  });

  it('renders content class', () => {
    expect(result.props.children[1].props.className)
      .toContain('content');
  });

  describe('when on mobile', () => {
    beforeAll(() => {
      mockIsFullScreen = true;
    });

    it('renders mobile class', () => {
      expect(result.props.className)
        .toContain('mobile');
    });

    it('does not render desktop class', () => {
      expect(result.props.className)
        .not
        .toContain('desktop');
    });
  });

  describe('when not on mobile', () => {
    beforeAll(() => {
      mockIsFullScreen = false;
    });

    it('does not render mobile class', () => {
      expect(result.props.className)
        .not
        .toContain('mobile');
    });

    it('renders desktop class', () => {
      expect(result.props.className)
        .toContain('desktop');
    });
  });

  describe('titleClasses', () => {
    let container,
      mockIsFullScreen,
      mockTitleClasses,
      result;

    beforeEach(() => {
      container = instanceRender(<ScrollContainer titleClasses={mockTitleClasses} fullscreen={mockIsFullScreen} />);
      result = container.render().props.children[0].props.children[0].props.className;
    });

    it('includes title in titleClasses', () => {
      expect(result)
        .toContain('title');
    });

    describe('when title props are provided', () => {
      beforeAll(() => {
        mockTitleClasses = 'yolo';
      });

      it('includes titleMobile in titleClasses', () => {
        expect(result)
          .toContain('yolo');
      });
    });

    describe('when title props are not provided', () => {
      beforeAll(() => {
        mockTitleClasses = '';
      });

      it('includes titleMobile in titleClasses', () => {
        expect(result)
          .not
          .toContain('yolo');
      });
    });

    describe('when fullscreen is true', () => {
      beforeAll(() => {
        mockIsFullScreen = true;
      });

      it('includes titleMobile in titleClasses', () => {
        expect(result)
          .toContain('titleMobile');
      });
    });

    describe('when fullscreen is false', () => {
      beforeAll(() => {
        mockIsFullScreen = false;
      });

      it('does not include titleMobile in titleClasses', () => {
        expect(result)
          .not
          .toContain('titleMobile');
      });
    });
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

    spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(100);

    scrollContainer.scrollToBottom();

    expect(scrollContainer.content.scrollTop)
      .toEqual(100);
  });

  it('sets scrollTop to value when calling `this.scrollTo`', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

    spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(100);

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
      spyOnProperty(scrollContainer.content, 'clientHeight').and.returnValue(20);
      spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(30);

      expect(scrollContainer.isAtBottom())
        .toEqual(true);
    });

    it('returns false if scroll position is not at the bottom', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />);

      scrollContainer.content.scrollTop = 10;
      spyOnProperty(scrollContainer.content, 'clientHeight').and.returnValue(20);
      spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(40);

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

  describe('getScrollBottom', () => {
    let result,
      mockScrollHeight,
      mockScrollTop,
      mockOffsetHeight;

    beforeEach(() => {
      const component = instanceRender(<ScrollContainer />);

      mockScrollHeight = 100;
      mockScrollTop = 50;
      mockOffsetHeight = 20;

      component.content = {
        scrollHeight: mockScrollHeight,
        scrollTop: mockScrollTop,
        offsetHeight: mockOffsetHeight
      };

      result = component.getScrollBottom();
    });

    it('returns the expected value', () => {
      const expected = mockScrollHeight - (mockScrollTop + mockOffsetHeight);

      expect(expected)
        .toEqual(result);
    });
  });

  describe('calculateHeight', () => {
    let component;

    describe('when on mobile', () => {
      beforeEach(() => {
        component = instanceRender(<ScrollContainer fullscreen={true} />);
      });

      it('returns null', () => {
        expect(component.calculateHeight())
          .toEqual(null);
      });
    });

    describe('when on desktop', () => {
      beforeEach(() => {
        component = instanceRender(<ScrollContainer />);
      });

      describe('when the window height is above the max height', () => {
        beforeAll(() => {
          mockWindowHeight = 600;
        });

        it('returns the max height', () => {
          expect(component.calculateHeight())
            .toEqual(MAX_WIDGET_HEIGHT);
        });
      });

      describe('when the window height is below the max height and above the min height', () => {
        beforeAll(() => {
          mockWindowHeight = 400;
        });

        it('returns the value minus the widget margins', () => {
          expect(component.calculateHeight())
            .toEqual(400 - WIDGET_MARGIN*2);
        });
      });

      describe('when the window height is below the min height', () => {
        beforeAll(() => {
          mockWindowHeight = 100;
        });

        it('returns the min widget value minus the widget margins', () => {
          expect(component.calculateHeight())
            .toEqual(MIN_WIDGET_HEIGHT - WIDGET_MARGIN*2);
        });
      });
    });
  });
});
