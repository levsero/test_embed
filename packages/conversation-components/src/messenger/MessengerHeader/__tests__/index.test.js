import render from 'src/utils/test/render'
import MessengerHeader from '../'
import { createMemoryHistory } from 'history'

const mockOnCloseFn = jest.fn()

describe('MessengerHeader', () => {
  const defaultProps = {
    content: {
      title: 'Test company',
    },
    close: {
      onClick: jest.fn(),
    },
    menu: {
      channels: {},
      onChannelSelect: jest.fn(),
      isOpen: false,
    },
  }

  const renderComponent = (props = {}) =>
    render(
      <MessengerHeader>
        <MessengerHeader.Content {...defaultProps.content} {...(props.content || {})} />
        <MessengerHeader.Close {...defaultProps.close} {...(props.close || {})} />
        <MessengerHeader.Menu {...defaultProps.menu} {...(props.menu || {})} />
      </MessengerHeader>
    )

  it('renders channel linking menu button', () => {
    const { getByLabelText } = renderComponent({
      menu: {
        channels: {
          messenger: 'linked',
        },
      },
    })

    expect(getByLabelText('channel linking menu button')).toBeInTheDocument()
  })

  it('should navigate to channel linking page', () => {
    const history = createMemoryHistory({
      initialEntries: ['/channelPage/messenger', '/'],
      initialIndex: 0,
    })
    const { getByText } = renderComponent({
      menu: {
        isOpen: true,
        channels: {
          messenger: 'linked',
        },
        history,
      },
    })

    expect(getByText('Continue on Messenger')).toBeInTheDocument()
    getByText('Continue on Messenger').click()
    expect(history.location.pathname).toEqual('/channelPage/messenger')
  })

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
