import _ from 'lodash'
import { render, fireEvent } from 'react-testing-library'
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
    expect(actions.botFeedbackMessage).toHaveBeenNthCalledWith(1, 'Nice. Knowledge is power.')
    expect(actions.botFeedbackMessage).toHaveBeenNthCalledWith(
      2,
      "If there's anything else I can find for you, just type another question."
    )
    expect(actions.botUserMessage).toHaveBeenCalledWith('Yes')
  })
})

describe('on no click', () => {
  it('fires the expected actions', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('No, I need help'))
    expect(actions.botFeedback).toHaveBeenCalledWith('secondary')
    expect(actions.botFeedbackMessage).toHaveBeenCalledWith('Please tell us why.')
    expect(actions.botUserMessage).toHaveBeenCalledWith('No, I need help')
  })
})
