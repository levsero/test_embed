import { TEST_IDS } from 'src/constants/shared'
import { render } from 'src/util/testHelpers'
import AttachmentOption from '../'

const renderComponent = (props = {}, renderProps = {}) => {
  const defaultProps = {
    isPreview: false,
    isMobile: false,
    handleAttachmentDrop: jest.fn(),
  }

  return render(<AttachmentOption {...defaultProps} {...props} />, renderProps)
}

describe('AttachmentOption', () => {
  describe('Desktop', () => {
    it('renders the attachment button', () => {
      const { getByTestId } = renderComponent()

      expect(getByTestId(TEST_IDS.CHAT_ATTACHMENT_BUTTON)).toBeInTheDocument()
    })

    it('renders the tooltip', () => {
      const { getByText } = renderComponent()

      expect(getByText('Attach file')).toBeInTheDocument()
    })

    it('renders a dropzone', () => {
      const { getByTestId } = renderComponent({ isMobile: true })

      expect(getByTestId('dropzone')).toBeInTheDocument()
    })
  })

  describe('Mobile', () => {
    it('does not render the tooltip', () => {
      const { queryByText } = renderComponent({ isMobile: true })

      expect(queryByText('Attach file')).toBeNull()
    })

    it('renders a dropzone', () => {
      const { getByTestId } = renderComponent({ isMobile: true })

      expect(getByTestId('dropzone')).toBeInTheDocument()
    })
  })

  describe('Preview', () => {
    it('does not render the tooltip', () => {
      const { queryByText } = renderComponent({ isPreview: true })

      expect(queryByText('Attach file')).toBeNull()
    })

    it('does not render the dropzone', () => {
      const { queryByTestId } = renderComponent({ isPreview: true })

      expect(queryByTestId('dropzone')).toBeNull()
    })
  })
})
