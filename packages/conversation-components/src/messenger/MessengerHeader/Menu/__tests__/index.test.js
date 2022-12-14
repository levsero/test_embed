import Menu from 'src/messenger/MessengerHeader/Menu'
import render from 'src/utils/test/render'

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
        whatsapp: true,
        instagram: true,
      },
    })

    expect(queryByText('Continue on WhatsApp')).toBeInTheDocument()
    expect(queryByText('Continue on Instagram')).toBeInTheDocument()
    expect(queryByText('Continue on Messenger')).not.toBeInTheDocument()
  })

  it('renders them in the order WhatsApp, Messenger then Instagram', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      channels: {
        whatsapp: true,
        messenger: true,
        instagram: true,
      },
    })

    expect(queryByText('Continue on WhatsApp')).toBeInTheDocument()
    expect(queryByText('Continue on Messenger')).toBeInTheDocument()
    expect(queryByText('Continue on Instagram')).toBeInTheDocument()
  })

  it('renders as open when isOpen is true', () => {
    const { queryByText } = renderComponent({
      isOpen: true,
      channels: {
        whatsapp: true,
      },
    })

    expect(queryByText('Continue on WhatsApp')).toBeInTheDocument()
  })

  it('renders as closed when isOpen is false', () => {
    const { queryByText } = renderComponent({
      isOpen: false,
      channels: {
        whatsapp: true,
      },
    })

    expect(queryByText('Continue on WhatsApp')).not.toBeInTheDocument()
  })

  describe('when there are channels', () => {
    it('renders the menu trigger', () => {
      const { getByLabelText } = renderComponent({
        isOpen: false,
        channels: {
          whatsapp: true,
        },
      })

      expect(getByLabelText('Channel linking menu option')).toBeInTheDocument()
    })
  })

  describe('when there are no channels', () => {
    it('does not render the menu', () => {
      const { queryByLabelText } = renderComponent({
        isOpen: false,
        channels: {},
      })

      expect(queryByLabelText('Channel linking menu option')).not.toBeInTheDocument()
    })
  })
})
