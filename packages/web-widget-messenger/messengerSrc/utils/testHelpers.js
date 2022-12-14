import { render as rtlRender } from '@testing-library/react'
import { createMemoryHistory } from 'history'
import { Provider } from 'react-redux'
import { Router } from 'react-router-dom'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import t from '@zendesk/client-i18n-tools'
import { win } from '@zendesk/widget-shared-services'
import usTranslations from 'messengerSrc/features/i18n/gen/translations/en-us.json'
import ThemeProvider from 'messengerSrc/features/themeProvider'
import createStore from 'messengerSrc/store'
import { reducer } from '../features/suncoConversation/store'

export const render = (
  ui,
  { render, store, themeProps = {}, history = createMemoryHistory({ initialEntries: ['/'] }) } = {}
) => {
  const reduxStore = store || createStore()
  const renderFn = render || rtlRender
  t.set(usTranslations.locale)
  return {
    store: reduxStore,
    history,
    ...renderFn(
      <Provider store={reduxStore}>
        <ThemeProvider theme={themeProps}>
          <Router history={history}>{ui}</Router>
        </ThemeProvider>
      </Provider>
    ),
  }
}

export const mockMatchMedia = () => {
  // Keep track of all media queries made and their callbacks
  // {
  //   <media query>: [ <callback1>, <callback2> ]
  // }
  const mediaQueries = {}

  const mockMatchMedia = jest.fn().mockImplementation((query) => {
    if (!mediaQueries[query]) {
      mediaQueries[query] = []
    }

    return {
      matches: true,
      addEventListener: (_, callback) => {
        mediaQueries[query].push(callback)
      },
    }
  })

  const triggerChangeForBreakpoint = (breakpoint, event) => {
    mediaQueries[breakpoint]?.forEach((callback) => callback(event))
  }

  win.matchMedia = mockMatchMedia

  return {
    triggerChangeForBreakpoint,
  }
}

/*
  For testing reducers (duh).
  Pass it your reducer and an array of parameter objects.
  - If parameter object is a flat action payload, the test will use
  snapshot testing. The action can also be explicitly specified using
  an `action` key.
  - If parameter object contains key `initialState`, the value
  of that key will be used as initial state for the reducer.
  - If parameter object contains key `expected`, the value
  of that key will be used to assert against the result of the reducer.
*/
export const testReducer = (reducer, actions) => {
  actions.forEach((params) => {
    const { expected, initialState, extraDesc } = params
    const action = params.action || params
    const basicTestDesc = `${reducer.name}, action: ${action.type}`
    const testDesc = extraDesc ? `${basicTestDesc} ${extraDesc}` : basicTestDesc

    test(testDesc, () => {
      const reduced = reducer(initialState, action)

      if ('expected' in params) {
        expect(reduced).toEqual(expected)
      } else {
        expect(reduced).toMatchSnapshot()
      }
    })
  })
}

const mockStore = configureStore([thunk])
const initialState = () => reducer({}, {})

export const createMockStore = (state) => mockStore(state || initialState)
