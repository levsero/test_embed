import { rem } from 'polished'
import { Provider } from 'react-redux'
import { createGlobalStyle } from 'styled-components'
import { baseFontSize } from '@zendesk/web-widget-messenger/constants'
import ThemeProvider from '@zendesk/web-widget-messenger/features/themeProvider'
import createStore from '@zendesk/web-widget-messenger/store'
import { i18n } from 'src/apps/webWidget/services/i18n'

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}

i18n.setLocale()
const ScrollOverride = createGlobalStyle`
  html {
     overflow-y: initial;
  }
`
export const decorators = [
  (Story, args) => {
    const reduxStore = createStore()
    args.args.actions?.forEach((action) => {
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
              border: '1px solid black',
            }}
          >
            <Story />
          </div>
        </ThemeProvider>
      </Provider>
    )
  },
]
