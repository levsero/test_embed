import { render } from 'utility/testHelpers'
import React from 'react'

import { Component as ChatOffline } from '../'

jest.mock('component/chat/ChatOfflineForm', () => {
  return {
    ChatOfflineForm: () => <div>ChatOfflineForm</div>
  }
})

const renderComponent = inProps => {
  const props = {
    chatOfflineFormChanged: () => {},
    initiateSocialLogout: () => {},
    sendOfflineMessage: () => {},
    handleOfflineFormBack: () => {},
    handleOperatingHoursClick: () => {},
    readOnlyState: {},
    formState: {},
    formFields: {},
    formSettings: { enabled: false },
    loginSettings: {},
    offlineMessage: {},
    socialLogin: {},
    authUrls: {},
    visitor: {},
    operatingHours: {},
    hideZendeskLogo: false,
    isAuthenticated: false,
    widgetShown: false,
    title: 'testTitle',
    fullscreen: false,
    hasChatHistory: false,
    openedChatHistory: () => {},
    chatHistoryLabel: 'testChatHistoryLabel',
    ...inProps
  }
  return render(<ChatOffline {...props} />)
}

describe('render', () => {
  describe('when formSettings are not enabled', () => {
    describe('renders chatOfflineScreen', () => {
      it('renders title', () => {
        expect(renderComponent().getByText('Chat with us')).toBeInTheDocument()
      })

      it('renders apology', () => {
        expect(
          renderComponent().getByText('Sorry, we are not online at the moment')
        ).toBeInTheDocument()
      })

      it('renders close button', () => {
        expect(renderComponent().getByText('Close')).toBeInTheDocument()
      })
    })
  })

  describe('when form settings are enabled', () => {
    it('renders chatOfflineForm', () => {
      const { getByText } = renderComponent({ formSettings: { enabled: true } })

      expect(getByText('ChatOfflineForm')).toBeInTheDocument()
    })
  })

  describe('when form settings are disabled', () => {
    it('renders NoAgentsPage', () => {
      const { getByText } = renderComponent({ formSettings: { enabled: false } })

      expect(getByText('Sorry, we are not online at the moment')).toBeInTheDocument()
    })
  })
})
