import { Route } from 'react-router-dom'
import * as integrationStore from 'src/apps/messenger/store/integrations'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { createMemoryHistory } from 'history'

import ChannelPage from '..'

const renderChannelPage = (ui, { channelId, history }) => {
  const initialEntries = ['/', `/channelPage/${channelId}`]

  return render(<Route path="/channelPage/:channelId">{ui}</Route>, {
    history:
      history ||
      createMemoryHistory({
        initialEntries,
        initialIndex: 1,
      }),
  })
}

describe('ChannelPage', () => {
  beforeEach(() => {
    jest.spyOn(integrationStore, 'fetchLinkRequest')
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  it('can go back to previous page', () => {
    const channelId = 'messenger'
    const initialEntries = ['/', `/channelPage/${channelId}`]
    const history = createMemoryHistory({
      initialEntries,
      initialIndex: 1,
    })
    const { getByLabelText } = renderChannelPage(<ChannelPage />, { channelId, history })
    expect(getByLabelText('Back to conversation')).toBeInTheDocument()
    getByLabelText('Back to conversation').click()
    expect(history.location.pathname).toEqual('/')
  })

  it('dispatches a fetch link request on page load', () => {
    const channelId = 'messenger'
    jest
      .spyOn(integrationStore, 'selectIntegrationById')
      .mockImplementation(() => ({ linkRequest: { channelId, url: 'http://some.url/' } }))
    renderChannelPage(<ChannelPage />, { channelId })

    expect(integrationStore.fetchLinkRequest).toHaveBeenCalledWith({ channelId })
  })

  describe('when a link request has not been fetched yet', () => {
    describe('when the link request is loading', () => {
      it('renders a loading message', () => {
        const channelId = 'messenger'
        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: true,
          linkRequest: {},
        }))
        const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

        expect(getByText('Loading link request')).toBeInTheDocument()
      })
    })

    describe('when the fetch link request is in an error state', () => {
      it('renders an error message', () => {
        const channelId = 'messenger'
        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: true,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: false,
          linkRequest: {},
        }))
        const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

        expect(getByText('Error fetching link request')).toBeInTheDocument()
      })
    })
  })

  describe('when a link request has been fetched', () => {
    it('should render an integration link', () => {
      const channelId = 'messenger'
      jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
        errorFetchingLinkRequest: false,
        hasFetchedLinkRequest: true,
        isFetchingLinkRequest: false,
        linkRequest: { channelId, url: 'http://some.url/' },
      }))
      const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

      expect(getByText('Open Messenger', { exact: false })).toBeInTheDocument()
    })
  })
})
