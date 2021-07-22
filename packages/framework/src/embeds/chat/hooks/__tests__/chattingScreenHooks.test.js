/* eslint-disable react/prop-types */
import { waitFor } from '@testing-library/dom'
import { HISTORY_REQUEST_STATUS } from 'src/constants/chat'
import createStore from 'src/redux/createStore'
import * as chatActions from 'src/redux/modules/chat'
import * as chatHistorySelectors from 'src/redux/modules/chat/chat-history-selectors'
import * as chatReselectors from 'src/redux/modules/chat/chat-selectors/reselectors'
import * as chatSelectors from 'src/redux/modules/chat/chat-selectors/selectors'
import { render } from 'utility/testHelpers'
import {
  useMessagesOnMount,
  useHistoryUpdate,
  useAgentTyping,
  useNewMessages,
} from '../chattingScreenHooks'

jest.mock('src/redux/modules/chat')

const UseMessagesOnMount = ({ scrollToBottom, isScrollCloseToBottom }) => {
  useMessagesOnMount(scrollToBottom, isScrollCloseToBottom)
  return null
}

const UseHistoryUpdate = ({ scrollContainer, scrollToBottom }) => {
  const scrollHeight = useHistoryUpdate(scrollContainer, scrollToBottom)
  return <div>Scroll height: {scrollHeight}</div>
}

const UseAgentTyping = ({ agentTypingRef, scrollContainer, scrollToBottom }) => {
  useAgentTyping(agentTypingRef, scrollContainer, scrollToBottom)
  return null
}

const UseNewMessages = ({ scrollToBottom, scrollContainer }) => {
  useNewMessages(scrollToBottom, scrollContainer)
  return null
}

const renderHookComponent = (Component, props, options) => {
  const defaultProps = {
    scrollToBottom: jest.fn(),
    isScrollCloseToBottom: true,
    scrollContainer: {},
    agentTypingRef: {},
  }
  return render(<Component {...defaultProps} {...props} />, options)
}

describe('useMessagesOnMount', () => {
  let markAsReadSpy

  beforeEach(() => {
    markAsReadSpy = jest.spyOn(chatActions, 'markAsRead').mockReturnValue({ type: 'mark as read' })
  })

  afterEach(() => {
    markAsReadSpy.mockClear()
  })

  it('calls scrollToBottom', async () => {
    const scrollToBottom = jest.fn()
    renderHookComponent(UseMessagesOnMount, { scrollToBottom })

    await waitFor(() => expect(scrollToBottom).toHaveBeenCalled())
  })

  it('calls markAsRead', async () => {
    const store = createStore()
    const dispatchSpy = jest.spyOn(store, 'dispatch')
    renderHookComponent(UseMessagesOnMount, {}, { store: store })

    await waitFor(() => expect(dispatchSpy).toHaveBeenCalledWith(chatActions.markAsRead()))
  })
})

describe('useHistoryUpdate', () => {
  const setHistoryRequestStatus = (status) => {
    jest.spyOn(chatHistorySelectors, 'getHistoryRequestStatus').mockReturnValue(status)
  }
  it('adjusts the scroll height when historyRequestStatus changes it', async () => {
    const scrollContainer = {
      scrollTop: 10,
      scrollHeight: 50,
    }
    const scrollToBottom = jest.fn()
    setHistoryRequestStatus(HISTORY_REQUEST_STATUS.PENDING)
    const { rerender, getByText } = renderHookComponent(UseHistoryUpdate, {
      scrollContainer,
      scrollToBottom,
    })

    await waitFor(() => expect(getByText('Scroll height: 50')).toBeInTheDocument())

    scrollContainer.scrollHeight = 100
    setHistoryRequestStatus(HISTORY_REQUEST_STATUS.DONE)
    renderHookComponent(UseHistoryUpdate, { scrollContainer, scrollToBottom }, { render: rerender })

    await waitFor(() => expect(scrollContainer.scrollTop).toEqual(60))
    expect(scrollToBottom).not.toHaveBeenCalled()
  })

  it('calls scrollToBottom when request completes without first having pending', async () => {
    const scrollContainer = {
      scrollTop: 10,
      scrollHeight: 50,
    }
    const scrollToBottom = jest.fn()
    setHistoryRequestStatus(HISTORY_REQUEST_STATUS.DONE)
    renderHookComponent(UseHistoryUpdate, { scrollContainer, scrollToBottom })

    await waitFor(() => expect(scrollContainer.scrollTop).toEqual(10))
    await waitFor(() => expect(scrollToBottom).toHaveBeenCalledTimes(1))
  })
})

