import render from 'src/utils/test/render'
import Header from '../'

const mockOnCloseFn = jest.fn()

describe('Header', () => {
  const defaultProps = {
    title: 'Test company'
  }

  const renderComponent = (props = {}) => render(<Header {...defaultProps} {...props} />)

  it('renders the title and description', () => {
    const { getByText } = renderComponent({
      title: 'Header title',
      description: 'Header description'
    })

    expect(getByText('Header title')).toBeInTheDocument()
    expect(getByText('Header description')).toBeInTheDocument()
  })

  it('renders the avatar image with a custom alt tag', () => {
    const avatarAltTag = 'Image of my cat'
    const avatar = 'https://example.com/cat.jpg'
    const { getByAltText } = renderComponent({
      avatarAltTag,
      avatar
    })

    expect(getByAltText(avatarAltTag).tagName).toEqual('IMG')
    expect(getByAltText(avatarAltTag).src).toEqual(avatar)
  })

  it('does not render a close button by default', () => {
    const closeButtonAriaLabel = 'Close the widget'
    const { queryByLabelText } = renderComponent({ closeButtonAriaLabel })

    expect(queryByLabelText(closeButtonAriaLabel)).not.toBeInTheDocument()
  })

  it('renders the close button with a custom aria-label when it is shown', () => {
    const closeButtonAriaLabel = 'Close the widget'
    const { getByLabelText } = renderComponent({ closeButtonAriaLabel, showCloseButton: true })

    expect(getByLabelText(closeButtonAriaLabel)).toBeInTheDocument()
  })

  it('fires the onClose event when close is clicked', () => {
    const closeButtonAriaLabel = 'Close the widget'
    const { getByLabelText } = renderComponent({
      closeButtonAriaLabel,
      showCloseButton: true,
      onClose: mockOnCloseFn
    })

    getByLabelText(closeButtonAriaLabel).click()
    expect(mockOnCloseFn).toHaveBeenCalled()
  })
})
