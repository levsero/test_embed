describe('SearchField component', () => {
  let SearchField
  const searchFieldPath = buildSrcPath('component/field/SearchField')
  const LoadingEllipses = class extends Component {
    render() {
      return <div className={`ellipses ${this.props.className}`} />
    }
  }
  const Icon = noopReactComponent()
  const IconFieldButton = noopReactComponent()

  beforeEach(() => {
    mockery.enable({
      warnOnReplace: false
    })

    initMockRegistry({
      React: React,
      './SearchField.scss': {
        locals: {
          hovering: 'hovering',
          mobileContainer: 'mobileContainer',
          desktopContainer: 'desktopContainer',
          mobileSearchInput: 'mobileSearchInput',
          notSearched: 'notSearchedClasses',
          notSearchedWithLogo: 'notSearchedWithLogoClasses',
          hasSearched: 'hasSearchedClasses'
        }
      },
      'component/button/IconFieldButton': {
        IconFieldButton
      },
      'component/loading/LoadingEllipses': {
        LoadingEllipses
      },
      'component/Icon': {
        Icon
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      '@zendeskgarden/react-textfields': {
        Input: noopReactComponent(),
        FauxInput: noopReactComponent(),
        MediaFigure: noopReactComponent(),
        Label: noopReactComponent()
      }
    })

    mockery.registerAllowable(searchFieldPath)

    SearchField = requireUncached(searchFieldPath).SearchField
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('renderMobileLoadingOrClearIcon', () => {
    let result, component, mockIsLoading, mockSearchInputVal

    beforeEach(() => {
      component = domRender(<SearchField value={mockSearchInputVal} isLoading={mockIsLoading} />)
      result = component.renderMobileLoadingOrClearIcon()
    })

    describe('when search is loading', () => {
      beforeAll(() => {
        mockIsLoading = true
      })

      it('renders LoadingEllipses child component', () => {
        expect(TestUtils.isElementOfType(result.props.children, LoadingEllipses)).toEqual(true)
      })
    })

    describe('when search is not loading', () => {
      beforeAll(() => {
        mockIsLoading = false
      })

      describe('when there is a search input value', () => {
        beforeAll(() => {
          mockSearchInputVal = 'yolo'
        })

        it('renders Icon child component', () => {
          expect(TestUtils.isElementOfType(result.props.children, Icon)).toEqual(true)
        })
      })

      describe('when there is no search input value', () => {
        beforeAll(() => {
          mockSearchInputVal = null
        })

        it('renders no child component', () => {
          expect(result.props.children).toBeFalsy()
        })
      })
    })
  })

  describe('renderDesktopSearchOrLoadingIcon', () => {
    let result, component, mockIsLoading

    beforeEach(() => {
      component = domRender(<SearchField isLoading={mockIsLoading} />)
      result = component.renderDesktopSearchOrLoadingIcon()
    })

    describe('when is loading', () => {
      beforeAll(() => {
        mockIsLoading = true
      })

      it('renders LoadingEllipses child component', () => {
        expect(TestUtils.isElementOfType(result.props.children, LoadingEllipses)).toEqual(true)
      })
    })

    describe('when not loading', () => {
      beforeAll(() => {
        mockIsLoading = false
      })

      it('renders IconFieldButton child component', () => {
        expect(TestUtils.isElementOfType(result.props.children, IconFieldButton)).toEqual(true)
      })
    })
  })

  describe('renderIcons', () => {
    let result, component, mockFullscreen

    beforeEach(() => {
      component = domRender(<SearchField fullscreen={mockFullscreen} />)
      spyOn(component, 'renderMobileLoadingOrClearIcon')
      spyOn(component, 'renderMobileSearchIconButton')
      spyOn(component, 'renderDesktopSearchOrLoadingIcon')
      result = component.renderIcons()
    })

    describe('when fullscreen is true', () => {
      beforeAll(() => {
        mockFullscreen = true
      })

      it('calls renderMobileLoadingOrClearIcon method', () => {
        expect(component.renderMobileLoadingOrClearIcon).toHaveBeenCalled()
      })

      it('calls renderMobileSearchIconButton method', () => {
        expect(component.renderMobileSearchIconButton).toHaveBeenCalled()
      })

      it('render two icons', () => {
        expect(result.length).toEqual(2)
      })
    })

    describe('when fullscreen is false', () => {
      beforeAll(() => {
        mockFullscreen = false
      })

      it('calls renderDesktopSearchOrLoadingIcon method', () => {
        expect(component.renderDesktopSearchOrLoadingIcon).toHaveBeenCalled()
      })

      it('render one icon', () => {
        expect(result.length).toEqual(1)
      })
    })
  })

  describe('onChange', () => {
    let component,
      eObj,
      onChangeValueSpy = jasmine.createSpy('onChangeValue')

    beforeEach(() => {
      onChangeValueSpy = jasmine.createSpy('onChangeValue')
      component = domRender(<SearchField onChangeValue={onChangeValueSpy} />)
      eObj = {
        target: {
          value: 'yolo'
        }
      }
      component.onChange(eObj)
    })

    it('calls onChangeValue prop with correct params', () => {
      expect(onChangeValueSpy).toHaveBeenCalledWith('yolo')
    })
  })

  describe('clearInput', () => {
    let component,
      onChangeValueSpy = jasmine.createSpy('onChangeValue')

    beforeEach(() => {
      component = domRender(<SearchField onChangeValue={onChangeValueSpy} />)
      component.clearInput()
    })

    it('calls onChangeValue prop with correct params', () => {
      expect(onChangeValueSpy).toHaveBeenCalledWith('')
    })
  })

  describe('render', () => {
    let component, mockFullscreen, mockHasSearched, result

    beforeEach(() => {
      component = domRender(
        <SearchField hasSearched={mockHasSearched} fullscreen={mockFullscreen} />
      )
      spyOn(component, 'renderIcons')
      result = component.render()
    })

    it('calls renderIcons', () => {
      expect(component.renderIcons).toHaveBeenCalled()
    })

    describe('when fullscreen is true', () => {
      beforeAll(() => {
        mockFullscreen = true
      })

      it('renders mobileContainer class', () => {
        expect(result.props.className).toContain('mobileContainer')
      })

      it('does not render desktopContainer class', () => {
        expect(result.props.className).not.toContain('desktopContainer')
      })

      it('renders mobileSearchInput class', () => {
        expect(result.props.children[1].props.className).toContain('mobileSearchInput')
      })
    })

    describe('when fullscreen is false', () => {
      beforeAll(() => {
        mockFullscreen = false
      })

      it('does not render mobileContainer class', () => {
        expect(result.props.className).not.toContain('mobileContainer')
      })

      it('renders desktopContainer class', () => {
        expect(result.props.className).toContain('desktopContainer')
      })

      it('does not render mobileSearchInput class', () => {
        expect(result.props.children[0].props.className).not.toContain('mobileSearchInput')
      })
    })
  })
})
