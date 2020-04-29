import { render } from 'utility/testHelpers'
import React from 'react'

import Messages from '../index'

import * as selectors from 'embeds/helpCenter/selectors'

const resultsMessage = {
  type: 'results',
  articles: [
    {
      id: 123,
      url:
        'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
      title: 'title 123',
      body: 'to be filled later 123',
      snippet: 'to be filled later 123'
    }
  ],
  author: 'AUTHOR_BOT',
  sessionID: 1234
}

const contextualSearchResultsMessage = {
  type: 'contextualSearchResults'
}

const textMessage = {
  type: 'text',
  message: 'hello',
  author: 'AUTHOR_VISITOR',
  timestamp: Date.now(),
  sessionID: 1234
}

const channelChoiceMessage = {
  type: 'channelChoice',
  timestamp: Date.now()
}

const primaryFeedbackMessage = {
  type: 'feedback',
  timestamp: Date.now(),
  feedbackType: 'primary'
}

const secondaryFeedbackMessage = {
  type: 'feedback',
  timestamp: Date.now(),
  feedbackType: 'secondary'
}

const botTyping = {
  type: 'botTyping'
}

test('renders expected classes and components with default props for non-visitor messages', () => {
  const messages = [
    contextualSearchResultsMessage,
    resultsMessage,
    textMessage,
    channelChoiceMessage,
    primaryFeedbackMessage,
    secondaryFeedbackMessage,
    botTyping
  ]

  jest.spyOn(selectors, 'getSearchedArticles').mockReturnValue([
    {
      title: 'contextual search results',
      body: 'body of contextual search results'
    }
  ])
  const { container } = render(<Messages messages={messages} isVisitor={false} />)
  expect(container).toMatchSnapshot()
})

test('renders expected classes and components with default props for visitor messages', () => {
  const messages = [textMessage]
  const { container } = render(<Messages messages={messages} isVisitor={true} />)
  expect(container).toMatchSnapshot()
})