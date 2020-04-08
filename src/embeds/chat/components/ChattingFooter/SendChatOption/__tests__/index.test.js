import React from 'react'
import { fireEvent } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import { TEST_IDS } from 'src/constants/shared'

import SendChatOption from '../'

const sendChat = jest.fn()
const renderComponent = (props = {}) => {
  const defaultProps = { sendChat }

  return render(<SendChatOption {...defaultProps} {...props} />)
}

describe('SendChatOption', () => {
  it('renders the Send Chat Icon button', () => {
    const { getByTestId } = renderComponent()

    expect(getByTestId(TEST_IDS.ICON_SEND_CHAT)).toBeInTheDocument()
  })

  it('fires sendChat event on click', () => {
    const { getByTestId } = renderComponent()

    fireEvent.click(getByTestId(TEST_IDS.ICON_SEND_CHAT))

    expect(sendChat).toHaveBeenCalled()
  })
})
