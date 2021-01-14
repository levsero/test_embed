import React from 'react'
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}
import { Provider } from 'react-redux'
import createStore from 'src/apps/messenger/store'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import { i18n } from 'src/apps/webWidget/services/i18n'
import { createGlobalStyle } from 'styled-components'
import { rem } from 'polished'
import { baseFontSize } from 'src/apps/messenger/constants'

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
          <div
            style={{
              width: rem('380px', baseFontSize),
              height: rem('700px', baseFontSize),
              border: '1px solid black'
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      </Provider>
    )
  }
]
