import ThemeProvider from 'src/ThemeProvider'
import { useEffect } from 'react'

export const decorators = [
  (Story, storyContext) => {
    useEffect(() => {
      document
        .querySelector('#root')
        ?.firstChild?.firstChild?.setAttribute?.('dir', storyContext.globals.localeDir)
    })

    return (
      <ThemeProvider rtl={storyContext.globals.localeDir === 'rtl'}>
        <Story />
      </ThemeProvider>
    )
  }
]

export const globalTypes = {
  localeDir: {
    name: 'Locale direction',
    description: 'Locale direction',
    defaultValue: 'ltr',
    toolbar: {
      title: 'Locale direction',
      items: ['ltr', 'rtl']
    }
  }
}
