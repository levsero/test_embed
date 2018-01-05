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
          userHeader: 'userHeaderClassesYo'
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

    describe('when newDesign is true', () => {
      it('has `userHeader` classes', () => {
        const container = shallowRender(<ScrollContainer newDesign={true} headerContent={<div />} />);

        expect(container.props.children[0].props.className)
          .toMatch('userHeaderClassesYo');
      });
    });

    describe('when newDesign is false', () => {
      it('does not have `userHeader` classes', () => {
        const container = shallowRender(<ScrollContainer newDesign={false} headerContent={<div />} />);

        expect(container.props.children[0].props.className)
          .not.toMatch('userHeaderClassesYo');
      });
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
    const container = domRender(<ScrollContainer fullscreen={true} />);

    container.setState({ scrollShadowVisible: true });

    expect(ReactDOM.findDOMNode(container).querySelector('.footerClasses').className)
      .toContain('footerShadowClasses');
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

  describe('setHeight', () => {
    let component, offsetHeight;
    const headerHeight = 50;
    const footerHeight = 30;
    const frameHeight = 200;

    describe('when props.newDesign is true', () => {
      beforeEach(() => {
        const mockGetFrameDimensions = () => { return { height: frameHeight };};

        component = domRender(<ScrollContainer newDesign={true} getFrameDimensions={mockGetFrameDimensions} />);
        component.header.clientHeight = headerHeight;
        component.footer.clientHeight = footerHeight;

        // 17 is 15 for the frame margin and 2 for the frame border
        offsetHeight = headerHeight + footerHeight + 17;

        component.setHeight();
      });

      it('sets the maxHeight to 90% of the window height minus the offset height', () => {
        const maxHeight = windowHeight*0.9 - offsetHeight;

        expect(component.content.style.maxHeight)
          .toEqual(`${maxHeight}px`);
      });

      it('sets the minHeight to the frameHeight minus the offset height', () => {
        const minHeight = frameHeight - offsetHeight;

        expect(component.content.style.minHeight)
          .toEqual(`${minHeight}px`);
      });
    });

    describe('when props.newDesign is false', () => {
      beforeEach(() => {
        component = domRender(<ScrollContainer newDesign={false} />);

        component.setHeight();
      });

      it('does not set the maxHeight', () => {
        expect(component.content.style.maxHeight)
          .toBeFalsy();
      });

      it('does not set the minHeight', () => {
        expect(component.content.style.minHeight)
          .toBeFalsy();
      });
    });
  });
});

