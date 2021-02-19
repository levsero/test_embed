import { fireEvent } from '@testing-library/react'

import { render } from 'src/util/testHelpers'
import { Component as ChattingPage } from '../'
import { TEST_IDS } from 'src/constants/shared'
jest.mock('src/redux/modules/chat')
jest.mock('src/embeds/chat/hooks/chattingScreenHooks')

const sendAttachmentsSpy = jest.fn(),
  showChatEndSpy = jest.fn(),
  sendMsgSpy = jest.fn(),
  handleChatBoxChangeSpy = jest.fn(),
  updateChatScreenSpy = jest.fn(),
  toggleMenuSpy = jest.fn(),
  markAsReadSpy = jest.fn(),
  updateContactDetailsVisibilitySpy = jest.fn()

const renderComponent = (inProps, rerender) => {
  const props = {
    activeAgents: {},
    agentsTyping: [],
    allAgents: {},
    conciergeSettings: {},
    currentMessage: 'hello',
    emailTranscript: {},
    handleChatBoxChange: handleChatBoxChangeSpy,
    lastMessageAuthor: 'bob',
    markAsRead: markAsReadSpy,
    rating: {},
    sendAttachments: sendAttachmentsSpy,
    sendMsg: sendMsgSpy,
    showAvatar: false,
    showChatEndFn: showChatEndSpy,
    showContactDetails: jest.fn(),
    showEditContactDetails: false,
    title: '',
    toggleMenu: toggleMenuSpy,
    unreadMessages: false,
    updateChatScreen: updateChatScreenSpy,
    updateContactDetailsVisibility: updateContactDetailsVisibilitySpy,
    updateEmailTranscriptVisibility: jest.fn(),
    ...inProps,
  }

  const component = <ChattingPage {...props} />
  return render(component, { render: rerender })
}

describe('Queue Position', () => {
  describe('when there is no agent in chat', () => {
    describe('when the queuePosition prop is greater than zero', () => {
      it('returns the QueuePosition component', () => {
        const { getByText } = renderComponent({ queuePosition: 1, activeAgents: {} })

        expect(getByText('Queue position: 1')).toBeInTheDocument()
      })
    })

    describe('when the queuePosition prop is zero', () => {
      it('does not render the QueuePosition component', () => {
        const { queryByText } = renderComponent({
          queuePosition: 0,
          activeAgents: {},
        })

        expect(queryByText('Queue position: ')).toBeNull()
      })
    })
  })

  describe('when there is an agent in the chat', () => {
    it('does not render the QueuePosition component', () => {
      const { queryByText } = renderComponent({
        activeAgents: { agent123456: { display_name: 'Wayne', typing: false } },
        queuePosition: 1,
      })

      expect(queryByText('Queue position: 1')).toBeNull()
    })
  })
})

describe('Modals', () => {
  it('renders the Modal Controller', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.CHAT_MODAL_CONTAINER)).toBeInTheDocument()
  })
})

describe('Scroll Pill', () => {
  describe('when notificationCount is zero', () => {
    it('does not render the scroll pill', () => {
      const { queryByTestId } = renderComponent({
        notificationCount: 0,
      })

      expect(queryByTestId(TEST_IDS.ICON_ARROW_DOWN)).toBeNull()
    })
  })

  describe('when scroll is near bottom', () => {
    it('does not render the scroll pill', () => {
      const { queryByText, queryByTestId, rerender } = renderComponent({
        notificationCount: 1,
      })

      renderComponent({ notificationCount: 1 }, rerender)

      expect(queryByText('1 new message')).toBeNull()
      expect(queryByTestId(TEST_IDS.ICON_ARROW_DOWN)).toBeNull()
    })
  })

  describe('when notificationCount is greater than zero', () => {
    describe('and scroll is not near bottom', () => {
      it('renders the scroll pill', () => {
        const { getByText, getByTestId } = renderComponent({
          notificationCount: 1,
        })

        expect(getByText('1 new message')).toBeInTheDocument()

        expect(getByTestId(TEST_IDS.ICON_ARROW_DOWN)).toBeInTheDocument()
      })

      describe('on click', () => {
        it('fires markAsRead', () => {
          const { getByText } = renderComponent({
            notificationCount: 1,
          })
          fireEvent.click(getByText('1 new message'))

          expect(markAsReadSpy).toHaveBeenCalled()
        })
      })
    })
  })
})
