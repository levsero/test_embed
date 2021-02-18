import React from 'react'
import { fireEvent } from '@testing-library/dom'
import { render } from 'utility/testHelpers'
import { Component as AttachmentList } from '../'
jest.mock('utility/devices')

const validAttachment = {
  id: '123',
  fileName: 'text.txt',
  fileSize: 20000,
  uploading: false,
  uploadProgress: 100,
}

const errorAttachment = {
  id: '1234',
  fileName: 'text2.txt',
  fileSize: 20000,
  uploading: false,
  uploadProgress: 100,
  errorMessage: 'this failed',
}

const defaultProps = {
  allAttachments: [validAttachment, errorAttachment],
  deleteAttachment: jest.fn(),
  onRemoveAttachment: jest.fn(),
  maxFileSize: 5,
}

const renderComponent = (props = {}) => render(<AttachmentList {...defaultProps} {...props} />)

describe('AttachmentList', () => {
  it('renders both attachments', () => {
    const { queryByTestId } = renderComponent()
    expect(queryByTestId('file-name-123')).toBeInTheDocument()
    expect(queryByTestId('error-message')).toBeInTheDocument()
  })

  describe('handleRemoveAttachment', () => {
    it('calls deleteAttachment with the correct id', () => {
      const deleteAttachment = jest.fn()
      const onRemoveAttachment = jest.fn()
      const { queryAllByTestId } = renderComponent({ deleteAttachment, onRemoveAttachment })

      fireEvent.click(queryAllByTestId('Icon--close')[0])
      expect(deleteAttachment).toHaveBeenCalledWith('123')
      expect(onRemoveAttachment).toHaveBeenCalledTimes(1)

      fireEvent.click(queryAllByTestId('Icon--close')[1])
      expect(deleteAttachment).toHaveBeenCalledWith('1234')
      expect(onRemoveAttachment).toHaveBeenCalledTimes(2)
    })
  })
})
