describe('EmbedWrapper', () => {
  let EmbedWrapper
  let focusSpy = jasmine.createSpy()
  const EmbedWrapperPath = buildSrcPath('component/frame/EmbedWrapper')

  class MockChildComponent extends Component {
    constructor(props) {
      super(props)
    }
    render() {
      return <div className="mock-component" />
    }
  }

  const hostDocumentFocusSpy = jasmine.createSpy('hostDocumentFocus')

  beforeEach(() => {
    mockery.enable()

    initMockRegistry({
      React: React,
      'utility/color/styles': {},
      'utility/globals': {
        focusLauncher: focusSpy,
        getDocumentHost: () => {
          return {
            querySelector: () => ({
              focus: hostDocumentFocusSpy,
              contentDocument: {
                querySelector: () => ({ focus: noop })
              }
            })
          }
        }
      },
      'component/frame/Navigation': noopReactComponent(),
      'src/redux/modules/selectors': {
        getColor: noop
      },
      lodash: _,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['isRTL'])
      },
      './gardenOverrides': {
        getGardenOverrides: noop
      }
    })

    EmbedWrapper = requireUncached(EmbedWrapperPath).EmbedWrapper
  })

  afterEach(() => {
    mockery.deregisterAll()
    mockery.disable()
    focusSpy.calls.reset()
  })

  describe('render', () => {
    let instance, styleBlock, rootElem

    beforeEach(() => {
      instance = domRender(
        <EmbedWrapper
          popoutButtonVisible={() => {}}
          reduxStore={{ getState: () => undefined, subscribe: () => undefined }}
          baseCSS=".base-css-file {}"
        >
          <MockChildComponent />
        </EmbedWrapper>
      )

      rootElem = ReactDOM.findDOMNode(instance)
      styleBlock = rootElem.getElementsByTagName('style')[0]
    })

    it('adds a <style> block to the iframe document', () => {
      expect(styleBlock.innerHTML).toContain('.base-css-file {}')
    })

    it('renders the child in the wrapper', () => {
      expect(instance.embed.firstChild.className).toBe('mock-component')
    })

    it('adds a rootComponent ref to that child', () => {
      expect(instance.refs.rootComponent).toBeDefined()
    })

    describe('on keypress', () => {
      let target, targetId, keypressId

      beforeEach(() => {
        target = {
          ownerDocument: {
            defaultView: {
              frameElement: {
                id: targetId
              }
            }
          }
        }

        TestUtils.Simulate.keyDown(rootElem, {
          key: 'Escape',
          keyCode: keypressId,
          which: keypressId,
          target
        })
      })

      describe('when ESC is pressed', () => {
        beforeAll(() => {
          keypressId = 27
        })

        describe('when webWidget is focused', () => {
          beforeAll(() => {
            targetId = 'webWidget'
          })

          it('calls handleOnCloseFocusChange', () => {
            expect(focusSpy).toHaveBeenCalled()
          })
        })

        describe('when launcher is focused', () => {
          beforeAll(() => {
            targetId = 'launcher'
          })

          it('does not call handleOnCloseFocusChange', () => {
            expect(focusSpy).not.toHaveBeenCalled()
          })
        })
      })

      describe('when TAB is pressed', () => {
        beforeAll(() => {
          keypressId = 9
        })

        describe('when webWidget is focused', () => {
          beforeAll(() => {
            targetId = 'webWidget'
          })

          it('does not give document focus', () => {
            expect(hostDocumentFocusSpy).not.toHaveBeenCalled()
          })
        })

        describe('when launcher is focused', () => {
          beforeAll(() => {
            targetId = 'launcher'
          })

          it('gives the document focus', () => {
            expect(hostDocumentFocusSpy).toHaveBeenCalled()
          })
        })
      })
    })
  })
})
