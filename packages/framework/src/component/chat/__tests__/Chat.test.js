import * as reselectors from 'src/embeds/chat/selectors/reselectors'
import * as simpleSelectors from 'src/embeds/chat/selectors/selectors'
import { render } from 'src/util/testHelpers'
import Chat from '../Chat'

let showOfflineChatMock, getShowChatHistoryMock, hasChatSdkConnected

beforeEach(() => {
  showOfflineChatMock = jest.spyOn(reselectors, 'getShowOfflineChat')
  getShowChatHistoryMock = jest.spyOn(simpleSelectors, 'getShowChatHistory')
  hasChatSdkConnected = jest.spyOn(simpleSelectors, 'getHasChatSdkConnected')
})

afterEach(() => {
  showOfflineChatMock.mockRestore()
  getShowChatHistoryMock.mockRestore()
  hasChatSdkConnected.mockRestore()
})

const renderChat = (fullscreen = false) => {
  return render(<Chat updateChatBackButtonVisibility={() => {}} fullscreen={fullscreen} />)
}

describe('chat sdk has not connected', () => {
  beforeEach(() => {
    hasChatSdkConnected.mockReturnValue(false)
  })

  it('renders the loading page', () => {
    expect(renderChat().container).toMatchSnapshot()
  })
})

describe('show offline chat is true', () => {
  beforeEach(() => {
    hasChatSdkConnected.mockReturnValue(true)
    showOfflineChatMock.mockReturnValue(true)
  })

  it('renders the offline form', () => {
    expect(renderChat().getByText('Sorry, we are not online at the moment')).toBeInTheDocument()
  })
})

describe('show offline chat is false', () => {
  beforeEach(() => {
    hasChatSdkConnected.mockReturnValue(true)
    showOfflineChatMock.mockReturnValue(false)
  })

  it('renders the chatting screen', () => {
    expect(renderChat().getByText('Live Support')).toBeInTheDocument()
  })
})

describe('when showChatHistory is true', () => {
  beforeEach(() => {
    hasChatSdkConnected.mockReturnValue(true)
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
    hasChatSdkConnected.mockReturnValue(true)
    getShowChatHistoryMock.mockReturnValue(false)
  })

  it('does not render the ChatHistory screen', () => {
    expect(renderChat().queryByText('Past Chats')).toBeNull()
  })
})
