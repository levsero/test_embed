import React from 'react'
import { render } from 'utility/testHelpers'
import { Component as AttachmentField } from '../'
import * as utils from 'src/util/utils'

jest.mock('utility/devices')

const defaultProps = {
  displayAttachmentLimitError: false,
  clearLimitExceededError: jest.fn(),
  maxFileCount: 5,
  uploadAttachedFiles: jest.fn(),
  title: 'attachment field title',
  onChange: jest.fn(),
  value: {},
  displayDropzone: false,
  dragEnded: jest.fn()
}

const renderComponent = (props = {}, renderFn) => {
  const component = <AttachmentField {...defaultProps} {...props} />
  return render(component, { render: renderFn })
}

describe('AttachmentField', () => {
  it('renders title correctly', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('attachment field title')).toBeInTheDocument()
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
    expect(queryByText('Attachment limit reached')).toBeInTheDocument()
  })

  it('renders limit error when limitExceeded is true', () => {
    const { queryByText, queryByTestId } = renderComponent({
      value: { limitExceeded: true }
    })
    expect(queryByTestId('error-message')).toBeInTheDocument()
    expect(queryByText('Attachment limit reached')).toBeInTheDocument()
  })

  it('does not render the dropzone when displayDropzone is false', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('Drop to attach')).not.toBeInTheDocument()
  })

  it('renders the dropzone when displayDropzone is true', () => {
    const { queryByText } = renderComponent({
      displayDropzone: true
    })

    expect(queryByText('Drop to attach')).toBeInTheDocument()
  })

  it('calls handleAttachmentsError when displayAttachmentLimitError switches to true', () => {
    utils.onNextTick = jest.fn()
    const { rerender } = renderComponent()
    renderComponent({ value: { limitExceeded: true } }, rerender)
    expect(utils.onNextTick).toHaveBeenCalled()
  })
})
