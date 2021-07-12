import * as integrationStore from 'src/apps/messenger/store/integrations'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { createMemoryHistory } from 'history'

import { renderWithRouter } from 'src/apps/messenger/utils/testHelpers'
import ChannelPage from '../'

const renderChannelPage = (ui, { channelId }) =>
  renderWithRouter(ui, {
    path: '/channelPage/:channelId',
    initialEntries: [`/channelPage/${channelId}`],
  })

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
  beforeEach(() => {
    jest.spyOn(integrationStore, 'linkIntegration')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('renders a back button ', () => {
    const channelId = 'messenger'
    const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

    expect(getByText('Back')).toBeInTheDocument()
  })

  it('dispatches a channel link request on page load', () => {
    const channelId = 'messenger'
    jest
      .spyOn(integrationStore, 'selectIntegrationById')
      .mockImplementation(() => ({ linkRequest: { channelId, url: 'http://some.url/' } }))
    renderChannelPage(<ChannelPage />, { channelId })

    expect(integrationStore.linkIntegration).toHaveBeenCalledWith(channelId)
  })

  describe('when a linkRequest has not been fetched yet', () => {
    describe('when the linkRequest is loading', () => {
      it('renders a loading message', () => {
        const channelId = 'messenger'
        jest
          .spyOn(integrationStore, 'selectIntegrationById')
          .mockImplementation(() => ({ linkRequest: { channelId, url: 'http://some.url/' } }))
        jest.spyOn(integrationStore, 'getHasFetchedLinkRequest').mockImplementation(() => false)
        jest.spyOn(integrationStore, 'getIsFetchingLinkRequest').mockImplementation(() => true)
        const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

        expect(getByText('Loading link request')).toBeInTheDocument()
      })
    })

    describe('when the linkRequest fetch is in an error state', () => {
      it('renders an error message', () => {
        const channelId = 'messenger'
        jest
          .spyOn(integrationStore, 'selectIntegrationById')
          .mockImplementation(() => ({ linkRequest: { channelId, url: 'http://some.url/' } }))
        jest.spyOn(integrationStore, 'getHasFetchedLinkRequest').mockImplementation(() => false)
        jest.spyOn(integrationStore, 'getErrorFetchingLinkRequest').mockImplementation(() => true)
        const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

        expect(getByText('Error fetching link request')).toBeInTheDocument()
      })
    })
  })

  describe('when a linkRequest has been fetched', () => {
    it('should render an integration link', () => {
      const channelId = 'messenger'
      jest
        .spyOn(integrationStore, 'selectIntegrationById')
        .mockImplementation(() => ({ linkRequest: { channelId, url: 'http://some.url/' } }))
      jest.spyOn(integrationStore, 'getHasFetchedLinkRequest').mockImplementation(() => true)
      const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

      expect(getByText('Click me')).toBeInTheDocument()
    })
  })
})
