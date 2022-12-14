import { waitFor } from '@testing-library/dom'
import { fireEvent } from '@testing-library/react'
import { screenChanged } from 'classicSrc/embeds/answerBot/actions/root'
import { CONVERSATION_SCREEN } from 'classicSrc/embeds/answerBot/constants'
import { updateWidgetShown } from 'classicSrc/redux/modules/base'
import { http } from 'classicSrc/service/transport'
import { render } from 'classicSrc/util/testHelpers'
import AnswerBot from '../../index'

jest.mock('classicSrc/service/transport')

jest.useFakeTimers()
Date.now = jest.fn(() => 1559097574000)

const successfulResponse = (options) => options.callbacks.done()
const resolution = jest.fn(successfulResponse)
const viewed = jest.fn(successfulResponse)
const rejection = jest.fn(successfulResponse)
const interaction = jest.fn((options) => {
  options.callbacks.done({
    body: {
      deflection: {
        id: 360060729351,
        auth_token: 'eyJ',
      },
      deflection_articles: [
        {
          id: 360145219991,
          title: 'The first article',
          html_url:
            'https://answerbot.zendesk.com/hc/en-us/articles/360002874212-Best-practices-Training-Answer-Bot-to-find-the-right-articles-more-easily',
          url:
            'https://answerbot.zendesk.com/api/v2/help_center/en-us/articles/360002874212-Best-practices-Training-Answer-Bot-to-find-the-right-articles-more-easily.json',
          label_names: [],
          body: 'this is the first body',
          article_id: 360002874212,
          locale: 'en-us',
          brand_id: 114094997791,
          score: 0.45848482847213745,
          html_body: '<div>first article</div>',
          snippet: 'this is a snippet',
        },
        {
          id: 360145219992,
          title: 'The second article',
          html_url: 'https://answerbot.zendesk.com/hc/en-us/articles/2nd-article',
          url: 'https://answerbot.zendesk.com/api/v2/help_center/en-us/articles/2nd-article',
          label_names: [],
          body: 'this is the second body',
          article_id: 360002874213,
          locale: 'en-us',
          brand_id: 114094997791,
          score: 0.8,
          html_body: '<div>second article</div>',
          snippet: 'this is the second snippet',
        },
        {
          id: 360145219993,
          title: 'The third article',
          html_url: 'https://answerbot.zendesk.com/hc/en-us/articles/erd-article',
          url: 'https://answerbot.zendesk.com/api/v2/help_center/en-us/articles/3rd-article',
          label_names: [],
          body: 'this is the third body',
          article_id: 360002874214,
          locale: 'en-us',
          brand_id: 114094997791,
          score: 0.8,
          html_body: '<div>third article</div>',
          snippet: 'this is the third snippet',
        },
      ],
      model_meta: {
        version: '00040300',
        name: 'megamike',
        language: 'en',
      },
      interaction_access_token: 'eyJ0eXAi',
    },
  })
})

const setupAnswerBotServerMocks = () => {
  http.send = (options) => {
    switch (options.path) {
      case '/api/v2/answer_bot/interaction?include=html_body':
        interaction(options)
        break
      case '/api/v2/answer_bot/viewed':
        viewed(options)
        break
      case '/api/v2/answer_bot/rejection':
        rejection(options)
        break
      case '/api/v2/answer_bot/resolution':
        resolution(options)
        break
      default:
        throw `Unrecognized http request received! Params are ${options}`
    }
  }
}

