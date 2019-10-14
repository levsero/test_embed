import React from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import createStore from 'src/redux/createStore'
import OnBackProvider from 'component/webWidget/OnBackProvider'
import { createChatPopoutWindow } from 'utility/chat'
import { Component as ChatWidgetHeader } from 'embeds/chat/components/ChatWidgetHeader'
import { isMobileBrowser } from 'utility/devices'
import { TEST_IDS } from 'constants/shared'

jest.mock('utility/chat', () => ({
  createChatPopoutWindow: jest.fn()
}))

jest.mock('utility/devices', () => ({
  isMobileBrowser: jest.fn()
}))

jest.mock('src/redux/modules/selectors', () => ({
  ...jest.requireActual('src/redux/modules/selectors'),
  getShowBackButton: jest.fn().mockReturnValue(true)
}))

describe('ChatWidgetHeader', () => {
  const defaultProps = {
    title: 'Chat title',
    zChat: {
      getMachineId: jest.fn().mockReturnValue('machine id')
    },
    popoutSettings: {},
    isChatPreview: false,
    locale: 'en-US',
    popoutButtonIsVisible: false,
    handlePopoutButtonClicked: jest.fn()
  }

  const renderComponent = (props = {}, onBack = jest.fn()) => {
    return render(
      <Provider store={createStore()}>
        <ThemeProvider>
          <OnBackProvider value={onBack}>
            <ChatWidgetHeader {...defaultProps} {...props} />
          </OnBackProvider>
        </ThemeProvider>
      </Provider>
    )
  }

  it('renders the title', () => {
    const { queryByText } = renderComponent({ title: 'Some title' })

    expect(queryByText('Some title')).toBeInTheDocument()
  })

  describe('popout button', () => {
    it('is rendered if "isPopoutButtonVisible" is true', () => {
      const { queryByLabelText } = renderComponent({ isPopoutButtonVisible: true })

      expect(queryByLabelText('Popout')).toBeInTheDocument()
    })

    it('does nothing when clicked if it is a chat preview', () => {
      const handlePopoutButtonClicked = jest.fn()
      const { queryByLabelText } = renderComponent({
        isPopoutButtonVisible: true,
        isChatPreview: true,
        handlePopoutButtonClicked
      })

      queryByLabelText('Popout').click()

      expect(handlePopoutButtonClicked).not.toHaveBeenCalled()
    })

    it('calls "handlePopoutButtonClicked" when clicked', () => {
      const handlePopoutButtonClicked = jest.fn()
      const { queryByLabelText } = renderComponent({
        isPopoutButtonVisible: true,
        handlePopoutButtonClicked
      })

      queryByLabelText('Popout').click()

      expect(handlePopoutButtonClicked).toHaveBeenCalled()
    })

    it('opens a chat popup window when clicked', () => {
      const { queryByLabelText } = renderComponent({
        isPopoutButtonVisible: true
      })

      queryByLabelText('Popout').click()

      expect(createChatPopoutWindow).toHaveBeenCalled()
    })
  })

  it('renders the button to close the widget', () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('Minimize')).toBeInTheDocument()
  })

  describe('when on mobile', () => {
    it('renders the chat menu', () => {
      isMobileBrowser.mockReturnValue(true)
      const { queryByTestId } = renderComponent()

      expect(queryByTestId(TEST_IDS.CHAT_MENU)).toBeInTheDocument()
    })
  })

  describe('when on desktop', () => {
    it('renders the back button', () => {
      isMobileBrowser.mockReturnValue(false)
      const { queryByLabelText } = renderComponent()

      expect(queryByLabelText('Back')).toBeInTheDocument()
    })
  })
})
