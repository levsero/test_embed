import React from 'react'
import { render } from 'src/util/testHelpers'
import ChattingFooter from '../'
import { TEST_IDS } from 'src/constants/shared'

const renderComponent = inProps => {
  const props = {
    attachmentsEnabled: true,
    children: [],
    endChat: jest.fn(),
    handleAttachmentDrop: jest.fn(),
    hideZendeskLogo: false,
    isChatting: false,
    isMobile: false,
    isPreview: false,
    sendChat: jest.fn()
  }

  return render(<ChattingFooter {...props} {...inProps} />)
}

describe('render', () => {
  it('renders icon container', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId(TEST_IDS.CHAT_FOOTER_MENU_BUTTONS)).toBeInTheDocument()
  })

  it('renders chat end icon', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId(TEST_IDS.ICON_END_CHAT)).toBeInTheDocument()
  })

  it('renders attachment icon', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId(TEST_IDS.CHAT_ATTACHMENT_BUTTON)).toBeInTheDocument()
  })

  it('renders chat menu icon', () => {
    const { getByTestId } = renderComponent()
    expect(getByTestId(TEST_IDS.CHAT_MENU)).toBeInTheDocument()
  })

  describe('when is mobile', () => {
    it('renders mobile footer', () => {
      const { getByTestId, queryByTestId } = renderComponent({ isMobile: true })

      expect(getByTestId(TEST_IDS.CHAT_FOOTER_MOBILE)).toBeInTheDocument()
      expect(queryByTestId(TEST_IDS.CHAT_FOOTER_DESKTOP)).toBeNull()
    })
  })

  describe('when is not mobile', () => {
    it('renders desktop footer', () => {
      const { getByTestId, queryByTestId } = renderComponent({ isMobile: false })

      expect(getByTestId(TEST_IDS.CHAT_FOOTER_DESKTOP)).toBeInTheDocument()
      expect(queryByTestId(TEST_IDS.CHAT_FOOTER_MOBILE)).toBeNull()
    })
  })
})
