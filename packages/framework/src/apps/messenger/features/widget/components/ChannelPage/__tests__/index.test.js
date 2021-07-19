import { render } from 'src/apps/messenger/utils/testHelpers'
import ChannelPage from '../'
import { createMemoryHistory } from 'history'

describe('Header', () => {
  const renderComponent = (options = {}) => {
    return render(<ChannelPage />, { ...options })
  }

  it('can go back to previous page', () => {
    const history = createMemoryHistory({
      initialEntries: ['/', '/channelPage/messenger'],
      initialIndex: 1,
    })
    const { getByLabelText } = renderComponent({ history })
    expect(getByLabelText('Back to conversation')).toBeInTheDocument()
    getByLabelText('Back to conversation').click()
    expect(history.location.pathname).toEqual('/')
  })
})
