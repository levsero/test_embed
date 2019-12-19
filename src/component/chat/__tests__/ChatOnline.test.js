import React from 'react'

import { render } from 'src/util/testHelpers'
import { Component } from '../ChatOnline'
import { CONNECTION_STATUSES } from 'constants/chat'

const renderComponent = props => {
  const mergedProps = {
    attachmentsEnabled: false,
    endChatViaPostChatScreen: jest.fn(),
    screen: '',
    sendAttachments: jest.fn(),
    editContactDetailsSubmitted: jest.fn(),
    handleReconnect: jest.fn(),
    sendEmailTranscript: jest.fn(),
    emailTranscript: {},
    visitor: {},
    editContactDetails: {},
    updateContactDetailsVisibility: jest.fn(),
    updateEmailTranscriptVisibility: jest.fn(),
    connection: '',
    authUrls: {},
    socialLogin: {},
    isLoggingOut: false,
    initiateSocialLogout: jest.fn(),

    ...props
  }

  return render(<Component {...mergedProps} />)
}

describe('renderChatReconnectButton', () => {
  describe('when connection prop is set to closed', () => {
    it('returns the Reconnect button', () => {
      const { getByText } = renderComponent({ connection: CONNECTION_STATUSES.CLOSED })

      expect(getByText('Click to reconnect')).toBeInTheDocument()
    })
  })
  describe('when the connection prop is not set to closed', () => {
    it('does not render the Reconnect button', () => {
      const { queryByText } = renderComponent({ connection: CONNECTION_STATUSES.CONNECTED })

      expect(queryByText('Click to reconnect')).toBeNull()
    })
  })

  describe('when the user is logging out', () => {
    it('does not render the Reconnect button', () => {
      const { queryByText } = renderComponent({ isLoggingOut: true })

      expect(queryByText('Click to reconnect')).toBeNull()
    })
  })
})
