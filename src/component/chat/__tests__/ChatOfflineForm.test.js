import { ChatOfflineForm } from '../ChatOfflineForm'
import { render } from 'react-testing-library'
import React from 'react'
import { OFFLINE_FORM_SCREENS } from 'constants/chat'

const renderForm = (props = {}) => {
  const defaultProps = {
    isAuthenticated: false,
    hasChatHistory: false,
    openedChatHistory: () => {},
    title: 'boop',
    chatOfflineFormChanged: () => {},
    sendOfflineMessage: () => {},
    handleOfflineFormBack: () => {},
    handleOperatingHoursClick: () => {},
    formFields: {},
    greeting: 'hello fren',
    visitor: {},
    widgetShown: true,
    chatHistoryLabel: 'Chat History Here'
  }

  const combinedProps = {
    ...defaultProps,
    ...props
  }

  return render(<ChatOfflineForm {...combinedProps} />)
}

describe('render', () => {
  describe('renderForm', () => {
    describe('when isAuthenticated and has history', () => {
      it('renders the ChatHistoryLink', () => {
        const result = renderForm({
          isAuthenticated: true,
          hasChatHistory: true,
          offlineMessage: {
            screen: OFFLINE_FORM_SCREENS.MAIN
          },
          title: 'Hello fren'
        })

        expect(result.getByText('Chat History Here')).toBeInTheDocument()
      })
    })

    describe('when not authenticated', () => {
      it('does not render the ChatHistoryLink', () => {
        const result = renderForm({
          hasChatHistory: true,
          offlineMessage: {
            screen: OFFLINE_FORM_SCREENS.MAIN
          }
        })

        expect(result.queryByText('Chat History Here')).toBeNull()
      })
    })

    describe('when not when does not have history', () => {
      it('does not render the ChatHistoryLink', () => {
        const result = renderForm({
          isAuthenticated: true,
          offlineMessage: {
            screen: OFFLINE_FORM_SCREENS.MAIN
          }
        })

        expect(result.queryByText('Chat History Here')).toBeNull()
      })
    })
  })
})
