import React from 'react'
import { IdManager } from '@zendeskgarden/react-selection'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import createStore from 'src/apps/messenger/store'
import hostPageWindow from 'src/framework/utils/hostPageWindow'

export const render = (ui, { render, store, themeProps = {} } = {}) => {
  IdManager.setIdCounter(0)
  const reduxStore = store || createStore()

  const renderFn = render || rtlRender
  return {
    store: reduxStore,
    ...renderFn(
      <Provider store={reduxStore}>
        <ThemeProvider theme={{ ...DEFAULT_THEME, ...themeProps }}>{ui}</ThemeProvider>
      </Provider>
    )
  }
}

export const mockMatchMedia = () => {
  // Keep track of all media queries made and their callbacks
  // {
  //   <media query>: [ <callback1>, <callback2> ]
  // }
  const mediaQueries = {}

  const mockMatchMedia = jest.fn().mockImplementation(query => {
    if (!mediaQueries[query]) {
      mediaQueries[query] = []
    }

    return {
      matches: true,
      addEventListener: (_, callback) => {
        mediaQueries[query].push(callback)
      }
    }
  })

  const triggerChangeForBreakpoint = (breakpoint, event) => {
    mediaQueries[breakpoint]?.forEach(callback => callback(event))
  }

  hostPageWindow.matchMedia = mockMatchMedia

  return {
    triggerChangeForBreakpoint
  }
}
