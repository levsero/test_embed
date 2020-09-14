import React from 'react'
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}
import { Provider } from 'react-redux'
import createStore from 'src/apps/messenger/store'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import { i18n } from 'service/i18n'
import { createGlobalStyle } from 'styled-components'

i18n.setLocale()
const ScrollOverride = createGlobalStyle`
  html {
     overflow-y: initial;
  }
`
export const decorators = [
  (Story, args) => {
    const reduxStore = createStore()
    args.args.actions?.forEach(action => {
      reduxStore.dispatch(action)
    })

    return (
      <Provider store={reduxStore}>
        <ThemeProvider>
          <ScrollOverride />
          <Story />
        </ThemeProvider>
      </Provider>
    )
  }
]
