import render from 'src/utils/test/render'
import ChannelLinkWithButton from '../ChannelLinkWithButton'

const renderChannelLinkWithButton = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
  }

  return render(<ChannelLinkWithButton {...defaultProps} {...props} />)
}

describe('<ChannelLinkWithButton>', () => {
  it('renders a button with channel link url', () => {
    const { getByText } = renderChannelLinkWithButton()

    expect(getByText('Open Messenger')).toBeInTheDocument()
  })
})
