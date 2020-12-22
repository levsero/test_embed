import { render as rtlRender } from '@testing-library/react'
import ThemeProvider from 'src/ThemeProvider'

export const render = (ui, { render, themeProps = {} } = {}) => {
  const renderFn = render || rtlRender
  return {
    ...renderFn(<ThemeProvider theme={themeProps}>{ui}</ThemeProvider>)
  }
}
