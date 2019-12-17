import React from 'react'
import { render } from 'src/util/testHelpers'
import { ChattingFooter } from '../ChattingFooter'
import { TEST_IDS } from 'src/constants/shared'

const renderComponent = inProps => {
  const props = {
    endChat: jest.fn(),
    sendChat: jest.fn(),
    children: [],
    handleAttachmentDrop: jest.fn(),
    isChatting: false,
    toggleMenu: jest.fn(),
    attachmentsEnabled: true,
    isMobile: false,
    hideZendeskLogo: false,
    isPreview: false,
    ...inProps
  }

  return render(<ChattingFooter {...props} />)
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
})
