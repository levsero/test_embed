import render from 'src/utils/test/render'
import Menu from 'src/messenger/MessengerHeader/Menu'

describe('Menu', () => {
  const defaultProps = {
    channels: {},
    onChannelSelect: jest.fn(),
    isOpen: true,
    onStateChange: jest.fn(),
  }

  const renderComponent = (props = {}) => render(<Menu {...defaultProps} {...props} />)

  it('only renders items that have a valid value', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      channels: {
        whatsapp: 'linked',
        instagram: 'linked',
      },
    })

    expect(queryByText('Transfer to WhatsApp')).toBeInTheDocument()
    expect(queryByText('Transfer to Instagram')).toBeInTheDocument()
    expect(queryByText('Transfer to Messenger')).not.toBeInTheDocument()
  })

  it('renders them in the order WhatsApp, Messenger then Instagram', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      channels: {
        whatsapp: 'linked',
        messenger: 'linked',
        instagram: 'linked',
      },
    })

    expect(queryByText('Transfer to WhatsApp')).toBeInTheDocument()
    expect(queryByText('Transfer to Messenger')).toBeInTheDocument()
    expect(queryByText('Transfer to Instagram')).toBeInTheDocument()
  })

  it('renders as open when isOpen is true', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      channels: {
        whatsapp: 'linked',
      },
    })

    expect(queryByText('Transfer to WhatsApp')).toBeInTheDocument()
  })

  it('renders as closed when isOpen is false', () => {
    const { queryByText } = renderComponent({
      isOpen: false,
      channels: {
        whatsapp: 'linked',
      },
    })

    expect(queryByText('Transfer to WhatsApp')).not.toBeInTheDocument()
  })
})
