import { IdManager } from '@zendeskgarden/react-selection'
import { render as rtlRender } from '@testing-library/react'

export const render = (ui, { render } = {}) => {
  IdManager.setIdCounter(0)
  const renderFn = render || rtlRender
  return {
    ...renderFn(ui)
  }
}
