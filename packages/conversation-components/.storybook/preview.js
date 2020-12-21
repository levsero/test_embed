import ThemeProvider from '../src/ThemeProvider'

export const decorators = [
  Story => {
    return (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    )
  }
]
