import React from 'react'
import { render } from 'utility/testHelpers'
import createStore from 'src/redux/createStore'
import * as chatReselectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors/selectors'
import * as chatActions from 'src/redux/modules/chat'
import { HISTORY_REQUEST_STATUS } from 'constants/chat'
import {
  useMessagesOnMount,
  useHistoryUpdate,
  useAgentTyping,
  useNewMessages
} from '../chattingScreenHooks'
import * as chatHistorySelectors from 'src/redux/modules/chat/chat-history-selectors'
jest.mock('src/redux/modules/chat')

const UseMessagesOnMount = ({ scrollToBottom, isScrollCloseToBottom }) => {
  useMessagesOnMount(scrollToBottom, isScrollCloseToBottom)
  return null
}

const UseHistoryUpdate = ({ scrollContainer }) => {
  useHistoryUpdate(scrollContainer)
  return null
}

const UseAgentTyping = ({ agentTypingRef, scrollContainer, scrollToBottom }) => {
  useAgentTyping(agentTypingRef, scrollContainer, scrollToBottom)
  return null
}

const UseNewMessages = ({ scrollToBottom, isScrollCloseToBottom }) => {
  useNewMessages(scrollToBottom, isScrollCloseToBottom)
  return null
}

const renderHookComponent = (Component, props, options) => {
  const defaultProps = {
    scrollToBottom: jest.fn(),
    isScrollCloseToBottom: true,
    scrollContainer: {},
    agentTypingRef: {}
  }
  return render(<Component {...defaultProps} {...props} />, options)
}

describe('useMessagesOnMount', () => {
  let testContext
  beforeEach(() => {
    testContext = {}
    testContext.store = createStore()
    testContext.dispatchSpy = jest.spyOn(testContext.store, 'dispatch')
    jest.spyOn(chatReselectors, 'getChatsLength').mockReturnValue(10)
    jest.spyOn(chatReselectors, 'hasUnseenAgentMessage').mockReturnValue(true)
  })

  it('calls scrollToBottom when there are chat messages', () => {
    const scrollToBottom = jest.fn()
    renderHookComponent(UseMessagesOnMount, { scrollToBottom }, { store: testContext.store })

    expect(scrollToBottom).toHaveBeenCalled()
  })

  it('calls scrollToBottom when there are chat history messages', () => {
    jest.spyOn(chatReselectors, 'getChatsLength').mockReturnValue(0)
    jest.spyOn(chatHistorySelectors, 'getHistoryLength').mockReturnValue(10)

    const scrollToBottom = jest.fn()
    renderHookComponent(UseMessagesOnMount, { scrollToBottom }, { store: testContext.store })

    expect(scrollToBottom).toHaveBeenCalled()
  })

  it('with no messages does not calls scrollToBottom', () => {
    jest.spyOn(chatReselectors, 'getChatsLength').mockReturnValue(0)
    const scrollToBottom = jest.fn()
    renderHookComponent(UseMessagesOnMount, { scrollToBottom }, { store: testContext.store })

    expect(scrollToBottom).not.toHaveBeenCalled()
  })

  it('calls markAsRead when has unread messagess and close to bottom', () => {
    const scrollToBottom = jest.fn()
    renderHookComponent(UseMessagesOnMount, { scrollToBottom }, { store: testContext.store })

    expect(testContext.dispatchSpy).toHaveBeenCalledWith(chatActions.markAsRead)
  })

  it('does not call markAsRead when no unread meassages', () => {
    jest.spyOn(chatReselectors, 'hasUnseenAgentMessage').mockReturnValue(false)
    renderHookComponent(UseMessagesOnMount, {}, { store: testContext.store })

    expect(testContext.dispatchSpy).not.toHaveBeenCalled()
  })

  it('does not call markAsRead when not close to bottom', () => {
    const isScrollCloseToBottom = false
    renderHookComponent(UseMessagesOnMount, { isScrollCloseToBottom }, { store: testContext.store })

    expect(testContext.dispatchSpy).not.toHaveBeenCalled()
  })
})

