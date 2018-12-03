import 'utility/i18nTestHelper';
import { render } from 'react-testing-library';
import React from 'react';

import { createStore } from 'redux';
import { Provider } from 'react-redux';

import reducer from 'src/redux/modules/reducer';
import * as selectors from 'src/redux/modules/chat/chat-selectors';
import Chat from '../Chat';

let showOfflineChatMock;

beforeEach(() => {
  showOfflineChatMock = jest.spyOn(selectors, 'getShowOfflineChat');
});

afterEach(() => {
  showOfflineChatMock.mockRestore();
});

const renderChat = (fullscreen = false) => {
  const store = createStore(reducer);

  return render(
    <Provider store={store}>
      <Chat
        getFrameContentDocument={() => {}}
        updateChatBackButtonVisibility={() => {}}
        fullscreen={fullscreen}
      />
    </Provider>,
  );
};

describe('show offline chat is true', () => {
  beforeEach(() => {
    showOfflineChatMock.mockReturnValue(true);
  });

  it('renders the offline form', () => {
    expect(renderChat().getByText('Sorry, we are not online at the moment'))
      .toBeInTheDocument();
  });

  describe('when is Fullscreen', () => {
    it('offline form contains fullscreen style class', () => {
      expect(renderChat(true).getByTestId('scrollcontainer'))
        .toHaveClass('desktopFullscreen');
    });
  });

  describe('when is not fullscreen', () => {
    it('offline form does not contain fullscreen style class', () => {
      expect(renderChat(false).getByTestId('scrollcontainer'))
        .not.toHaveClass('desktopFullscreen');
    });
  });
});

describe('show offline chat is false', () => {
  beforeEach(() => {
    showOfflineChatMock.mockReturnValue(false);
  });

  it('renders the chatting screen', () => {
    expect(renderChat().getByText('Live Support'))
      .toBeInTheDocument();
  });

  describe('when is Fullscreen', () => {
    it('offline form contains fullscreen style class', () => {
      expect(renderChat(true).getByTestId('scrollcontainer'))
        .toHaveClass('desktopFullscreen');
    });
  });

  describe('when is not fullscreen', () => {
    it('offline form does not contain fullscreen style class', () => {
      expect(renderChat(false).getByTestId('scrollcontainer'))
        .not.toHaveClass('desktopFullscreen');
    });
  });
});
