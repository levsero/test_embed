import _ from 'lodash'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import React from 'react'

import * as botActions from 'src/embeds/answerBot/actions/root/bot'
import * as sessionActions from 'src/redux/modules/answerBot/sessions/actions/session-fallback-suggested'
import * as articleActions from 'src/embeds/answerBot/actions/article/article-dismissed'

import SecondaryFeedback from '../SecondaryFeedback'

const renderComponent = (props = {}) => {
  const componentProps = _.merge({ locale: 'en-US' }, props)

  jest.spyOn(botActions, 'botFeedbackMessage')
  jest.spyOn(botActions, 'botUserMessage')
  jest.spyOn(botActions, 'botFallbackMessage')
  jest.spyOn(sessionActions, 'sessionFallback').mockImplementation(() => () => {})
  jest.spyOn(articleActions, 'articleDismissed').mockImplementation(() => () => {})

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

    expect(botActions.botUserMessage).toHaveBeenCalledWith(
      'embeddable_framework.answerBot.article.feedback.no.reason.unrelated'
    )
    expect(articleActions.articleDismissed).toHaveBeenCalledWith(1)
    expect(sessionActions.sessionFallback).toHaveBeenCalled()
    expect(botActions.botFeedbackMessage).toHaveBeenNthCalledWith(
      1,
      'embeddable_framework.answerBot.msg.no_acknowledgement'
    )
    expect(botActions.botFallbackMessage).toHaveBeenCalledWith(true)
  })
})
