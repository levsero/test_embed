describe('ScrollContainer component', () => {
  let ScrollContainer,
    container,
    mockIsFullScreen,
    result,
    mockWindowHeight,
    mockIsMobile = false,
    TEST_IDS
  const containerPath = buildSrcPath('component/container/ScrollContainer')
  const MAX_WIDGET_HEIGHT = 550
  const MIN_WIDGET_HEIGHT = 150
  const WIDGET_MARGIN = 15
  const sharedConstantsPath = basePath('src/constants/shared')

  beforeEach(() => {
    mockery.enable()

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    initMockRegistry({
      React: React,
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
          desktopFullscreen: 'desktopFullscreen',
          flexContainer: 'flexContainer',
          desktop: 'desktop',
          mobile: 'mobile',
          title: 'title',
          titleMobile: 'titleMobile'
        }
      },
      'component/Refocus': noopReactComponent(),
      'components/Widget': {
        Header: noopReactComponent()
      },
      'src/constants/shared': {
        MAX_WIDGET_HEIGHT,
        MIN_WIDGET_HEIGHT,
        WIDGET_MARGIN,
        TEST_IDS
      },
      'utility/globals': {
        win: {
          innerHeight: mockWindowHeight
        }
      }
    })

    mockery.registerAllowable(containerPath)

    ScrollContainer = requireUncached(containerPath).ScrollContainer

    container = instanceRender(
      <ScrollContainer fullscreen={mockIsFullScreen} isMobile={mockIsMobile} />
    )
    result = container.render()
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  it('should have the `contentMobileClasses` classes when isMobile is true', () => {
    const container = shallowRender(<ScrollContainer isMobile={true} />)

    expect(container.props.children[1].props.className).toMatch('contentMobileClasses')
  })

  it('has "container" classes when isMobile is true', () => {
    const container = shallowRender(<ScrollContainer isMobile={true} />)

    expect(container.props.className).toMatch('containerClasses')
  })

  it('has "containerDesktop" classes when fullscreen is false', () => {
    mockIsFullScreen = false
    const container = shallowRender(<ScrollContainer fullscreen={mockIsFullScreen} />)

    expect(container.props.className).toMatch('containerDesktopClasses')
  })

  it('has "desktopFullscreen" classes when in popout mode', () => {
    mockIsFullScreen = true
    mockIsMobile = false
    const container = shallowRender(
      <ScrollContainer isMobile={mockIsMobile} fullscreen={mockIsFullScreen} />
    )

    expect(container.props.className).toMatch('desktopFullscreen')
  })

  it('renders flexContainer class', () => {
    expect(result.props.className).toContain('flexContainer')
  })

  it('renders content class', () => {
    expect(result.props.children[1].props.className).toContain('content')
  })

  describe('when on mobile', () => {
    beforeAll(() => {
      mockIsMobile = true
      mockIsFullScreen = true
    })

    it('renders mobile class', () => {
      expect(result.props.className).toContain('mobile')
    })

    it('does not render desktop class', () => {
      expect(result.props.className).not.toContain('desktop')
    })
  })

  describe('when not on mobile', () => {
    beforeAll(() => {
      mockIsMobile = false
    })

    it('does not render mobile class', () => {
      expect(result.props.className).not.toContain('mobile')
    })

    it('renders desktop class', () => {
      expect(result.props.className).toContain('desktop')
    })
  })

  it('should set scrollTop to scrollHeight value when calling `this.scrollToBottom`', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />)

    spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(100)

    scrollContainer.scrollToBottom()

    expect(scrollContainer.content.scrollTop).toEqual(100)
  })

  it('sets scrollTop to value when calling `this.scrollTo`', () => {
    const scrollContainer = domRender(<ScrollContainer fullscreen={true} />)

    spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(100)

    scrollContainer.scrollTo(80)

    expect(scrollContainer.content.scrollTop).toEqual(80)
  })

  describe('isAtTop', () => {
    it('returns true if scroll position is at the top', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />)

      scrollContainer.content.scrollTop = 0

      expect(scrollContainer.isAtTop()).toEqual(true)
    })

    it('returns false if scroll position is not at the top', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />)

      scrollContainer.content.scrollTop = 10

      expect(scrollContainer.isAtTop()).toEqual(false)
    })
  })

  describe('isAtBottom', () => {
    it('returns true if scroll position is at the bottom', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />)

      scrollContainer.content.scrollTop = 10
      spyOnProperty(scrollContainer.content, 'clientHeight').and.returnValue(20)
      spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(30)

      expect(scrollContainer.isAtBottom()).toEqual(true)
    })

    it('returns false if scroll position is not at the bottom', () => {
      const scrollContainer = domRender(<ScrollContainer fullscreen={true} />)

      scrollContainer.content.scrollTop = 10
      spyOnProperty(scrollContainer.content, 'clientHeight').and.returnValue(20)
      spyOnProperty(scrollContainer.content, 'scrollHeight').and.returnValue(40)

      expect(scrollContainer.isAtBottom()).toEqual(false)
    })
  })

  it('has shadow class on footer if content is scrollable', () => {
    const container = domRender(
      <ScrollContainer footerContent="foo" scrollShadowVisible={true} fullscreen={true} />
    )

    expect(ReactDOM.findDOMNode(container).querySelector('.footerClasses').className).toContain(
      'footerShadowClasses'
    )
  })

  describe('props', () => {
    let container

    describe('classes', () => {
      const className = 'scrollContainerClass'

      beforeEach(() => {
        container = domRender(<ScrollContainer classes={className} />)
      })

      it('should apply them to the top element', () => {
        expect(ReactDOM.findDOMNode(container).className).toContain(className)
      })
    })

    describe('containerClasses', () => {
      beforeEach(() => {
        container = domRender(<ScrollContainer footerContent="foo" containerClasses="baz" />)
      })

      it('should apply them to container', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.contentClasses').className).toMatch(
          'baz'
        )
      })

      it('should not apply them to the footer', () => {
        expect(
          ReactDOM.findDOMNode(container).querySelector('.footerClasses').className
        ).not.toMatch('baz')
      })
    })

    describe('footerClasses', () => {
      beforeEach(() => {
        container = domRender(<ScrollContainer footerContent="foo" footerClasses="baz" />)
      })

      it('should apply them to footer', () => {
        expect(ReactDOM.findDOMNode(container).querySelector('.footerClasses').className).toMatch(
          'baz'
        )
      })

      it('should not apply them to the container', () => {
        expect(
          ReactDOM.findDOMNode(container).querySelector('.contentClasses').className
        ).not.toMatch('baz')
      })
    })
  })

  describe('re-render', () => {
    let container, component, mockScrollTop

    describe('when the component re-renders', () => {
      beforeEach(() => {
        mockScrollTop = 150
        component = domRender(<ScrollContainer />)
        container = component.content
        container.scrollTop = mockScrollTop

        component.componentWillUpdate()
      })

      it('reinstates the old scrollTop value', () => {
        const newScrollTopValue = 1337

        expect(container.scrollTop).toEqual(mockScrollTop)

        component.scrollTop = newScrollTopValue
        component.componentDidUpdate()

        expect(container.scrollTop).toEqual(newScrollTopValue)
      })
    })
  })

  describe('renderFooter', () => {
    let result

    describe('when the footerContent is an empty array', () => {
      beforeEach(() => {
        const scrollContainer = instanceRender(<ScrollContainer footerContent={[]} />)

        result = scrollContainer.renderFooter()
      })

      it('returns a footer element', () => {
        expect(result.type).toEqual('footer')
      })
    })

    describe('when the footerContent is a null value', () => {
      beforeEach(() => {
        const scrollContainer = instanceRender(<ScrollContainer footerContent={[]} />)

        result = scrollContainer.renderFooter()
      })

      it('returns a footer element', () => {
        expect(result.type).toEqual('footer')
      })
    })

    describe('when the footerContent is a valid node value', () => {
      beforeEach(() => {
        const scrollContainer = instanceRender(<ScrollContainer footerContent="bobby" />)

        result = scrollContainer.renderFooter()
      })

      it('returns a footer element', () => {
        expect(result.type).toEqual('footer')
      })
    })
  })

  describe('onContentScrolled', () => {
    const onContentScrolledSpy = jasmine.createSpy()
    let component

    beforeEach(() => {
      component = domRender(<ScrollContainer onContentScrolled={onContentScrolledSpy} />)
    })

    it('is called when content element is scrolled', () => {
      TestUtils.Simulate.scroll(component.content)

      expect(onContentScrolledSpy).toHaveBeenCalled()
    })
  })

  describe('getScrollBottom', () => {
    let result, mockScrollHeight, mockScrollTop, mockOffsetHeight

    beforeEach(() => {
      const component = instanceRender(<ScrollContainer />)

      mockScrollHeight = 100
      mockScrollTop = 50
      mockOffsetHeight = 20

      component.content = {
        scrollHeight: mockScrollHeight,
        scrollTop: mockScrollTop,
        offsetHeight: mockOffsetHeight
      }

      result = component.getScrollBottom()
    })

    it('returns the expected value', () => {
      const expected = mockScrollHeight - (mockScrollTop + mockOffsetHeight)

      expect(expected).toEqual(result)
    })
  })

  describe('calculateHeight', () => {
    let component

    describe('when on mobile', () => {
      beforeEach(() => {
        component = instanceRender(<ScrollContainer isMobile={true} />)
      })

      it('returns null', () => {
        expect(component.calculateHeight()).toEqual(null)
      })
    })

    describe('when on desktop', () => {
      beforeEach(() => {
        component = instanceRender(<ScrollContainer />)
      })

      describe('when the window height is above the max height', () => {
        beforeAll(() => {
          mockWindowHeight = 600
        })

        it('returns the max height', () => {
          expect(component.calculateHeight()).toEqual(MAX_WIDGET_HEIGHT)
        })
      })

      describe('when the window height is below the max height and above the min height', () => {
        beforeAll(() => {
          mockWindowHeight = 400
        })

        it('returns the value minus the widget margins', () => {
          expect(component.calculateHeight()).toEqual(400 - WIDGET_MARGIN * 2)
        })
      })

      describe('when the window height is below the min height', () => {
        beforeAll(() => {
          mockWindowHeight = 100
        })

        it('returns the min widget value minus the widget margins', () => {
          expect(component.calculateHeight()).toEqual(MIN_WIDGET_HEIGHT - WIDGET_MARGIN * 2)
        })
      })

      describe('when is fullscreen (popout)', () => {
        beforeEach(() => {
          component = instanceRender(<ScrollContainer fullscreen={true} />)
        })

        it('returns null', () => {
          expect(component.calculateHeight()).toEqual(null)
        })
      })
    })
  })
})
