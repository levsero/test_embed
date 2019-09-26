import { Component as ChatOffline } from '../ChatOffline'
import { render, fireEvent } from '@testing-library/react'
import React from 'react'

jest.mock('component/chat/ChatOfflineForm', () => {
  return {
    ChatOfflineForm: () => <div>ChatOfflineForm</div>
  }
})

const handleCloseClickSpy = jest.fn()

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
    handleCloseClick: handleCloseClickSpy,
    operatingHours: {},
    isMobile: false,
    hideZendeskLogo: false,
    chatId: 'testChatId',
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
        expect(renderComponent().getByText('testTitle')).toBeInTheDocument()
      })

      it('renders apology', () => {
        expect(
          renderComponent().getByText('Sorry, we are not online at the moment')
        ).toBeInTheDocument()
      })

      it('renders close button', () => {
        expect(renderComponent().getByText('Close')).toBeInTheDocument()
      })

      it('when close button is clicked, calls handleCloseClick', () => {
        expect(handleCloseClickSpy).not.toHaveBeenCalled()

        fireEvent.click(renderComponent().getByText('Close'))

        expect(handleCloseClickSpy).toHaveBeenCalled()
      })
    })
  })

  describe('when form settings are enabled', () => {
    it('renders chatOfflineForm', () => {
      const { getByText } = renderComponent({ formSettings: { enabled: true } })

      expect(getByText('ChatOfflineForm')).toBeInTheDocument()
    })
  })
})
