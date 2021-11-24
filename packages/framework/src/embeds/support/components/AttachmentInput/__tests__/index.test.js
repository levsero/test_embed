import { fireEvent } from '@testing-library/dom'
import { isMobileBrowser } from '@zendesk/widget-shared-services'
import { render } from 'src/util/testHelpers'
import AttachmentInput from '../'

const defaultProps = {
  onFileSelect: () => {},
  attachmentInputId: 'attachment-box',
}

jest.mock('@zendesk/widget-shared-services', () => {
  const originalModule = jest.requireActual('@zendesk/widget-shared-services')

  return {
    __esModule: true,
    ...originalModule,
    isMobileBrowser: jest.fn(),
  }
})

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
