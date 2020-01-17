import React from 'react'
import { render } from 'utility/testHelpers'
import { Component as AttachmentField } from '../'
jest.mock('utility/devices')

const defaultProps = {
  displayAttachmentLimitError: false,
  clearLimitExceededError: jest.fn(),
  maxFileCount: 5,
  uploadAttachedFiles: jest.fn(),
  validAttachments: [{}, {}],
  handleAttachmentsError: jest.fn()
}

const renderComponent = (props = {}, renderFn) => {
  const component = <AttachmentField {...defaultProps} {...props} />
  return render(component, { render: renderFn })
}

describe('AttachmentField', () => {
  it('renders label with correct count', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('Attachments (2)')).toBeInTheDocument()
  })

  it('renders attachment input', () => {
    const { queryByTestId } = renderComponent()
    expect(queryByTestId('dropzone-input')).toBeInTheDocument()
  })

  it('does not render limit error when displayAttachmentLimitError is false', () => {
    const { queryByTestId } = renderComponent()
    expect(queryByTestId('error-message')).not.toBeInTheDocument()
  })

  it('renders limit error when displayAttachmentLimitError is true', () => {
    const { queryByText, queryByTestId } = renderComponent({
      displayAttachmentLimitError: true
    })
    expect(queryByTestId('error-message')).toBeInTheDocument()
    expect(queryByText('You have already reached the limit of (5) attachments')).toBeInTheDocument()
  })

  it('calls handleAttachmentsError when displayAttachmentLimitError switches to true', () => {
    const handleAttachmentsError = jest.fn()
    const { rerender } = renderComponent()
    renderComponent({ displayAttachmentLimitError: true, handleAttachmentsError }, rerender)
    expect(handleAttachmentsError).toHaveBeenCalled()
  })
})
