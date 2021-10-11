import render from 'src/utils/test/render'
import ChannelLinkWithUnlink from '../ChannelLinkWithUnlink'

const onDisconnect = jest.fn()
const renderComponent = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    onDisconnect,
  }

  return render(<ChannelLinkWithUnlink {...defaultProps} {...props} />)
}

describe('ChannelLinkWithUnlink', () => {
  it('renders the greeting messages', () => {
    const { getByText } = renderComponent()

    expect(getByText('Continue on Messenger')).toBeInTheDocument()
    expect(
      getByText('Take the conversation to your Messenger account. You can return anytime.')
    ).toBeInTheDocument()
    expect(
      getByText('Open Messenger and send a short message to connect your account.')
    ).toBeInTheDocument()
  })

  it('unlinks the channel when the unlink anchor button is clicked', () => {
    const { getByText } = renderComponent()
    getByText('Disconnect').click()

    expect(onDisconnect).toHaveBeenCalled()
  })

  it('renders the loading spinner when unlink is pending', () => {
    const { getByRole } = renderComponent({ pending: true })

    expect(getByRole('progressbar')).toBeInTheDocument()
  })

  it('opens the channel "Open <channel>" is clicked', () => {
    const { getByText } = renderComponent({
      url: 'www.example.com/fancy-cats.jpg',
    })
    const windowOpen = jest.spyOn(window, 'open').mockImplementation(() => null)
    getByText('Open Messenger').click()

    expect(windowOpen).toHaveBeenCalledWith(
      'www.example.com/fancy-cats.jpg',
      '_blank',
      'noopener,noreferrer'
    )
  })
})
