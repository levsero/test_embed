import { render as tlRender } from '@testing-library/react'
import ThemeProvider from 'src/ThemeProvider'

const render = (ui, { render, themeProps = {} } = {}) => {
  const renderFn = render || tlRender

  return renderFn(<ThemeProvider {...themeProps}>{ui}</ThemeProvider>)
}

export default render
