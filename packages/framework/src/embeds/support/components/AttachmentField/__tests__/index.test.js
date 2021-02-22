import { fireEvent, wait } from '@testing-library/react'
import { render } from 'utility/testHelpers'
import { Component as AttachmentField } from '../'
import * as utils from 'src/util/utils'
import { FileDropProvider } from 'components/FileDropProvider'

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
  dragEnded: jest.fn(),
}

const renderComponent = (props = {}, renderFn) => {
  const component = (
    <FileDropProvider>
      <AttachmentField {...defaultProps} {...props} />
    </FileDropProvider>
  )
  return render(component, { render: renderFn })
}

describe('AttachmentField', () => {
  it('renders title correctly', () => {
    const { queryByText } = renderComponent()
    expect(queryByText('attachment field title')).toBeInTheDocument()
  })

  it('does not render limit error when displayAttachmentLimitError is false', () => {
    const { queryByTestId } = renderComponent()
    expect(queryByTestId('error-message')).not.toBeInTheDocument()
  })

  it('renders limit error when displayAttachmentLimitError is true', () => {
    const { queryByText, queryByTestId } = renderComponent({
      displayAttachmentLimitError: true,
    })
    expect(queryByTestId('error-message')).toBeInTheDocument()
    expect(queryByText('Attachment limit reached')).toBeInTheDocument()
  })

  it('renders limit error when limitExceeded is true', () => {
    const { queryByText, queryByTestId } = renderComponent({
      value: { limitExceeded: true },
    })
    expect(queryByTestId('error-message')).toBeInTheDocument()
    expect(queryByText('Attachment limit reached')).toBeInTheDocument()
  })

  it('uploads attachments that were dropped into the widget', async () => {
    const uploadAttachedFiles = jest.fn()
    const files = [{ id: 'file1' }, { id: 'file2' }]
    const { queryByText } = renderComponent({ uploadAttachedFiles })

    fireEvent.dragEnter(queryByText(defaultProps.title))
    await wait(() => expect(queryByText('Drop to attach')).toBeInTheDocument())
    fireEvent.drop(queryByText('Drop to attach'), {
      target: {
        files,
      },
    })

    expect(uploadAttachedFiles).toHaveBeenCalledWith(
      files,
      defaultProps.onChange,
      defaultProps.value
    )
  })

  it('renders the error message when given', () => {
    const { queryByText } = renderComponent({
      errorMessage: 'invalid files',
    })

    expect(queryByText('invalid files')).toBeInTheDocument()
  })

  it('calls handleAttachmentsError when displayAttachmentLimitError switches to true', () => {
    utils.onNextTick = jest.fn()
    const { rerender } = renderComponent()
    renderComponent({ value: { limitExceeded: true } }, rerender)
    expect(utils.onNextTick).toHaveBeenCalled()
  })
})
