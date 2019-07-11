describe('Navigation', () => {
  let Navigation, mockClickBusterRegister

  const navigationPath = buildSrcPath('component/frame/Navigation')

  beforeEach(() => {
    mockery.enable()

    const sharedConstantsPath = buildSrcPath('constants/shared')
    const ICONS = requireUncached(sharedConstantsPath).ICONS

    mockClickBusterRegister = jasmine.createSpy('clickBusterRegister')

    initMockRegistry({
      React: React,
      'component/button/ButtonNav': {
        ButtonNav: class extends Component {
          render() {
            return <div className={this.props.className}>{this.props.label}</div>
          }
        }
      },
      'service/i18n': {
        i18n: {
          isRTL: () => false,
          t: noop
        }
      },
      './Navigation.scss': {
        locals: {
          icon: 'icon'
        }
      },
      'component/Icon': {
        Icon: class extends Component {
          render() {
            return <div className={`${this.props.type} ${this.props.className}`} />
          }
        }
      },
      'src/redux/modules/preview/preview-selectors': {
        getIsChatPreviewEnabled: () => true
      },
      'src/redux/modules/chat/chat-selectors': {
        getMenuVisible: () => false
      },
      'src/redux/modules/selectors': {
        getShowMenu: () => false
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatPopout: () => {}
      },
      'src/redux/modules/chat': {
        updateMenuVisibility: () => {}
      },
      'src/redux/modules/base/base-actions': {
        handleCloseButtonClicked: () => {}
      },
      'constants/shared': {
        ICONS
      },
      'utility/devices': {
        clickBusterRegister: mockClickBusterRegister
      },
      'src/util/chat': {}
    })

    Navigation = requireUncached(navigationPath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('render', () => {
    let result, mockStandaloneMobileNotificationVisible

    beforeEach(() => {
      const component = instanceRender(
        <Navigation standaloneMobileNotificationVisible={mockStandaloneMobileNotificationVisible} />
      )

      result = component.render()
    })

    describe('when props.standaloneMobileNotificationVisible is true', () => {
      beforeAll(() => {
        mockStandaloneMobileNotificationVisible = true
      })

      it('does not render the component', () => {
        expect(result).toBeNull()
      })
    })

    describe('when props.standaloneMobileNotificationVisible is false', () => {
      beforeAll(() => {
        mockStandaloneMobileNotificationVisible = false
      })

      it('renders the component', () => {
        expect(result).toBeTruthy()
      })
    })
  })

  describe('back button', () => {
    let navigation, navigationNode

    describe('when props.backButtonVisible is true', () => {
      describe('when props.useBackButton is true', () => {
        beforeEach(() => {
          navigation = domRender(<Navigation useBackButton={true} backButtonVisible={true} />)
          navigationNode = ReactDOM.findDOMNode(navigation)
        })

        it('should render the back button', () => {
          expect(navigationNode.querySelector('.Icon--back')).not.toBeNull()
        })
      })

      describe('when props.useBackButton is false', () => {
        beforeEach(() => {
          navigation = domRender(<Navigation useBackButton={false} backButtonVisible={true} />)
          navigationNode = ReactDOM.findDOMNode(navigation)
        })

        it('should not render the back button', () => {
          expect(navigationNode.querySelector('.Icon--back')).toBeNull()
        })
      })
    })

    describe('when props.backButtonVisible is false', () => {
      beforeEach(() => {
        navigation = domRender(<Navigation backButtonVisible={false} />)
        navigationNode = ReactDOM.findDOMNode(navigation)
      })

      it('does not render the back button', () => {
        expect(navigationNode.querySelector('.Icon--back')).toBeNull()
      })
    })

    describe('when props.useMenu is true and fullscreen', () => {
      beforeEach(() => {
        navigation = domRender(<Navigation useMenu={true} fullscreen={true} />)
        navigationNode = ReactDOM.findDOMNode(navigation)
      })

      it('does not render the back button', () => {
        expect(navigationNode.querySelector('.Icon--back')).toBeNull()
      })
    })
  })

  describe('mobile menu', () => {
    let navigation, navigationNode

    describe('when props.useMenu is true and isMobile', () => {
      beforeEach(() => {
        navigation = domRender(<Navigation useMenu={true} isMobile={true} />)
        navigationNode = ReactDOM.findDOMNode(navigation)
      })

      it('renders the menu icon', () => {
        expect(navigationNode.querySelector('.Icon--menu')).not.toBeNull()
      })
    })
  })

  describe('handleCloseClick', () => {
    let navigation, isMobile, preventClose
    const handleCloseButtonClickSpy = jasmine.createSpy('handleCloseButtonClick')
    const stopPropagationSpy = jasmine.createSpy('stopPropagation')
    const handleOnCloseFocusChangeSpy = jasmine.createSpy('handleOnCloseFocusChange')

    beforeEach(() => {
      navigation = domRender(
        <Navigation
          preventClose={preventClose}
          isMobile={isMobile}
          handleOnCloseFocusChange={handleOnCloseFocusChangeSpy}
          handleCloseButtonClicked={handleCloseButtonClickSpy}
        />
      )
      navigation.handleCloseClick({ stopPropagation: stopPropagationSpy })
    })

    afterEach(() => {
      handleCloseButtonClickSpy.calls.reset()
    })

    it('calls stopPropagation event', () => {
      expect(stopPropagationSpy).toHaveBeenCalled()
    })

    describe('when preventClose option is false', () => {
      beforeAll(() => {
        preventClose = false
      })

      describe('when on desktop', () => {
        beforeAll(() => {
          isMobile = false
        })

        it('calls handleCloseButtonClick prop', () => {
          expect(handleCloseButtonClickSpy).toHaveBeenCalled()
        })
      })

      it('calls handleOnCloseFocusChangeSpy prop', () => {
        expect(handleOnCloseFocusChangeSpy).toHaveBeenCalled()
      })

      describe('when on mobile', () => {
        let mockEvent

        beforeEach(() => {
          isMobile = true
        })

        it('calls handleCloseButtonClick prop', () => {
          expect(handleCloseButtonClickSpy).toHaveBeenCalled()
        })

        it('does not call clickBusterRegister', () => {
          expect(mockClickBusterRegister).not.toHaveBeenCalledWith()
        })

        describe('when there is a touch event', () => {
          beforeEach(() => {
            mockEvent = {
              stopPropagation: () => {},
              touches: [{ clientX: 1, clientY: 1 }]
            }

            navigation.handleCloseClick(mockEvent)
          })

          it('calls clickBusterRegister', () => {
            expect(mockClickBusterRegister).toHaveBeenCalledWith(1, 1)
          })
        })
      })
    })

    describe('when preventClose option is true', () => {
      beforeAll(() => {
        preventClose = true
      })

      it('does not call handleCloseButtonClick prop', () => {
        expect(handleCloseButtonClickSpy).not.toHaveBeenCalled()
      })
    })
  })
})
