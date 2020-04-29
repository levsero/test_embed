import { render } from '@testing-library/react'
import React from 'react'

import { Component as ConversationPage } from '../index'

const actions = Object.freeze({
  conversationScreenClosed: jest.fn(),
  updateBackButtonVisibility: jest.fn()
})

const renderComponent = (props = {}) => {
  const defaultProps = {
    messageGroups: {},
    actions
  }

  const componentProps = {
    ...defaultProps,
    ...props
  }

  return render(<ConversationPage {...componentProps} />)
}

test('renders messages', () => {
  const { container } = renderComponent()

  expect(container.querySelector('div')).toBeInTheDocument()
})

test('calls updateBackButtonVisibility on mount', () => {
  renderComponent()

  expect(actions.updateBackButtonVisibility).toHaveBeenCalledWith(false)
})

test('calls conversationScreenClosed on unmount', () => {
  const { unmount } = renderComponent()

  unmount()
  expect(actions.conversationScreenClosed).toHaveBeenCalled()
})