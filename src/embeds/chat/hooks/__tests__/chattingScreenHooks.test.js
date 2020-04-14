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

const UseHistoryUpdate = ({ scrollContainer, scrollToBottom }) => {
  useHistoryUpdate(scrollContainer, scrollToBottom)
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
  it('calls scrollToBottom', () => {
    const scrollToBottom = jest.fn()
    renderHookComponent(UseMessagesOnMount, { scrollToBottom })

    expect(scrollToBottom).toHaveBeenCalled()
  })

  it('calls markAsRead', () => {
    const store = createStore()
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    renderHookComponent(UseMessagesOnMount, {}, { store: store })

    expect(dispatchSpy).toHaveBeenCalledWith(chatActions.markAsRead)
  })
})

describe('useHistoryUpdate', () => {
  const setHistoryRequestStatus = status => {
    jest.spyOn(chatHistorySelectors, 'getHistoryRequestStatus').mockReturnValue(status)
  }
  it('adjusts the scroll height when historyRequestStatus changes it', () => {
    const scrollContainer = {
      scrollTop: 10,
      scrollHeight: 50
    }
    const scrollToBottom = jest.fn()
    setHistoryRequestStatus(HISTORY_REQUEST_STATUS.PENDING)
    const { rerender } = renderHookComponent(UseHistoryUpdate, { scrollContainer, scrollToBottom })
    scrollContainer.scrollHeight = 100
    setHistoryRequestStatus(HISTORY_REQUEST_STATUS.DONE)
    renderHookComponent(UseHistoryUpdate, { scrollContainer, scrollToBottom }, { render: rerender })

    expect(scrollContainer.scrollTop).toEqual(60)
    expect(scrollToBottom).not.toHaveBeenCalled()
  })

  it('calls scrollToBottom when request completes without first having pending', () => {
    const scrollContainer = {
      scrollTop: 10,
      scrollHeight: 50
    }
    const scrollToBottom = jest.fn()
    setHistoryRequestStatus(HISTORY_REQUEST_STATUS.DONE)
    renderHookComponent(UseHistoryUpdate, { scrollContainer, scrollToBottom })

    expect(scrollContainer.scrollTop).toEqual(10)
    expect(scrollToBottom).toHaveBeenCalledTimes(1)
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

  it('only calls again if number of agents changes', () => {
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([1, 2])
    const scrollToBottom = jest.fn()
    const agentTypingRef = { offsetHeight: 50 }
    const scrollContainer = { scrollTop: 10, offsetHeight: 0, scrollHeight: 50 }
    const { rerender } = renderHookComponent(UseAgentTyping, {
      agentTypingRef,
      scrollContainer,
      scrollToBottom
    })
    renderHookComponent(
      UseAgentTyping,
      { agentTypingRef, scrollContainer, scrollToBottom },
      { render: rerender }
    )
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([1])
    renderHookComponent(
      UseAgentTyping,
      { agentTypingRef, scrollContainer, scrollToBottom },
      { render: rerender }
    )

    expect(scrollToBottom).toHaveBeenCalledTimes(2)
  })

  it('does not call scroll when agent is not typing', () => {
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([])
    const scrollToBottom = jest.fn()
    const agentTypingRef = { offsetHeight: 50 }
    const scrollContainer = { scrollTop: 10, offsetHeight: 0, scrollHeight: 50 }
    renderHookComponent(UseAgentTyping, { agentTypingRef, scrollContainer, scrollToBottom })

    expect(scrollToBottom).not.toHaveBeenCalled()
  })

  it('does not call scroll when scroll is not at bottom', () => {
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
  })

  it('only calls again if chatsLength or author has changed', () => {
    jest.spyOn(chatSelectors, 'getLastMessageAuthor').mockReturnValue('agent:name')
    const scrollToBottom = jest.fn()
    const { rerender } = renderHookComponent(
      UseNewMessages,
      { scrollToBottom },
      { store: testContext.store }
    )
    renderHookComponent(UseNewMessages, { scrollToBottom }, { render: rerender })

    jest.spyOn(chatReselectors, 'getChatsLength').mockReturnValue(3)
    renderHookComponent(UseNewMessages, { scrollToBottom }, { render: rerender })
    jest.spyOn(chatSelectors, 'getLastMessageAuthor').mockReturnValue('visitor')
    renderHookComponent(UseNewMessages, { scrollToBottom }, { render: rerender })
    expect(scrollToBottom).toHaveBeenCalledTimes(3)
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

    it('calls scrollToBottom even if scroll is not close to bottom', () => {
      const scrollToBottom = jest.fn()
      renderHookComponent(UseNewMessages, { isScrollCloseToBottom: false, scrollToBottom })

      expect(scrollToBottom).toHaveBeenCalled()
    })
  })
})