describe('useHistoryUpdate', () => {
  it('adjusts the scroll height when historyRequestStatus changes it ', () => {
    const scrollContainer = {
      scrollTop: 10,
      scrollHeight: 50
    }
    jest
      .spyOn(chatHistorySelectors, 'getHistoryRequestStatus')
      .mockReturnValue(HISTORY_REQUEST_STATUS.PENDING)
    const { rerender } = renderHookComponent(UseHistoryUpdate, { scrollContainer })
    scrollContainer.scrollHeight = 100
    jest
      .spyOn(chatHistorySelectors, 'getHistoryRequestStatus')
      .mockReturnValue(HISTORY_REQUEST_STATUS.DONE)
    renderHookComponent(UseHistoryUpdate, { scrollContainer }, { render: rerender })

    expect(scrollContainer.scrollTop).toEqual(60)
  })
})

describe('useAgentTyping', () => {
  it('scrolls if agents starts typing and scroll is at bottom', () => {
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([1, 2])
    const scrollToBottom = jest.fn()
    const agentTypingRef = { offsetHeight: 50 }
    const scrollContainer = { scrollTop: 10, offsetHeight: 0, scrollHeight: 50 }
    renderHookComponent(UseAgentTyping, { agentTypingRef, scrollContainer, scrollToBottom })

    expect(scrollToBottom).toHaveBeenCalled()
  })

  it('does not call scroll when agent is not typing', () => {
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([])
    const scrollToBottom = jest.fn()
    const agentTypingRef = { offsetHeight: 50 }
    const scrollContainer = { scrollTop: 10, offsetHeight: 0, scrollHeight: 50 }
    renderHookComponent(UseAgentTyping, { agentTypingRef, scrollContainer, scrollToBottom })

    expect(scrollToBottom).not.toHaveBeenCalled()
  })

  it('does not call scroo when scroll is not at bottom', () => {
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([])
    const scrollToBottom = jest.fn()
    const agentTypingRef = { offsetHeight: 20 }
    const scrollContainer = { scrollTop: 10, offsetHeight: 0, scrollHeight: 50 }
    renderHookComponent(UseAgentTyping, { agentTypingRef, scrollContainer, scrollToBottom })

    expect(scrollToBottom).not.toHaveBeenCalled()
  })
})

describe('useNewMessages', () => {
  let testContext
  beforeEach(() => {
    testContext = {}
    testContext.store = createStore()
    testContext.dispatchSpy = jest.spyOn(testContext.store, 'dispatch')
    jest.spyOn(chatReselectors, 'getChatsLength').mockReturnValue(2)
  })

  describe('agent message', () => {
    beforeEach(() => {
      jest.spyOn(chatSelectors, 'getLastMessageAuthor').mockReturnValue('agent:name')
    })

    it('calls markAsRead if scroll is close to bottom', () => {
      const scrollToBottom = jest.fn()
      renderHookComponent(UseNewMessages, { scrollToBottom }, { store: testContext.store })

      expect(testContext.dispatchSpy).toHaveBeenCalledWith(chatActions.markAsRead)
    })

    it('calls scrollToBottom if scroll is close to bottom', () => {
      const scrollToBottom = jest.fn()
      renderHookComponent(UseNewMessages, { scrollToBottom })

      expect(scrollToBottom).toHaveBeenCalled()
    })

    it('makes no calls if scroll is not close to bottom', () => {
      const scrollToBottom = jest.fn()
      renderHookComponent(
        UseNewMessages,
        { scrollToBottom, isScrollCloseToBottom: false },
        { store: testContext.store }
      )

      expect(testContext.dispatchSpy).not.toHaveBeenCalled()
      expect(scrollToBottom).not.toHaveBeenCalled()
    })
  })

  describe('visitor message', () => {
    beforeEach(() => {
      jest.spyOn(chatSelectors, 'getLastMessageAuthor').mockReturnValue('visitor')
    })

    it('does not call markAsRead', () => {
      renderHookComponent(UseNewMessages, {}, { store: testContext.store })

      expect(testContext.dispatchSpy).not.toHaveBeenCalled()
    })

    it('calls scrollToBottom if scroll is close to bottom', () => {
      const scrollToBottom = jest.fn()
      renderHookComponent(UseNewMessages, { scrollToBottom })

      expect(scrollToBottom).toHaveBeenCalled()
    })

    it('calls scrollToBottom even if scroll is not close to bottom', () => {
      const scrollToBottom = jest.fn()
      renderHookComponent(UseNewMessages, { isScrollCloseToBottom: false, scrollToBottom })

      expect(scrollToBottom).toHaveBeenCalled()
    })
  })
})