describe('useAgentTyping', () => {
  it('scrolls if agents starts typing and scroll is at bottom', async () => {
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([1, 2])
    const scrollToBottom = jest.fn()
    const agentTypingRef = { offsetHeight: 50 }
    const scrollContainer = { scrollTop: 10, offsetHeight: 0, scrollHeight: 50 }
    renderHookComponent(UseAgentTyping, { agentTypingRef, scrollContainer, scrollToBottom })

    await waitFor(() => expect(scrollToBottom).toHaveBeenCalled())
  })

  it('only calls again if number of agents changes', async () => {
    jest.spyOn(chatReselectors, 'getAgentsTyping').mockReturnValue([1, 2])
    const scrollToBottom = jest.fn()
    const agentTypingRef = { offsetHeight: 50 }
    const scrollContainer = { scrollTop: 10, offsetHeight: 0, scrollHeight: 50 }
    const { rerender } = renderHookComponent(UseAgentTyping, {
      agentTypingRef,
      scrollContainer,
      scrollToBottom,
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

    await waitFor(() => expect(scrollToBottom).toHaveBeenCalledTimes(2))
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
  let markAsReadSpy

  beforeEach(() => {
    testContext = {}
    testContext.store = createStore()
    testContext.dispatchSpy = jest.spyOn(testContext.store, 'dispatch')
    markAsReadSpy = jest.spyOn(chatActions, 'markAsRead').mockReturnValue({ type: 'mark as read' })
  })

  afterEach(() => {
    markAsReadSpy.mockClear()
  })

  it('only calls again if chatsLength or author has changed', async () => {
    let scrollContainer = {
      scrollTop: 0,
      scrollHeight: 400,
      offsetHeight: 30,
    }
    jest.spyOn(chatSelectors, 'getLastMessageAuthor').mockReturnValue('agent:name')
    const scrollToBottom = jest.fn()
    const { rerender } = renderHookComponent(
      UseNewMessages,
      { scrollToBottom, scrollContainer },
      { store: testContext.store }
    )
    renderHookComponent(UseNewMessages, { scrollToBottom, scrollContainer }, { render: rerender })

    scrollContainer = {
      scrollTop: 0,
      scrollHeight: 420,
      offsetHeight: 30,
    }
    jest.spyOn(chatReselectors, 'getChatsLength').mockReturnValue(3)
    renderHookComponent(UseNewMessages, { scrollToBottom, scrollContainer }, { render: rerender })

    scrollContainer = {
      scrollTop: 0,
      scrollHeight: 440,
      offsetHeight: 30,
    }
    jest.spyOn(chatSelectors, 'getLastMessageAuthor').mockReturnValue('visitor')
    renderHookComponent(UseNewMessages, { scrollToBottom, scrollContainer }, { render: rerender })
    await waitFor(() => expect(scrollToBottom).toHaveBeenCalledTimes(3))
  })

  describe('agent message', () => {
    beforeEach(() => {
      jest.spyOn(chatSelectors, 'getLastMessageAuthor').mockReturnValue('agent:name')
    })

    it('calls markAsRead if scroll is close to bottom', async () => {
      const scrollContainer = {
        scrollTop: 10,
        scrollHeight: 400,
        offsetHeight: 30,
      }
      const scrollToBottom = jest.fn()
      renderHookComponent(
        UseNewMessages,
        { scrollToBottom, scrollContainer },
        { store: testContext.store }
      )

      await waitFor(() =>
        expect(testContext.dispatchSpy).toHaveBeenCalledWith(chatActions.markAsRead())
      )
    })

    it('calls scrollToBottom if scroll is close to bottom', async () => {
      const scrollContainer = {
        scrollTop: 10,
        scrollHeight: 400,
        offsetHeight: 30,
      }
      const scrollToBottom = jest.fn()
      renderHookComponent(UseNewMessages, { scrollToBottom, scrollContainer })

      await waitFor(() => expect(scrollToBottom).toHaveBeenCalled())
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

    it('calls scrollToBottom even if scroll is not close to bottom', async () => {
      const scrollContainer = {
        scrollTop: 200,
        scrollHeight: 400,
        offsetHeight: 0,
      }
      const scrollToBottom = jest.fn()
      renderHookComponent(UseNewMessages, { scrollContainer, scrollToBottom })

      await waitFor(() => expect(scrollToBottom).toHaveBeenCalled())
    })
  })
})
