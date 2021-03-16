import render from 'src/utils/test/render'
import MessengerHeader from '../'

const mockOnCloseFn = jest.fn()

describe('MessengerHeader', () => {
  const defaultProps = {
    content: {
      title: 'Test company',
    },
    close: {
      onClick: jest.fn(),
    },
  }

  const renderComponent = (props = {}) =>
    render(
      <MessengerHeader>
        <MessengerHeader.Content {...defaultProps.content} {...(props.content || {})} />
        <MessengerHeader.Close {...defaultProps.close} {...(props.close || {})} />
      </MessengerHeader>
    )

  it('renders the title and description', () => {
    const { getByText } = renderComponent({
      content: {
        title: 'Header title',
        description: 'Header description',
      },
    })

    expect(getByText('Header title')).toBeInTheDocument()
    expect(getByText('Header description')).toBeInTheDocument()
  })

  it('renders the avatar image with a custom alt tag', () => {
    const avatarAltTag = 'Company logo'
    const avatar = 'https://example.com/cat.jpg'
    const { getByAltText } = renderComponent({
      content: {
        avatar,
      },
    })

    expect(getByAltText(avatarAltTag).tagName).toEqual('IMG')
    expect(getByAltText(avatarAltTag).src).toEqual(avatar)
  })

  it('renders the close button with an aria-label', () => {
    const { getByLabelText } = renderComponent()

    expect(getByLabelText('Close')).toBeInTheDocument()
  })

  it('fires the onClose event when close is clicked', () => {
    const { getByLabelText } = renderComponent({
      close: {
        onClick: mockOnCloseFn,
      },
    })

    getByLabelText('Close').click()
    expect(mockOnCloseFn).toHaveBeenCalled()
  })
})
