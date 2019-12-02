describe('embed.launcher', () => {
  let launcher, mockFrame, mockIsMobileBrowser, mockZoomSizingRatioValue
  const mockToken = 'someMockedToken'
  const launcherPath = buildSrcPath('embed/launcher/launcher')

  const mockReduxStore = {
    getState: () => ({}),
    subscribe: () => ({})
  }

  beforeEach(() => {
    mockIsMobileBrowser = false
    mockZoomSizingRatioValue = 1

    mockery.enable()

    mockFrame = requireUncached(buildTestPath('unit/mocks/mockFrame')).MockFrame

    initMockRegistry({
      React: React,
      'utility/globals': {
        document: global.document,
        getDocumentHost: () => {
          return document.body
        }
      },
      'utility/color/styles': {
        generateUserLauncherCSS: jasmine.createSpy().and.returnValue('')
      },
      'component/launcher/Launcher': class extends Component {
        constructor() {
          super()
          this.setUnreadMessages = jasmine.createSpy('setUnreadMessages')
        }
        render() {
          return <div className="mock-launcher" />
        }
      },
      'service/i18n': {
        i18n: {
          t: _.identity
        }
      },
      'service/mediator': {
        mediator: {
          channel: jasmine.createSpyObj('channel', ['broadcast', 'subscribe'])
        }
      },
      globalCSS: '',
      './launcherStyles': {
        launcherStyles: 'mockCss'
      },
      'component/frame/Frame': mockFrame,
      'utility/devices': {
        isMobileBrowser: () => mockIsMobileBrowser,
        getZoomSizingRatio: () => mockZoomSizingRatioValue
      },
      lodash: _,
      'src/redux/modules/base': {
        renewToken: () => mockToken
      },
      'constants/launcher': {
        FRAME_OFFSET_WIDTH: 5,
        FRAME_OFFSET_HEIGHT: 1
      },
      'src/util/utils': {
        onNextTick: cb => setTimeout(cb, 0)
      }
    })

    mockery.registerAllowable(launcherPath)
    launcher = requireUncached(launcherPath).launcher
  })

  afterEach(() => {
    jasmine.clock().uninstall()
    mockery.deregisterAll()
    mockery.disable()
  })

  describe('create', () => {
    it('should add a new launcher to the internal list', () => {
      launcher.create('launcher', undefined, mockReduxStore)
      launcher.render()
      const alice = launcher.get()

      expect(alice).toBeDefined()

      expect(alice.instance).toBeDefined()

      expect(alice.config).toBeDefined()
    })

    describe('config', () => {
      let config, frame, child, alice

      beforeEach(() => {
        config = {
          props: {
            onClick: jasmine.createSpy(),
            labelKey: 'help',
            visible: true
          }
        }
        launcher.create('launcher', config, mockReduxStore)
        launcher.render()
        alice = launcher.get()
        frame = alice.instance
        child = frame.props.children
      })

      it('applies the label from config', () => {
        expect(child.props.labelKey).toEqual(alice.config.props.labelKey)
      })

      it('sets fullscreenable to false', () => {
        expect(frame.props.fullscreenable).toEqual(false)
      })
    })

    describe('launcher onClick', () => {
      let reduxStore, dispatchSpy, bob, frame, child

      beforeEach(() => {
        dispatchSpy = jasmine.createSpy('dispatch')
        reduxStore = {
          dispatch: dispatchSpy
        }
        launcher.create('bob', undefined, reduxStore)
        bob = launcher.get()
        frame = bob.component.props.children
        child = frame.props.children
        child.props.onClickHandler({
          preventDefault: () => {}
        })
      })

      it('calls dispatch', () => {
        expect(dispatchSpy).toHaveBeenCalledWith(mockToken)
      })
    })
  })

  describe('get', () => {
    it('should return the correct launcher', () => {
      const config = {
        props: {
          position: 'test_alice_position',
          onClick: () => 'launcher',
          icon: '',
          visible: true
        }
      }

      launcher.create('launcher', config, mockReduxStore)
      const alice = launcher.get()

      expect(alice).not.toBeUndefined()

      expect(alice.config.position).toEqual(config.position)

      expect(alice.config.icon).toEqual(config.icon)

      expect(alice.config.visible).toEqual(config.visible)
    })
  })

  describe('render', () => {
    it('should throw an exception if launcher does not exist', () => {
      expect(() => {
        launcher.render()
      }).toThrow()
    })

    it('renders a launcher', () => {
      launcher.create('launcher', undefined, mockReduxStore)
      launcher.render()

      expect(launcher.get().instance).toBeDefined()
    })

    it('should only be allowed to render an launcher once', () => {
      launcher.create('launcher', undefined, mockReduxStore)

      expect(() => {
        launcher.render()
      }).not.toThrow()

      expect(() => {
        launcher.render()
      }).toThrow()
    })

    it('applies launcher styles to the frame', () => {
      launcher.create('launcher', undefined, mockReduxStore)
      launcher.render()

      expect(launcher.get().component.props.children.props.css).toContain('mockCss')
    })

    describe('frameStyleModifier prop', () => {
      const element = {
        offsetWidth: 50,
        clientWidth: 20
      }

      describe('adjustStylesForZoom', () => {
        let result
        const frameStyleProperties = ['width', 'height', 'marginBottom', 'marginRight', 'zIndex']
        const frameStyle = {
          width: '10px',
          height: '10px',
          marginBottom: '15px',
          marginRight: '25px',
          zIndex: '999999'
        }

        beforeEach(() => {
          mockIsMobileBrowser = true
          mockZoomSizingRatioValue = Math.random()
          launcher.create('launcher', undefined, mockReduxStore)
          launcher.render()

          const alice = launcher.get().instance
          const frameStyleModifier = alice.props.frameStyleModifier

          result = frameStyleModifier(frameStyle, element)
        })

        afterEach(() => {
          mockIsMobileBrowser = false
          mockZoomSizingRatioValue = 1
        })

        it('does not omit properties from frameStyle', () => {
          frameStyleProperties.forEach(subject => {
            expect(_.has(result, subject)).toEqual(true)
          })
        })

        it('adjusts margin properties accordingly', () => {
          const getMargin = value => {
            return Math.round(value * mockZoomSizingRatioValue) + 'px'
          }
          const expected = {
            marginBottom: getMargin(15),
            marginRight: getMargin(25)
          }

          expect(result).toEqual(jasmine.objectContaining(expected))
        })

        it('adjusts height property accordingly', () => {
          const expected = {
            height: `${50 * mockZoomSizingRatioValue}px`
          }

          expect(result).toEqual(jasmine.objectContaining(expected))
        })
      })

      describe('adjustWidth', () => {
        let result
        const frameStyle = {
          width: '10px',
          height: '10px'
        }

        beforeEach(() => {
          launcher.create('launcher', undefined, mockReduxStore)
          launcher.render()

          const alice = launcher.get().instance
          const frameStyleModifier = alice.props.frameStyleModifier

          result = frameStyleModifier(frameStyle, element)
        })

        it('adjust the width using the element', () => {
          const expected = {
            width: 55,
            height: '10px'
          }

          expect(result).toEqual(jasmine.objectContaining(expected))
        })
      })
    })
  })
})
