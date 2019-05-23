import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';

import createStore from 'src/redux/createStore';
import { Provider } from 'react-redux';

import Messages from '../index';

const resultsMessage = {
  type: 'results',
  articles: [{
    id: 123,
    url: 'https://support.zendesk.com/api/v2/help_center/en-us/articles/204231676-Guide-resources.json',
    title: 'title 123',
    body: 'to be filled later 123',
    snippet: 'to be filled later 123'
  }],
  author: 'AUTHOR_BOT',
  sessionID: 1234
};

const textMessage = {
  type: 'text',
  message: 'hello',
  author: 'AUTHOR_VISITOR',
  timestamp: Date.now(),
  sessionID: 1234
};

const channelChoiceMessage = {
  type: 'channelChoice',
  timestamp: Date.now()
};

const primaryFeedbackMessage = {
  type: 'feedback',
  timestamp: Date.now(),
  feedbackType: 'primary'
};

const secondaryFeedbackMessage = {
  type: 'feedback',
  timestamp: Date.now(),
  feedbackType: 'secondary'
};

const botTyping = {
  type: 'botTyping'
};

test('renders expected classes and components with default props for non-visitor messages', () => {
  const messages = [resultsMessage, textMessage, channelChoiceMessage,
    primaryFeedbackMessage, secondaryFeedbackMessage, botTyping];

  const store = createStore();
  const { container } = render(<Provider store={store}>
    <Messages messages={messages} isVisitor={false} />
  </Provider>
  );

  expect(container)
    .toMatchSnapshot();
});

test('renders expected classes and components with default props for visitor messages', () => {
  const messages = [textMessage];

  const store = createStore();
  const { container } = render(<Provider store={store}>
    <Messages messages={messages} isVisitor={true} />
  </Provider>
  );

  expect(container)
    .toMatchSnapshot();
});
