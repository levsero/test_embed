import { TEST_IDS } from 'classicSrc/constants/shared'
import { Component as ChatWidgetHeader } from 'classicSrc/embeds/chat/components/ChatWidgetHeader'
import { createChatPopoutWindow } from 'classicSrc/util/chat'
import { render } from 'classicSrc/util/testHelpers'
import { isMobileBrowser } from '@zendesk/widget-shared-services'

jest.mock('classicSrc/util/chat', () => ({
  createChatPopoutWindow: jest.fn(),
}))

jest.mock('classicSrc/redux/modules/selectors', () => ({
  ...jest.requireActual('classicSrc/redux/modules/selectors'),
  getShowBackButton: jest.fn().mockReturnValue(true),
}))

jest.mock('@zendesk/widget-shared-services', () => {
  const originalModule = jest.requireActual('@zendesk/widget-shared-services')

  return {
    __esModule: true,
    ...originalModule,
    isMobileBrowser: jest.fn(),
  }
})

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
