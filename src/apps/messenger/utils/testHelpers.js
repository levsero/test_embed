import React from 'react'
import { IdManager } from '@zendeskgarden/react-selection'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import createStore from 'src/apps/messenger/store'

export const render = (ui, { render, store, themeProps = {} } = {}) => {
  IdManager.setIdCounter(0)
  const reduxStore = store || createStore()

  const renderFn = render || rtlRender
  return {
    ...renderFn(
      <Provider store={reduxStore}>
        <ThemeProvider theme={{ ...DEFAULT_THEME, ...themeProps }}>{ui}</ThemeProvider>
      </Provider>
    )
  }
}