test('integration', async () => {
  const utils = render(<AnswerBot />)
  const textArea = utils.getByPlaceholderText('Type your question here...')

  utils.store.dispatch(updateWidgetShown(true))

  setupAnswerBotServerMocks()

  // Greeting isn't available immediately
  expect(utils.queryByText('Hello.')).not.toBeInTheDocument()

  // Let the delay kick in
  jest.runAllTimers()

  // Greeting is now available
  await waitFor(() => expect(utils.queryByText('Hello.')).toBeInTheDocument())

  // Type in a question
  fireEvent.change(textArea, { target: { value: 'Help me' } })
  fireEvent.keyDown(textArea, { key: 'Enter', keyCode: 13 })

  fireEvent.change(textArea, { target: { value: 'do something' } })
  fireEvent.keyDown(textArea, { key: 'Enter', keyCode: 13 })

  // question only submitted with an advance of 3000 ms
  Date.now = jest.fn(() => 1559097577000)
  // Let the bot typing animation finish
  jest.advanceTimersByTime(1000)

  // Answer Bot API has been hit
  expect(interaction).toHaveBeenCalledWith(
    expect.objectContaining({
      params: expect.objectContaining({
        enquiry: 'Help me do something',
      }),
    })
  )

  // Let the animation kick in
  jest.advanceTimersByTime(1000)

  // Article titles are displayed
  expect(utils.queryByText('The first article')).toBeInTheDocument()
  expect(utils.queryByText('The second article')).toBeInTheDocument()
  expect(utils.queryByText('The third article')).toBeInTheDocument()

  // Article snippets are displayed
  expect(utils.getByText('this is a snippet')).toBeInTheDocument()
  expect(utils.getByText('this is the second snippet')).toBeInTheDocument()
  expect(utils.getByText('this is the third snippet')).toBeInTheDocument()

  // Click the first article
  fireEvent.click(utils.getByText('The first article'))

  // Answer Bot tracking API has been hit
  expect(viewed).toHaveBeenCalledWith(
    expect.objectContaining({
      params: expect.objectContaining({
        article_id: 360002874212, // eslint-disable-line camelcase
      }),
    })
  )

  // Switched to article screen, hence the greeting is gone
  expect(utils.queryByText('Hello.')).not.toBeInTheDocument()

  // The article content is displayed
  expect(utils.getByText('first article')).toBeInTheDocument()

  // The feedback popup isn't available immediately
  expect(utils.queryByText('Does this article answer your question?')).not.toBeInTheDocument()

  // After 1 second...
  jest.advanceTimersByTime(1000)

  // The feedback popup is available
  expect(utils.queryByText('Does this article answer your question?')).toBeInTheDocument()

  // Click no
  fireEvent.click(utils.getByText('No, I need help'))

  // Displays the reason
  expect(utils.getByText('Please tell us why.')).toBeInTheDocument()

  // Click a reason
  fireEvent.click(utils.getByText("It's not related to my question"))

  // Answer Bot API has been hit
  expect(rejection).toHaveBeenCalledWith(
    expect.objectContaining({
      params: expect.objectContaining({
        article_id: 360002874212, // eslint-disable-line camelcase
        reason_id: 1, // eslint-disable-line camelcase
      }),
    })
  )

  // Switched back to conversation screen
  expect(utils.queryByText('Hello.')).toBeInTheDocument()

  // Displays a new message because question is still unresolved
  expect(utils.getByText('I see. Your question is still unresolved.')).toBeInTheDocument()

  // Click the first article again
  fireEvent.click(utils.getByText('The first article'))

  // Sanity check that we're in the article screen
  expect(utils.getByText('first article')).toBeInTheDocument()

  // The feedback popup is not shown again, because user has already given feedback for this article
  expect(utils.queryByText('Does this article answer your question?')).not.toBeInTheDocument()

  // Go back to conversation screen
  utils.store.dispatch(screenChanged(CONVERSATION_SCREEN))

  // Click the second article
  fireEvent.click(utils.getByText('The second article'))

  // The article content is displayed
  expect(utils.getByText('second article')).toBeInTheDocument()

  // Go back to conversation screen
  utils.store.dispatch(screenChanged(CONVERSATION_SCREEN))

  // The in-conversation feedback is displayed
  expect(
    utils.queryByText('Did the article you viewed help to answer your question?')
  ).toBeInTheDocument()

  // Click in-conversation feedback
  fireEvent.click(utils.getByText('No, I need help'))

  // Click in-conversation feedback reason
  fireEvent.click(utils.getByText("It's related, but it didn't answer my question"))

  // Answer Bot API has been hit
  expect(rejection).toHaveBeenCalledWith(
    expect.objectContaining({
      params: expect.objectContaining({
        article_id: 360002874213, // eslint-disable-line camelcase
        reason_id: 2, // eslint-disable-line camelcase
      }),
    })
  )

  // Click the third article
  fireEvent.click(utils.getByText('The third article'))

  // The article content is displayed
  expect(utils.getByText('third article')).toBeInTheDocument()

  // The feedback is not yet displayed
  expect(utils.queryByText('Yes')).not.toBeInTheDocument()

  // After 1 second...
  jest.advanceTimersByTime(1000)

  // Click yes on feedback
  fireEvent.click(utils.getByText('Yes'))

  expect(resolution).toHaveBeenCalledWith(
    expect.objectContaining({
      params: expect.objectContaining({
        article_id: 360002874214, // eslint-disable-line camelcase
      }),
    })
  )

  // Go back to conversation screen
  utils.store.dispatch(screenChanged(CONVERSATION_SCREEN))

  // Let animation kick in
  jest.advanceTimersByTime(1000)

  // Displays a new message because question is now resolved
  expect(utils.getByText('Nice. Knowledge is power.')).toBeInTheDocument()
})
