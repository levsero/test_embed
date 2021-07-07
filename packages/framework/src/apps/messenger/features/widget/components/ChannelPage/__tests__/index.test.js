import * as integrationStore from 'src/apps/messenger/store/integrations'
import { Route, MemoryRouter } from 'react-router-dom'
import createStore from 'src/apps/messenger/store'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { createMemoryHistory } from 'history'

import ChannelPage from '../'

const renderWithRouter = ({ channelId }) => {
  const store = createStore()
  jest.spyOn(integrationStore, 'linkIntegration')
  jest
    .spyOn(integrationStore, 'selectIntegrationById')
    .mockImplementation(() => ({ linkRequest: { channelId, url: 'http://some.url/' } }))

  return render(
    <MemoryRouter initialEntries={[`/channelPage/${channelId}`]}>
      <Route path={'/channelPage/:channelId'}>
        <ChannelPage />
      </Route>
    </MemoryRouter>,
    { store }
  )
}

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

describe('ChannelPage', () => {
  it('dispatches a channel link request on page load', () => {
    const channelId = 'messenger'

    renderWithRouter({ channelId })

    expect(integrationStore.linkIntegration).toHaveBeenCalledWith(channelId)
  })

  it('renders a back button ', () => {
    const { getByText } = renderWithRouter({ channelId: 'messenger' })

    expect(getByText('Back')).toBeInTheDocument()
  })
})
