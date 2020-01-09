import React from 'react'
import { render } from 'utility/testHelpers'
import AttachmentError from '../'
import { fireEvent } from '@testing-library/react'

describe('AttachmentError', () => {
  const renderComponent = (props = {}) => {
    const attachment = {
      id: '123',
      fileName: 'text.txt',
      fileSize: 2000000,
      errorMessage: 'file too large',
      ...props.attachment
    }
    const defaultProps = {
      handleRemoveAttachment: jest.fn(),
      ...props
    }

    return render(<AttachmentError {...defaultProps} attachment={attachment} />)
  }

  it('renders the document name', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('text.txt')).toBeInTheDocument()
  })

  it('renders the document size', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('2 MB')).toBeInTheDocument()
  })

  it('renders the error message', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('file too large')).toBeInTheDocument()
  })

  it('renders the close button', () => {
    const { getByRole } = renderComponent()
    expect(getByRole('button')).toBeInTheDocument()
  })

  it('clicking the close button fires handleRemoveAttachment', () => {
    const close = jest.fn()
    const { getByRole } = renderComponent({ handleRemoveAttachment: close })
    fireEvent.click(getByRole('button'))
    expect(close).toHaveBeenCalledWith('123')
  })
})
