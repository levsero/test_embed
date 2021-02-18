describe('Frame', () => {
  let Frame,
    mockRegistryMocks,
    mockChild,
    mockSettingsValue,
    mockIsRTLValue,
    mockLocaleValue,
    mockZoomSizingRatioValue,
    mockIsPopout = false,
    renderedFrame,
    mockHorizontalPosition,
    TEST_IDS

  const FramePath = buildSrcPath('component/frame/Frame')
  const sharedConstantsPath = basePath('src/constants/shared')

  const DEFAULT_WIDGET_HEIGHT = 540
  const MIN_WIDGET_HEIGHT = 150
  const WIDGET_WIDTH = 342
  const WIDGET_MARGIN = 16

  class MockEmbedWrapper extends Component {
    constructor(props, context) {
      super(props, context)
      this.embed = null
    }

    setCustomCSS() {}

    render() {
      const newChild = React.cloneElement(this.props.children, {
        ref: 'rootComponent',
      })

      return (
        <div
          id="Embed"
          ref={(el) => {
            this.embed = el
          }}
        >
          {newChild}
        </div>
      )
    }
  }

  class MockChildComponent extends Component {
    constructor(props) {
      super(props)
      this.onClick = props.onClickHandler
      this.onSubmit = props.onSubmitHandler
      this.setOffsetHorizontal = props.setOffsetHorizontal
      this.getActiveComponent = () => this.refs.activeComponent
    }
    componentWillUnmount() {}
    render() {
      return <div className="mock-component" refs="activeComponent" />
    }
  }

  mockHorizontalPosition = 'right'

  beforeEach(() => {
    mockery.enable()
    renderedFrame = null
    mockIsRTLValue = false
    mockLocaleValue = 'en-US'
    mockZoomSizingRatioValue = 1

    TEST_IDS = requireUncached(sharedConstantsPath).TEST_IDS

    mockSettingsValue = {
      offset: { vertical: 0, horizontal: 0 },
      zIndex: 999999,
      position: { vertical: 'bottom' },
    }

    mockRegistryMocks = {
      React: React,
      './Frame.scss': {
        locals: {},
      },
      'utility/utils': {
        cssTimeToMs: () => 300,
      },
      'utility/color/styles': {},
      'utility/devices': {
        getZoomSizingRatio: () => {
          return mockZoomSizingRatioValue
        },
        isFirefox: () => {
          return false
        },
      },
      'src/apps/webWidget/services/i18n': {
        i18n: {
          t: noop,
          isRTL: () => mockIsRTLValue,
          getLocale: () => mockLocaleValue,
        },
      },
      'service/settings': {
        settings: {
          get: (name) => _.get(mockSettingsValue, name, null),
        },
      },
      'component/frame/EmbedWrapper': MockEmbedWrapper,
      'src/framework/components/Frame': requireUncached(
        buildSrcPath('framework/components/Frame/index.js')
      ),
      'src/redux/modules/settings/settings-selectors': {},
      'src/redux/modules/base/base-actions': {
        widgetShowAnimationComplete: noop,
      },
      'constants/shared': {
        FONT_SIZE: 14,
        DEFAULT_WIDGET_HEIGHT,
        MIN_WIDGET_HEIGHT,
        WIDGET_WIDTH,
        WIDGET_MARGIN,
        TEST_IDS,
      },
      lodash: _,
      'component/Icon': {
        Icon: noop,
      },
      'src/redux/modules/selectors': {
        getFixedStyles: () => {},
      },
      'src/redux/modules/base/base-selectors': {
        getFrameVisible: () => {},
      },
      'src/util/utils': {
        onNextTick: (cb) => setTimeout(cb, 0),
      },
    }

    initMockRegistry(mockRegistryMocks)

    mockChild = <MockChildComponent className="mock-component" />

    Frame = requireUncached(FramePath).default.WrappedComponent
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
  })

  const renderFrame = (props = {}) => {
    const defaultProps = {
      horizontalPosition: 'right',
      verticalPosition: 'bottom',
      isMobile: false,
    }
    const mergedProps = { ...defaultProps, ...props }

    renderedFrame = domRender(<Frame {...mergedProps}>{mockChild}</Frame>)
  }

  const wait = (time) =>
    new Promise((res) => {
      setTimeout(() => {
        res()
      }, time)
    })

  const forceFrameReady = async (frame) => {
    const doc = frame.getContentWindow().document

    const event = document.createEvent('Event')
    event.initEvent('load', true, true)

    doc.dispatchEvent(event)

    frame.forceUpdate()

    await wait(0)
  }

  describe('getRootComponent', () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 5000

    it('returns the child component when called', async () => {
      const frame = domRender(<Frame>{mockChild}</Frame>)

      await forceFrameReady(frame)

      expect(frame.getRootComponent().props.className).toEqual('mock-component')
    })
  })

  describe('getChild', () => {
    it('returns a react component with the name passed in', async () => {
      const frame = domRender(<Frame name="Nick">{mockChild}</Frame>)

      await forceFrameReady(frame)

      expect(frame.child.props.name).toEqual('Nick')
    })
  })

  describe('updateFrameLocale', () => {
    let frame, documentElem

    describe('when the locale is RTL', () => {
      beforeEach(async () => {
        mockIsRTLValue = true
        mockLocaleValue = 'ar'

        frame = domRender(<Frame>{mockChild}</Frame>)

        await forceFrameReady(frame)

        frame.updateFrameLocale()
        documentElem = frame.getContentDocument().documentElement
      })

      it('updates html lang attribute', () => {
        expect(documentElem.lang).toEqual(mockLocaleValue)
      })

      it('updates html dir attribute to rtl', () => {
        expect(documentElem.dir).toEqual('rtl')
      })
    })

    describe('when the locale is LTR', () => {
      beforeEach(async () => {
        mockIsRTLValue = false
        mockLocaleValue = 'en-GB'

        frame = domRender(<Frame>{mockChild}</Frame>)

        await forceFrameReady(frame)

        frame.updateFrameLocale()
        documentElem = frame.getContentDocument().documentElement
      })

      it('updates html lang attribute', () => {
        expect(documentElem.lang).toEqual(mockLocaleValue)
      })

      it('updates html dir attribute to ltr', () => {
        expect(documentElem.dir).toEqual('ltr')
      })
    })
  })

  describe('back', () => {
    let frame, mockOnBack

    beforeEach(() => {
      mockOnBack = jasmine.createSpy('onBack')

      frame = domRender(<Frame onBack={mockOnBack}>{mockChild}</Frame>)

      frame.back({ preventDefault: noop })
    })

    it('calls props.callbacks.onBack', () => {
      expect(mockOnBack).toHaveBeenCalled()
    })
  })

  describe('onShowAnimationComplete', () => {
    let frame, widgetShowAnimationCompleteSpy, frameName

    beforeEach(() => {
      widgetShowAnimationCompleteSpy = jasmine.createSpy('widgetShowAnimationComplete')

      frame = domRender(
        <Frame widgetShowAnimationComplete={widgetShowAnimationCompleteSpy} name={frameName}>
          {mockChild}
        </Frame>
      )

      frame.onShowAnimationComplete({ preventDefault: noop })
    })

    describe('when frame name is webWidget', () => {
      beforeAll(() => {
        frameName = 'webWidget'
      })

      it('calls props.widgetShowAnimationComplete', () => {
        expect(widgetShowAnimationCompleteSpy).toHaveBeenCalled()
      })
    })

    describe('when frame name is not webWidget', () => {
      beforeAll(() => {
        frameName = 'launcher'
      })

      it('does not call props.widgetShowAnimationComplete', () => {
        expect(widgetShowAnimationCompleteSpy).not.toHaveBeenCalled()
      })
    })
  })

  describe('computeIframeStyle', () => {
    let frame

    describe('props.frameStyleModifier', () => {
      let frameStyleModifierSpy, result

      describe('when frameStyleModifier exists', () => {
        const modifiedFrameStyle = { marginTop: '10px', marginLeft: '55px' }

        beforeEach(async () => {
          frameStyleModifierSpy = jasmine
            .createSpy('frameStyleModifier')
            .and.returnValue(modifiedFrameStyle)
          frame = domRender(<Frame frameStyleModifier={frameStyleModifierSpy}>{mockChild}</Frame>)
          await forceFrameReady(frame)
          result = frame.computeIframeStyle()
        })

        it('modified frameStyle contains at least 1 property', () => {
          expect(_.keys(modifiedFrameStyle).length).toBeGreaterThan(0)
        })

        it('computeIframeStyle contains styles from the modification', () => {
          expect(result).toEqual(jasmine.objectContaining(modifiedFrameStyle))
        })
      })

      describe('when frameStyleModifier does not exist', () => {
        const frameStyle = {
          marginRight: '22px',
          marginLeft: '10px',
          marginTop: '66px',
        }

        beforeEach(() => {
          frameStyleModifierSpy = jasmine.createSpy('frameStyleModifier').and.returnValue(undefined)
          frame = domRender(<Frame frameStyle={frameStyle}>{mockChild}</Frame>)
          result = frame.computeIframeStyle()
        })

        it('computeIframeStyle contains styles from frameStyle', () => {
          expect(result).toEqual(jasmine.objectContaining(frameStyle))
        })
      })
    })

    describe('zIndex', () => {
      let frame

      beforeEach(() => {
        frame = domRender(<Frame zIndex={10001}>{mockChild}</Frame>)
      })

      it('uses the value from props if it exists', () => {
        expect(frame.computeIframeStyle().zIndex).toBe(10001)
      })
    })

    describe('fixedStyles prop', () => {
      let result
      const frameStyle = {
        width: 0,
        height: 0,
        background: 'rgb(255, 255, 255)',
      }

      describe('when fixedStyles has properties', () => {
        const fixedStyles = {
          width: '10px',
          height: 'auto',
          background: 'transparent',
        }

        beforeEach(() => {
          frame = domRender(
            <Frame frameStyle={frameStyle} fixedStyles={fixedStyles}>
              {mockChild}
            </Frame>
          )
          result = frame.computeIframeStyle()
        })

        it('computeIframeStyle contains styles from the modification', () => {
          expect(result).toEqual(jasmine.objectContaining(fixedStyles))
        })
      })

      describe('when frameStyleModifier does not exist', () => {
        beforeEach(() => {
          frame = domRender(<Frame frameStyle={frameStyle}>{mockChild}</Frame>)
          result = frame.computeIframeStyle()
        })

        it('computeIframeStyle contains styles from frameStyle', () => {
          expect(result).toEqual(jasmine.objectContaining(frameStyle))
        })
      })
    })
  })

  describe('getOffsetPosition', () => {
    describe('vertical', () => {
      describe('when settings sets position to top', () => {
        beforeEach(() => {
          renderFrame({ verticalPosition: 'top', horizontalPosition: 'right' })
        })

        it('has top classes', () => {
          expect(renderedFrame.getOffsetPosition().top).toBeDefined()
          expect(renderedFrame.getOffsetPosition().bottom).toBeUndefined()
        })
      })
    })

    describe('horizontal', () => {
      describe('when set to right', () => {
        beforeEach(() => {
          renderFrame({ verticalPosition: 'top', horizontalPosition: 'right' })
        })

        it('has right offset', () => {
          expect(renderedFrame.getOffsetPosition().right).toBeDefined()

          expect(renderedFrame.getOffsetPosition().left).toBeUndefined()
        })
      })

      describe('when set to left', () => {
        beforeEach(() => {
          renderFrame({ verticalPosition: 'top', horizontalPosition: 'left' })
        })
        it('has left offset', () => {
          expect(renderedFrame.getOffsetPosition().left).toBeDefined()

          expect(renderedFrame.getOffsetPosition().right).toBeUndefined()
        })
      })
    })
  })

  describe('offset', () => {
    const desktopOnlyOffset = {
      vertical: 31,
      horizontal: 52,
    }
    const mobileOnlyOffset = {
      mobile: {
        horizontal: 100,
        vertical: 200,
      },
    }
    const desktopAndMobileOffset = {
      horizontal: 101,
      vertical: 102,
      mobile: {
        horizontal: 100,
        vertical: 200,
      },
    }

    describe('when not on webWidget', () => {
      describe('when on desktop', () => {
        describe('when there is a desktop offset only', () => {
          beforeEach(() => {
            renderFrame({ offset: desktopOnlyOffset })
          })

          it('applies the customized desktop offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom).toBe(31)

            expect(renderedFrame.getOffsetPosition().right).toBe(52)
          })
        })

        describe('when there is a mobile offset only', () => {
          beforeEach(() => {
            renderFrame({ offset: mobileOnlyOffset })
          })

          it('does not apply customized mobile offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom).toBe(0)

            expect(renderedFrame.getOffsetPosition().right).toBe(0)
          })
        })

        describe('when there are desktop and mobile offsets', () => {
          beforeEach(() => {
            renderFrame({ offset: desktopAndMobileOffset })
          })

          it('applies only customized desktop offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom).toBe(102)

            expect(renderedFrame.getOffsetPosition().right).toBe(101)
          })
        })

        describe('when there is no offset', () => {
          beforeEach(() => {
            renderFrame({ offset: {} })
          })

          it('defaults to 0', () => {
            expect(renderedFrame.getOffsetPosition().bottom).toBe(0)

            expect(renderedFrame.getOffsetPosition().right).toBe(0)
          })
        })

        describe('when an animationOffset is passed in', () => {
          beforeEach(() => {
            renderFrame({ offset: desktopOnlyOffset })
          })

          it('adds it to the vertical property', () => {
            expect(renderedFrame.getOffsetPosition(20).bottom).toBe(51)
          })
        })

        describe('when on mobile', () => {
          describe('when there is a desktop offset only', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: desktopOnlyOffset })
            })

            it('does not apply the customized desktop offsets', () => {
              expect(renderedFrame.getOffsetPosition().bottom).toBe(0)

              expect(renderedFrame.getOffsetPosition().right).toBe(0)
            })
          })

          describe('when there is a mobile offset only', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: mobileOnlyOffset })
            })

            it('applies customized mobile offsets', () => {
              expect(renderedFrame.getOffsetPosition().bottom).toBe(200)

              expect(renderedFrame.getOffsetPosition().right).toBe(100)
            })
          })

          describe('when there are desktop and mobile offsets', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: desktopAndMobileOffset })
            })

            it('applies only customized mobile offsets', () => {
              expect(renderedFrame.getOffsetPosition().bottom).toBe(200)

              expect(renderedFrame.getOffsetPosition().right).toBe(100)
            })
          })

          describe('when there is no offset', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: {} })
            })

            it('defaults to 0', () => {
              expect(renderedFrame.getOffsetPosition().bottom).toBe(0)

              expect(renderedFrame.getOffsetPosition().right).toBe(0)
            })
          })

          describe('when an animationOffset is passed in', () => {
            beforeEach(() => {
              renderFrame({ isMobile: true, offset: mobileOnlyOffset })
            })

            it('adds it to the vertical property', () => {
              expect(renderedFrame.getOffsetPosition(20).bottom).toBe(220)
            })
          })
        })
      })

      describe('when on Web Widget', () => {
        describe('when on mobile', () => {
          beforeEach(() => {
            renderFrame({ name: 'webWidget', offset: desktopAndMobileOffset })
          })

          it('applies the customized desktop offsets', () => {
            expect(renderedFrame.getOffsetPosition().bottom).toBe(102)

            expect(renderedFrame.getOffsetPosition().right).toBe(101)
          })
        })

        describe('and on mobile', () => {
          beforeEach(() => {
            renderFrame({
              isMobile: true,
              name: 'webWidget',
              offset: desktopAndMobileOffset,
            })
          })

          it('does not apply customized offsets', () => {
            expect(renderedFrame.getOffsetPosition()).toEqual({})
          })
        })
      })
    })
  })

  describe('render', () => {
    let frame,
      visibleValue = true

    beforeEach(() => {
      frame = domRender(
        <Frame visible={visibleValue} name="foo" verticalPosition="bottom">
          {mockChild}
        </Frame>
      )
    })

    it('renders an iframe', () => {
      expect(frame.iframe).toBeDefined()
    })

    it('assigns the correct classes', () => {
      expect(frame.iframe.className).toContain('foo')
    })

    describe('when visible', () => {
      it('has `--active` in classes', () => {
        expect(frame.iframe.className).toContain('--active')
      })

      it('sets the tab index to 0', () => {
        expect(frame.iframe.attributes.tabindex.value).toEqual('0')
      })

      it('has the correct animation styles applied to it', () => {
        expect(frame.iframe.style.getPropertyValue('opacity')).toEqual('1')

        expect(frame.iframe.style.getPropertyValue('bottom')).toEqual('0px')
      })
    })

    describe('when not visible', () => {
      beforeAll(() => {
        visibleValue = false
      })

      it('does not have `--active` in classes', () => {
        expect(frame.iframe.className).not.toContain('--active')
      })

      it('sets the tab index to -1', () => {
        expect(frame.iframe.attributes.tabindex.value).toEqual('-1')
      })

      it('has the correct animation styles applied to it', () => {
        expect(frame.iframe.style.getPropertyValue('opacity')).toEqual('0')
      })
    })
  })

  describe('renderFrameContent', () => {
    let frame, doc

    beforeEach(async () => {
      mockLocaleValue = 'fr'
      mockIsRTLValue = true

      frame = domRender(<Frame rawCSS="css-prop">{mockChild}</Frame>)
      doc = frame.getContentWindow().document

      spyOn(frame, 'updateFrameLocale')
      spyOnProperty(doc, 'readyState').and.returnValue('complete')

      await forceFrameReady(frame)
    })

    it('calls updateFrameLocale ', () => {
      expect(frame.updateFrameLocale).toHaveBeenCalled()
    })

    it('sets rtl and lang attr on the frame', () => {
      expect(frame.getContentDocument().documentElement.lang).toBe('fr')

      expect(frame.getContentDocument().documentElement.dir).toBe('rtl')
    })

    describe('constructEmbed', () => {
      it('adds onBackButtonClick to the child component', () => {
        expect(frame.getRootComponent().props.onBackButtonClick).toBeDefined()
      })

      it('adds css styles to the element', () => {
        expect(frame.getChild().props.baseCSS).toContain('css-prop')
      })
    })
  })

  describe('getDefaultDimensions', () => {
    let mockFullscreenable, mockIsMobile

    const expectedMobileDimensions = {
      width: '100%',
      maxWidth: '100%',
      height: '100%',
    }
    const expectedDesktopDimensions = {
      width: `${WIDGET_WIDTH + 2 * WIDGET_MARGIN}px`,
      height: '100%',
      maxHeight: `${DEFAULT_WIDGET_HEIGHT + 2 * WIDGET_MARGIN}px`,
      minHeight: `${MIN_WIDGET_HEIGHT}px`,
    }
    const expectedDesktopPopoutDimensions = {
      ...expectedMobileDimensions,
      right: '50%',
      background: '#EEE',
    }
    const expectedDesktopPopoutLeftDimensions = {
      ...expectedMobileDimensions,
      left: undefined,
      background: '#EEE',
    }

    beforeEach(() => {
      renderFrame({
        isMobile: mockIsMobile,
        horizontalPosition: mockHorizontalPosition,
        fullscreen: mockIsPopout,
        fullscreenable: mockFullscreenable,
      })
    })

    describe('when mobile', () => {
      beforeAll(() => {
        mockIsMobile = true
      })

      describe('when fullscreenable is true', () => {
        beforeAll(() => {
          mockFullscreenable = true
        })

        it('returns the expected mobile dimensions', () => {
          expect(renderedFrame.getDefaultDimensions()).toEqual(expectedMobileDimensions)
        })
      })

      describe('when fullscreenable is false', () => {
        beforeAll(() => {
          mockFullscreenable = false
        })

        it('returns the expected desktop dimensions', () => {
          expect(renderedFrame.getDefaultDimensions()).toEqual(expectedDesktopDimensions)
        })
      })
    })

    describe('on desktop', () => {
      beforeAll(() => {
        mockIsMobile = false
      })

      it('returns the expected mobile dimensions', () => {
        expect(renderedFrame.getDefaultDimensions()).toEqual(expectedDesktopDimensions)
      })

      describe('when Popout', () => {
        beforeAll(() => {
          mockIsPopout = true
          mockFullscreenable = true
        })

        it('returns the expected popout dimensions', () => {
          expect(renderedFrame.getDefaultDimensions()).toEqual(expectedDesktopPopoutDimensions)
        })

        describe('when position left is true', () => {
          beforeAll(() => {
            mockHorizontalPosition = 'left'
          })

          it('returns the expected popout dimensions', () => {
            expect(renderedFrame.getDefaultDimensions()).toEqual(
              expectedDesktopPopoutLeftDimensions
            )
          })
        })
      })
    })
  })

  describe('setCustomCSS', () => {
    let frame

    beforeEach(() => {
      frame = domRender(
        <Frame generateUserCSS={_.identity} color="black">
          {mockChild}
        </Frame>
      )
      spyOn(frame, 'setCustomCSS')
    })

    it('calls setCustomCSS if the colors change', () => {
      domRender(
        <Frame generateUserCSS={_.identity} color="white">
          {mockChild}
        </Frame>
      )
      expect(frame.setCustomCSS).toHaveBeenCalled()
    })

    it('does not call setCustomCSS if the colors do not change', () => {
      domRender(
        <Frame generateUserCSS={_.identity} color="black">
          {mockChild}
        </Frame>
      )
      expect(frame.setCustomCSS).not.toHaveBeenCalled()
    })
  })
})
