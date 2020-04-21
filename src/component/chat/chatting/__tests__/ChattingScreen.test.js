import React from 'react'
import { fireEvent } from '@testing-library/react'

import { render } from 'src/util/testHelpers'
import { Component as ChattingScreen } from '../ChattingScreen'
import { TEST_IDS } from 'src/constants/shared'
jest.mock('src/redux/modules/chat')
jest.mock('src/embeds/chat/hooks/chattingScreenHooks')

const sendAttachmentsSpy = jest.fn(),
  showChatEndSpy = jest.fn(),
  sendMsgSpy = jest.fn(),
  handleChatBoxChangeSpy = jest.fn(),
  sendChatRatingSpy = jest.fn(),
  updateChatScreenSpy = jest.fn(),
  toggleMenuSpy = jest.fn(),
  markAsReadSpy = jest.fn(),
  updateContactDetailsVisibilitySpy = jest.fn()

const renderComponent = (inProps, rerender) => {
  const props = {
    lastMessageAuthor: 'bob',
    currentMessage: 'hello',
    sendAttachments: sendAttachmentsSpy,
    showChatEndFn: showChatEndSpy,
    sendMsg: sendMsgSpy,
    handleChatBoxChange: handleChatBoxChangeSpy,
    sendChatRating: sendChatRatingSpy,
    updateChatScreen: updateChatScreenSpy,
    isChatting: false,
    showEditContactDetails: false,
    toggleMenu: toggleMenuSpy,
    showAvatar: false,
    showNewChatEmbed: true,
    title: '',
    rating: {},
    agentsTyping: [],
    activeAgents: {},
    conciergeSettings: {},
    showContactDetails: jest.fn(),
    markAsRead: markAsReadSpy,
    updateContactDetailsVisibility: updateContactDetailsVisibilitySpy,
    unreadMessages: false,
    emailTranscript: {},
    profileConfig: {},
    attachmentsEnabled: true,
    shouldShowEditContactDetails: false,
    allAgents: {},
    concierges: [
      {
        avatar: 'https://example.com/snake',
        display_name: 'Luke Skywalker',
        title: 'Jedi Knight'
      }
    ],
    updateEmailTranscriptVisibility: jest.fn(),
    ...inProps
  }
  const component = <ChattingScreen {...props} />
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
          activeAgents: {}
        })

        expect(queryByText('Queue position: ')).toBeNull()
      })
    })
  })

  describe('when there is an agent in the chat', () => {
    it('does not render the QueuePosition component', () => {
      const { queryByText } = renderComponent({
        activeAgents: { agent123456: { display_name: 'Wayne', typing: false } },
        queuePosition: 1
      })

      expect(queryByText('Queue position: 1')).toBeNull()
    })
  })
})

describe('editContactDetails', () => {
  describe('when should show edit contact details modal', () => {
    it('renders the Edit Contact Details modal', () => {
      const { getByTestId } = renderComponent({ shouldShowEditContactDetails: true })

      expect(getByTestId(TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_POPUP)).toBeInTheDocument()
    })
  })

  describe('when should not show edit contact details modal', () => {
    it('does not render the Edit Contact Details modal', () => {
      const { queryByTestId } = renderComponent({ shouldShowEditContactDetails: false })

      expect(queryByTestId(TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_POPUP)).toBeNull()
    })
  })

  describe('when showNewChatEmbed is false', () => {
    it('does not render the embed even if showEditContactDetails is true', () => {
      const { queryByTestId } = renderComponent({
        showNewChatEmbed: false,
        shouldShowEditContactDetails: true
      })

      expect(queryByTestId(TEST_IDS.CHAT_EDIT_CONTACT_DETAILS_POPUP)).toBeNull()
    })
  })
})

describe('Scroll Pill', () => {
  describe('when notificationCount is zero', () => {
    it('does not render the scroll pill', () => {
      const { queryByTestId } = renderComponent({
        notificationCount: 0
      })

      expect(queryByTestId(TEST_IDS.ICON_ARROW_DOWN)).toBeNull()
    })
  })

  describe('when scroll is near bottom', () => {
    it('does not render the scroll pill', () => {
      const { queryByText, queryByTestId, rerender } = renderComponent({
        notificationCount: 1
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
          notificationCount: 1
        })

        expect(getByText('1 new message')).toBeInTheDocument()

        expect(getByTestId(TEST_IDS.ICON_ARROW_DOWN)).toBeInTheDocument()
      })

      describe('on click', () => {
        it('fires markAsRead', () => {
          const { getByText } = renderComponent({
            notificationCount: 1
          })
          fireEvent.click(getByText('1 new message'))

          expect(markAsReadSpy).toHaveBeenCalled()
        })
      })
    })
  })
})
