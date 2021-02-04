import render from 'src/utils/test/render'
import MessengerHeader from '../'

const mockOnCloseFn = jest.fn()

describe('MessengerHeader', () => {
  const defaultProps = {
    title: 'Test company'
  }

  const renderComponent = (props = {}) => render(<MessengerHeader {...defaultProps} {...props} />)

  it('renders the title and description', () => {
    const { getByText } = renderComponent({
      title: 'Header title',
      description: 'Header description'
    })

    expect(getByText('Header title')).toBeInTheDocument()
    expect(getByText('Header description')).toBeInTheDocument()
  })

  it('renders the avatar image with a custom alt tag', () => {
    const avatarAltTag = 'Company logo'
    const avatar = 'https://example.com/cat.jpg'
    const { getByAltText } = renderComponent({
      avatar
    })

    expect(getByAltText(avatarAltTag).tagName).toEqual('IMG')
    expect(getByAltText(avatarAltTag).src).toEqual(avatar)
  })

  it('does not render a close button by default', () => {
    const closeButtonAriaLabel = 'Close'
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText(closeButtonAriaLabel)).not.toBeInTheDocument()
  })

  it('renders the close button with a custom aria-label when it is shown', () => {
    const closeButtonAriaLabel = 'Close'
    const { getByLabelText } = renderComponent({ showCloseButton: true })

    expect(getByLabelText(closeButtonAriaLabel)).toBeInTheDocument()
  })

  it('fires the onClose event when close is clicked', () => {
    const closeButtonAriaLabel = 'Close'
    const { getByLabelText } = renderComponent({
      closeButtonAriaLabel,
      showCloseButton: true,
      onClose: mockOnCloseFn
    })

    getByLabelText(closeButtonAriaLabel).click()
    expect(mockOnCloseFn).toHaveBeenCalled()
  })
})
