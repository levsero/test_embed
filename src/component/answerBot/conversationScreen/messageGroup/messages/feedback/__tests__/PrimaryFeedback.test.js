import _ from 'lodash'
import { fireEvent } from '@testing-library/react'
import React from 'react'
import { render } from 'src/util/testHelpers'
import * as botActions from 'src/redux/modules/answerBot/root/actions/bot'
import * as sessionActions from 'src/redux/modules/answerBot/sessions/actions/session-resolved'

import PrimaryFeedback from '../PrimaryFeedback'

const renderComponent = (props = {}) => {
  const componentProps = _.merge({}, props)

  jest.spyOn(botActions, 'botUserMessage')
  jest.spyOn(botActions, 'botFeedbackMessage')
  jest.spyOn(botActions, 'botFeedback')
  jest.spyOn(sessionActions, 'sessionResolved').mockImplementation(() => () => {})

  return render(<PrimaryFeedback {...componentProps} />)
}

test('renders the expected classes', () => {
  const { container } = renderComponent()

  expect(container).toMatchSnapshot()
})

describe('on yes click', () => {
  it('fires the expected actions', () => {
    const result = renderComponent()
    const { getByText } = result

    fireEvent.click(getByText('Yes'))
    expect(sessionActions.sessionResolved).toHaveBeenCalled()
    expect(botActions.botFeedbackMessage).toHaveBeenNthCalledWith(
      1,
      'embeddable_framework.answerBot.msg.yes_acknowledgement'
    )
    expect(botActions.botFeedbackMessage).toHaveBeenNthCalledWith(
      2,
      'embeddable_framework.answerBot.msg.prompt_again_after_yes'
    )
    expect(botActions.botUserMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.article.feedback.yes'
    )
  })
})

describe('on no click', () => {
  it('fires the expected actions', () => {
    const { getByText } = renderComponent()

    fireEvent.click(getByText('No, I need help'))
    expect(botActions.botFeedback).toHaveBeenCalledWith('secondary')
    expect(botActions.botFeedbackMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.article.feedback.no.reason.title'
    )
    expect(botActions.botUserMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.article.feedback.no.need_help'
    )
  })
})
