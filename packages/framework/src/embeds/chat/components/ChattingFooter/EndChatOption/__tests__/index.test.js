import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'src/constants/shared'

import EndChatOption from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    endChat: jest.fn(),
    isChatting: false,
  }

  return render(<EndChatOption {...defaultProps} {...props} />)
}

describe('EndChatOption', () => {
  it('renders tooltip', () => {
    const { getByText } = renderComponent()

    expect(getByText('End chat')).toBeInTheDocument()
  })

  it('renders the icon', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.ICON_END_CHAT)).toBeInTheDocument()
  })

  it('button contains the aria-label', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.BUTTON_END_CHAT)).toHaveAttribute('aria-label', 'End chat')
  })

  describe('when is chatting', () => {
    it('fires endChat when the icon is clicked', () => {
      const endChat = jest.fn()
      const { getByTestId } = renderComponent({ isChatting: true, endChat })

      fireEvent.click(getByTestId(TEST_IDS.ICON_END_CHAT))

      expect(endChat).toHaveBeenCalled()
    })

    it('the button is not disabled', () => {
      const { getByTestId } = renderComponent({ isChatting: true })

      expect(getByTestId(TEST_IDS.BUTTON_END_CHAT)).not.toBeDisabled()
    })
  })

  describe('when is not chatting', () => {
    it('does not fire endChat when the icon is clicked', () => {
      const endChat = jest.fn()
      const { getByTestId } = renderComponent({ isChatting: false, endChat })

      fireEvent.click(getByTestId(TEST_IDS.ICON_END_CHAT))

      expect(endChat).not.toHaveBeenCalled()
    })

    it('the button is disabled', () => {
      const { getByTestId } = renderComponent({ isChatting: false })

      expect(getByTestId(TEST_IDS.BUTTON_END_CHAT)).toBeDisabled()
    })
  })
})
