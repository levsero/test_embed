import React from 'react'
import { createMemoryHistory } from 'history'

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
      'src/components/Widget': {
        WidgetThemeProvider: ({ children }) => <React.Fragment>{children}</React.Fragment>
      },
      'component/frame/Navigation': noopReactComponent(),
      'components/FrameFocusJail': noopReactComponent(),
      'src/redux/modules/selectors': {
        getColor: noop
      },
      'service/history': createMemoryHistory(),
      lodash: _,
      'service/i18n': {
        i18n: jasmine.createSpyObj('i18n', ['isRTL'])
      },
      './gardenOverrides': {
        getGardenOverrides: noop
      },
      'src/redux/modules/base': {
        handleEscapeKeyPressed: noop
      }
    })

    EmbedWrapper = requireUncached(EmbedWrapperPath).default.WrappedComponent
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
  })
})
