import { render } from 'react-testing-library';
import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from 'src/redux/modules/reducer';
import Chat from '../Chat';

const selectors = require('src/redux/modules/chat/chat-selectors');
const showOfflineChatMock = jest.fn();

selectors.getShowOfflineChat = showOfflineChatMock;

const renderChat = () => {
  const store = createStore(reducer);

  return render(
    <Provider store={store}>
      <Chat
        getFrameContentDocument={() => {}}
        updateChatBackButtonVisibility={() => {}}
      />
    </Provider>,
  );
};

describe('show offline chat is true', () => {
  let rendered;

  beforeEach(() => {
    showOfflineChatMock.mockReturnValue(true);
    rendered = renderChat();
  });

  it('renders the offline form', () => {
    expect(rendered.getByText('Sorry, we are not online at the moment'))
      .toBeInTheDocument();
  });
});

describe('show offline chat is false', () => {
  let rendered;

  beforeEach(() => {
    showOfflineChatMock.mockReturnValue(false);

    rendered = renderChat();
  });

  it('renders the chatting screen', () => {
    expect(rendered.getByText('Live Support'))
      .toBeInTheDocument();
  });
});
