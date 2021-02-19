import { render } from 'utility/testHelpers'
import AttachmentError from '../'
import { fireEvent } from '@testing-library/react'
import { ATTACHMENT_ERRORS } from 'src/embeds/support/constants'

describe('AttachmentError', () => {
  const renderComponent = (props = {}) => {
    const attachment = {
      id: '123',
      fileName: 'text.txt',
      fileSize: 2000000,
      errorMessage: ATTACHMENT_ERRORS.TOO_LARGE,
      ...props.attachment,
    }
    const defaultProps = {
      handleRemoveAttachment: jest.fn(),
      maxFileSize: 5 * 1024 * 1024, // 5 MB,
      ...props,
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

  it('renders the error message for too large', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('File too large')).toBeInTheDocument()
    expect(queryByText('Must be less than 5 MB.')).toBeInTheDocument()
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
