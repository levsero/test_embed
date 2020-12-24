import { render as rtlRender } from '@testing-library/react'
import ThemeProvider from 'src/ThemeProvider'

const render = (ui, { render, themeProps = {} } = {}) => {
  const renderFn = render || rtlRender

  return renderFn(<ThemeProvider {...themeProps}>{ui}</ThemeProvider>)
}

export default render
