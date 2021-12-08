import { fireEvent } from '@testing-library/react'
import * as articleActions from 'classicSrc/embeds/answerBot/actions/article/article-dismissed'
import * as botActions from 'classicSrc/embeds/answerBot/actions/root/bot'
import * as sessionActions from 'classicSrc/embeds/answerBot/actions/sessions/session-fallback-suggested'
import { render } from 'classicSrc/util/testHelpers'
import _ from 'lodash'
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

test('renders the expected elements', () => {
  const { queryByText } = renderComponent()

  expect(queryByText("It's related, but it didn't answer my question")).toBeInTheDocument()
  expect(queryByText("It's not related to my question")).toBeInTheDocument()
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
