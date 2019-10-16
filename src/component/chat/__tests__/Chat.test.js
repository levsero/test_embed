import { render } from '@testing-library/react'
import React from 'react'
import { createStore } from 'redux'
import { ThemeProvider } from '@zendeskgarden/react-theming'

import { ContextProvider } from 'src/util/testHelpers'
import reducer from 'src/redux/modules/reducer'
import Chat from '../Chat'
import * as selectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import * as simpleSelectors from 'src/redux/modules/chat/chat-selectors/selectors'
import { TEST_IDS } from 'src/constants/shared'

let showOfflineChatMock, getShowChatHistoryMock

beforeEach(() => {
  showOfflineChatMock = jest.spyOn(selectors, 'getShowOfflineChat')
  getShowChatHistoryMock = jest.spyOn(simpleSelectors, 'getShowChatHistory')
})

afterEach(() => {
  showOfflineChatMock.mockRestore()
  getShowChatHistoryMock.mockRestore()
})

const renderChat = (fullscreen = false) => {
  const store = createStore(reducer)

  return render(
    <ContextProvider store={store}>
      <ThemeProvider>
        <Chat updateChatBackButtonVisibility={() => {}} fullscreen={fullscreen} />
      </ThemeProvider>
    </ContextProvider>
  )
}

describe('show offline chat is true', () => {
  beforeEach(() => {
    showOfflineChatMock.mockReturnValue(true)
  })

  it('renders the offline form', () => {
    expect(renderChat().getByText('Sorry, we are not online at the moment')).toBeInTheDocument()
  })
})

describe('show offline chat is false', () => {
  beforeEach(() => {
    showOfflineChatMock.mockReturnValue(false)
  })

  it('renders the chatting screen', () => {
    expect(renderChat().getByText('Live Support')).toBeInTheDocument()
  })

  describe('when is Fullscreen', () => {
    it('offline form contains fullscreen style class', () => {
      expect(renderChat(true).getByTestId(TEST_IDS.SCROLL_CONTAINER)).toHaveClass(
        'desktopFullscreen'
      )
    })
  })

  describe('when is not fullscreen', () => {
    it('offline form does not contain fullscreen style class', () => {
      expect(renderChat(false).getByTestId(TEST_IDS.SCROLL_CONTAINER)).not.toHaveClass(
        'desktopFullscreen'
      )
    })
  })
})

describe('when showChatHistory is true', () => {
  beforeEach(() => {
    getShowChatHistoryMock.mockReturnValue(true)
  })

  it('does not render the chatting screen', () => {
    expect(renderChat().queryByText('LiveSupport')).toBeNull()
  })

  it('does not render the offline screen', () => {
    expect(renderChat().queryByText('Sorry, we are not online at the moment')).toBeNull()
  })

  it('does render the ChatHistory screen', () => {
    expect(renderChat().getByText('Chat with us')).toBeInTheDocument()
  })
})

describe('when showChatHistory is false', () => {
  beforeEach(() => {
    getShowChatHistoryMock.mockReturnValue(false)
  })

  it('does not render the ChatHistory screen', () => {
    expect(renderChat().queryByText('Past Chats')).toBeNull()
  })
})
