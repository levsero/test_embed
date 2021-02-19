import { fireEvent } from '@testing-library/dom'
import { render } from 'utility/testHelpers'
import AttachmentInput from '../'
import { isMobileBrowser } from 'utility/devices'
jest.mock('utility/devices')

const defaultProps = {
  onFileSelect: () => {},
  attachmentInputId: 'attachment-box',
}

const renderComponent = (props = {}) => render(<AttachmentInput {...defaultProps} {...props} />)

describe('AttachmentInput', () => {
  it('renders the label', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Add up to 5 files')).toBeInTheDocument()
  })

  describe('on mobile', () => {
    it('renders the correct label', () => {
      isMobileBrowser.mockReturnValue(true)
      const { queryByText } = renderComponent()

      expect(queryByText('Add file from device')).toBeInTheDocument()
    })
  })

  it('calls onFileSelect when the value changes', () => {
    const onFileSelect = jest.fn()

    const { queryByTestId } = renderComponent({ onFileSelect })

    fireEvent.change(queryByTestId('attachment-box'), { target: { files: [{ name: 'new' }] } })

    expect(onFileSelect).toHaveBeenCalledWith([{ name: 'new' }])
  })
})
