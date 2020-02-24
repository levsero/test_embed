import React from 'react'
import { render } from 'utility/testHelpers'
import AttachmentLimitError from '../'
import { fireEvent } from '@testing-library/react'

describe('AttachmentLimitError', () => {
  const renderComponent = (props = {}) => {
    const defaultProps = {
      handleClearError: jest.fn(),
      maxFileCount: 5,
      ...props
    }

    return render(<AttachmentLimitError {...defaultProps} />)
  }

  it('renders the error message', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('Attachment limit reached')).toBeInTheDocument()
    expect(queryByText('You can upload a maximum of 5 attachments.')).toBeInTheDocument()
  })

  it('renders the close button', () => {
    const { getByRole } = renderComponent()
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('clicking the close button fires handleClearError', () => {
    const close = jest.fn()
    const { getByRole } = renderComponent({ handleClearError: close })
    fireEvent.click(getByRole('button'))
    expect(close).toHaveBeenCalled()
  })
})
