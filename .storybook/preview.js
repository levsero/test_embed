import React from 'react'
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' }
}
import { Provider } from 'react-redux'
import createStore from 'src/apps/messenger/store'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import { i18n } from 'service/i18n'

const reduxStore = createStore()
i18n.setLocale()
export const decorators = [
  Story => (
    <Provider store={reduxStore}>
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    </Provider>
  )
]
