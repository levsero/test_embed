import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'src/constants/shared'

import ChattingFooterMobile from '../'

const handleAttachmentDrop = jest.fn(),
  sendChat = jest.fn()

const renderComponent = (props = {}) => {
  const defaultProps = {
    attachmentsEnabled: false,
    handleAttachmentDrop,
    isChatting: true,
    isMobile: false,
    isPreview: false,
    sendChat
  }

  return render(
    <ChattingFooterMobile {...defaultProps} {...props}>
      <p>testChild</p>
    </ChattingFooterMobile>
  )
}

describe('ChattingFooterMobile', () => {
  it('renders children', () => {
    const { getByText } = renderComponent()

    expect(getByText('testChild')).toBeInTheDocument()
  })

  it('renders the Send Chat option', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.ICON_SEND_CHAT)).toBeInTheDocument()
  })

  it('fires sendChat when SendChat is clicked', () => {
    const { getByTestId } = renderComponent()

    fireEvent.click(getByTestId(TEST_IDS.ICON_SEND_CHAT))
    expect(sendChat).toHaveBeenCalled()
  })

  describe('when attachments are enabled', () => {
    it('renders Attachment Option', () => {
      const { getByTestId } = renderComponent({ attachmentsEnabled: true })

      expect(getByTestId(TEST_IDS.ICON_CHAT_ATTACHMENT)).toBeInTheDocument()
    })
  })

  describe('when attachments are not enabled', () => {
    it('does not render Attachment Option', () => {
      const { queryByTestId } = renderComponent({ attachmentsEnabled: false })

      expect(queryByTestId(TEST_IDS.ICON_CHAT_ATTACHMENT)).toBeNull()
    })
  })
})
