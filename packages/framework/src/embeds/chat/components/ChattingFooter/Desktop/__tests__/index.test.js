import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'src/constants/shared'

import ChattingFooterDesktop from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    attachmentsEnabled: false,
    endChat: jest.fn(),
    handleAttachmentDrop: jest.fn(),
    hideZendeskLogo: false,
    isChatting: true,
    isMobile: false,
    isPreview: false
  }

  return render(
    <ChattingFooterDesktop {...defaultProps} {...props}>
      <p>testChild</p>
    </ChattingFooterDesktop>
  )
}

describe('ChattingFooterDesktop', () => {
  it('renders children', () => {
    const { getByText } = renderComponent()

    expect(getByText('testChild')).toBeInTheDocument()
  })

  describe('when attachments are enabled', () => {
    it('renders the Attachment Option', () => {
      const { getByTestId } = renderComponent({ attachmentsEnabled: true })

      expect(getByTestId(TEST_IDS.ICON_CHAT_ATTACHMENT)).toBeInTheDocument()
    })
  })

  describe('when attachments are disabled', () => {
    it('does not render the Attachment Option', () => {
      const { queryByTestId } = renderComponent({ attachmentsEnabled: false })

      expect(queryByTestId(TEST_IDS.ICON_CHAT_ATTACHMENT)).toBeNull()
    })
  })

  describe('when End Chat option is clicked', () => {
    it('calls endChat', () => {
      const endChat = jest.fn()
      const { getByTestId } = renderComponent({ endChat })

      fireEvent.click(getByTestId(TEST_IDS.ICON_END_CHAT))

      expect(endChat).toHaveBeenCalled()
    })
  })

  describe('when hideZendeskLogo is false', () => {
    it('renders the Zendesk Logo', () => {
      const { getByTestId } = renderComponent({ hideZendeskLogo: false })

      expect(getByTestId(TEST_IDS.ICON_ZENDESK)).toBeInTheDocument()
    })
  })

  describe('when hideZendeskLogo is true', () => {
    it('does not render the Zendesk Logo', () => {
      const { queryByTestId } = renderComponent({ hideZendeskLogo: true })

      expect(queryByTestId(TEST_IDS.ICON_ZENDESK)).toBeNull()
    })
  })

  it('renders the chat menu button', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.CHAT_MENU)).toBeInTheDocument()
  })
})
