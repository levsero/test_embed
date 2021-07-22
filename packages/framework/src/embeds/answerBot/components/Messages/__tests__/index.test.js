import { styleSheetSerializer } from 'jest-styled-components/serializer'
import snapshotDiff from 'snapshot-diff'
import * as selectors from 'embeds/helpCenter/selectors'
import { TEST_IDS } from 'src/constants/shared'
import { render } from 'utility/testHelpers'
import Messages from '../index'

snapshotDiff.setSerializers([...snapshotDiff.defaultSerializers, styleSheetSerializer])
expect.addSnapshotSerializer(styleSheetSerializer)

const resultsMessage = {
  type: 'results',
  articles: [
    {
      id: 123,
      url:
        'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
      title: 'title 123',
      body: 'to be filled later 123',
      snippet: 'to be filled later 123',
    },
  ],
  author: 'AUTHOR_BOT',
  sessionID: 1234,
}

const contextualSearchResultsMessage = {
  type: 'contextualSearchResults',
}

const textMessage = {
  type: 'text',
  message: 'hello',
  author: 'AUTHOR_VISITOR',
  timestamp: Date.now(),
  sessionID: 1234,
}

const channelChoiceMessage = {
  type: 'channelChoice',
  timestamp: Date.now(),
}

const primaryFeedbackMessage = {
  type: 'feedback',
  timestamp: Date.now(),
  feedbackType: 'primary',
}

const secondaryFeedbackMessage = {
  type: 'feedback',
  timestamp: Date.now(),
  feedbackType: 'secondary',
}

const botTyping = {
  type: 'botTyping',
}

test('renders expected classes and components with default props for non-visitor messages', () => {
  const messages = [
    contextualSearchResultsMessage,
    resultsMessage,
    textMessage,
    channelChoiceMessage,
    primaryFeedbackMessage,
    secondaryFeedbackMessage,
    botTyping,
  ]

  jest.spyOn(selectors, 'getSearchedArticles').mockReturnValue([
    {
      title: 'contextual search results',
      body: 'body of contextual search results',
    },
  ])
  const utils = render(<Messages messages={[]} isVisitor={false} />)
  const { container } = render(<Messages messages={messages} isVisitor={false} />)
  expect(snapshotDiff(utils.container, container)).toMatchSnapshot()
})

test('renders expected classes and components with default props for visitor messages', () => {
  const messages = [textMessage]
  const { getByTestId } = render(<Messages messages={messages} isVisitor={true} />)

  expect(getByTestId(TEST_IDS.CHAT_MSG_USER).textContent).toEqual('hello')
})
