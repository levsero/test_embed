import _ from 'lodash'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

import { Component as PrimaryFeedback } from '../PrimaryFeedback'

const actions = Object.freeze({
  sessionResolved: jest.fn(),
  botUserMessage: jest.fn(),
  botFeedbackMessage: jest.fn(),
  botFeedback: jest.fn()
})

const renderComponent = (props = {}) => {
  const componentProps = _.merge({}, { actions }, props)

  return render(<PrimaryFeedback {...componentProps} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

describe('on yes click', () => {
  it('fires the expected actions', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('Yes'))
    expect(actions.sessionResolved).toHaveBeenCalled()
    expect(actions.botFeedbackMessage).toHaveBeenNthCalledWith(
      1,
      'embeddable_framework.answerBot.msg.yes_acknowledgement'
    )
    expect(actions.botFeedbackMessage).toHaveBeenNthCalledWith(
      2,
      'embeddable_framework.answerBot.msg.prompt_again_after_yes'
    )
    expect(actions.botUserMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.article.feedback.yes'
    )
  })
})

describe('on no click', () => {
  it('fires the expected actions', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('No, I need help'))
    expect(actions.botFeedback).toHaveBeenCalledWith('secondary')
    expect(actions.botFeedbackMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.article.feedback.no.reason.title'
    )
    expect(actions.botUserMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.article.feedback.no.need_help'
    )
  })
})
