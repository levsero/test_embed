import { render } from 'src/apps/messenger/utils/testHelpers'

import ChannelLink from '../'

const renderComponent = (props = {}) => {
  const defaultProps = {
    channelId: 'messenger',
    url: 'www.awesomeurl.com',
  }

  return render(<ChannelLink {...defaultProps} {...props} />)
}

describe('ChannelLink', () => {
  it('displays a button with channel link url', () => {
    const { getByText } = renderComponent()

    expect(getByText('Open Messenger')).toBeInTheDocument()
  })
})
