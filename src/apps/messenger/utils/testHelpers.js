import React from 'react'
import { IdManager } from '@zendeskgarden/react-selection'
import { render as rtlRender } from '@testing-library/react'
import { Provider } from 'react-redux'
import createStore from 'src/apps/messenger/store'

export const render = (ui, { render, store } = {}) => {
  IdManager.setIdCounter(0)
  const reduxStore = store || createStore()

  const renderFn = render || rtlRender
  return {
    ...renderFn(<Provider store={reduxStore}>{ui}</Provider>)
  }
}
