import * as integrationStore from 'src/apps/messenger/store/integrations'
import { Route, MemoryRouter } from 'react-router-dom'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { createMemoryHistory } from 'history'

import ChannelPage from '../'

const renderWithRouter = ({ channelId, integration }) => {
  jest.spyOn(integrationStore, 'linkIntegration')
  jest
    .spyOn(integrationStore, 'selectIntegrationById')
    .mockImplementation(() => ({ ...integration }))

  return render(
    <MemoryRouter initialEntries={[`/channelPage/${channelId}`]}>
      <Route path={'/channelPage/:channelId'}>
        <ChannelPage />
      </Route>
    </MemoryRouter>
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
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('dispatches a channel link request on page load', () => {
    const channelId = 'messenger'

    renderWithRouter({
      channelId,
      integration: { linkRequest: { channelId, url: 'http://some.url/' } },
    })

    expect(integrationStore.linkIntegration).toHaveBeenCalledWith(channelId)
  })

  it('renders a back button ', () => {
    const channelId = 'messenger'
    const { getByText } = renderWithRouter({
      channelId,
      integration: { linkRequest: { channelId, url: 'http://some.url/' } },
    })

    expect(getByText('Back')).toBeInTheDocument()
  })

  describe('When we have a linkRequest', () => {
    it('should render an integration link', () => {
      const channelId = 'messenger'
      const { getByText } = renderWithRouter({
        channelId,
        integration: { linkRequest: { channelId, url: 'http://some.url/' } },
      })

      expect(getByText('Click me')).toBeInTheDocument()
    })
  })
  describe('When we do not have a linkRequest', () => {
    it('should not render an integration link', () => {
      const channelId = 'messenger'
      const { queryByText } = renderWithRouter({
        channelId,
        integration: {},
      })

      expect(queryByText('Click me')).not.toBeInTheDocument()
    })
  })
})
