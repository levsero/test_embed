import _ from 'lodash'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { Component as SecondaryFeedback } from '../SecondaryFeedback'

const actions = Object.freeze({
  articleDismissed: jest.fn(),
  botUserMessage: jest.fn(),
  botFeedbackMessage: jest.fn(),
  sessionFallback: jest.fn(),
  botFallbackMessage: jest.fn()
})

const renderComponent = (props = {}) => {
  const componentProps = _.merge({}, { actions }, props)

  return render(<SecondaryFeedback {...componentProps} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

describe('actions', () => {
  it('fires the expected actions', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText("It's not related to my question"))

    expect(actions.botUserMessage).toHaveBeenCalledWith("It's not related to my question")
    expect(actions.articleDismissed).toHaveBeenCalledWith(1)
    expect(actions.sessionFallback).toHaveBeenCalled()
    expect(actions.botFeedbackMessage).toHaveBeenNthCalledWith(
      1,
      'I see. Your question is still unresolved.'
    )
    expect(actions.botFallbackMessage).toHaveBeenCalledWith(true)
  })
})
