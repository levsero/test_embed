import React from 'react'
import { IdManager } from '@zendeskgarden/react-selection'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import createStore from 'src/apps/messenger/store'
import configureMockStore from 'redux-mock-store'

const mockStore = configureMockStore()

export const render = (ui, { render, store, state, themeProps = {} } = {}) => {
  IdManager.setIdCounter(0)
  if (state) {
    store = mockStore(state)
  }
  const reduxStore = store || createStore(state)

  const renderFn = render || rtlRender
  return {
    ...renderFn(
      <Provider store={reduxStore}>
        <ThemeProvider theme={{ ...DEFAULT_THEME, ...themeProps }}>{ui}</ThemeProvider>
      </Provider>
    )
  }
}
