import { TEST_IDS } from 'src/constants/shared'
import { Component as ChatWidgetHeader } from 'src/embeds/chat/components/ChatWidgetHeader'
import { render } from 'src/util/testHelpers'
import { createChatPopoutWindow } from 'utility/chat'
import { isMobileBrowser } from 'utility/devices'

jest.mock('utility/chat', () => ({
  createChatPopoutWindow: jest.fn(),
}))

jest.mock('utility/devices')

jest.mock('src/redux/modules/selectors', () => ({
  ...jest.requireActual('src/redux/modules/selectors'),
  getShowBackButton: jest.fn().mockReturnValue(true),
}))

describe('ChatWidgetHeader', () => {
  const defaultProps = {
    title: 'Chat title',
    zChat: {
      getMachineId: jest.fn().mockReturnValue('machine id'),
    },
    popoutSettings: {},
    isChatPreview: false,
    locale: 'en-US',
    popoutButtonIsVisible: false,
    handlePopoutCreated: jest.fn(),
  }

  const renderComponent = (props = {}) => {
    return render(<ChatWidgetHeader {...defaultProps} {...props} />)
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
      const handlePopoutCreated = jest.fn()
      const { queryByLabelText } = renderComponent({
        isPopoutButtonVisible: true,
        isChatPreview: true,
        handlePopoutCreated,
      })

      queryByLabelText('Popout').click()

      expect(handlePopoutCreated).not.toHaveBeenCalled()
    })

    it('calls "handlePopoutCreated" when clicked', () => {
      const handlePopoutCreated = jest.fn()
      const { queryByLabelText } = renderComponent({
        isPopoutButtonVisible: true,
        handlePopoutCreated,
      })

      queryByLabelText('Popout').click()

      expect(handlePopoutCreated).toHaveBeenCalled()
    })

    it('opens a chat popup window when clicked', () => {
      const { queryByLabelText } = renderComponent({
        isPopoutButtonVisible: true,
      })

      queryByLabelText('Popout').click()

      expect(createChatPopoutWindow).toHaveBeenCalled()
    })
  })

  it('renders the button to close the widget', () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('Minimize widget')).toBeInTheDocument()
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
