import { IdManager } from '@zendeskgarden/react-selection'
import { render as rtlRender } from '@testing-library/react'
import ThemeProvider from 'src/ThemeProvider'

export const render = (ui, { render, themeProps = {} } = {}) => {
  IdManager.setIdCounter(0)

  const renderFn = render || rtlRender
  return {
    ...renderFn(<ThemeProvider theme={themeProps}>{ui}</ThemeProvider>)
  }
}
