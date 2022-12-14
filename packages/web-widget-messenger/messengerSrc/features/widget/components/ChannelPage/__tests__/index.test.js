import userEvent from '@testing-library/user-event'
import { createMemoryHistory } from 'history'
import { Route } from 'react-router-dom'
import * as responsiveDesignStore from 'messengerSrc/features/responsiveDesign/store'
import * as integrationStore from 'messengerSrc/store/integrations'
import { render } from 'messengerSrc/utils/testHelpers'
import ChannelPage from '../'

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
      it('renders a a loading spinner', () => {
        const channelId = 'messenger'
        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: false,
          isFetchingLinkRequest: true,
          linkRequest: {},
        }))
        const { getByRole } = renderChannelPage(<ChannelPage />, { channelId })

        expect(getByRole('progressbar')).toBeInTheDocument()
      })
    })

    describe('when the fetch link request is in an error state', () => {
      describe('the QRCode page', () => {
        it('renders an error message and retry button', () => {
          const channelId = 'messenger'
          jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
            errorFetchingLinkRequest: true,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          }))
          const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

          expect(getByText("QR code couldn't be loaded")).toBeInTheDocument()
          expect(getByText('Tap to retry')).toBeInTheDocument()
        })
      })

      describe('the button page', () => {
        it('renders an error message and retry button', () => {
          const channelId = 'messenger'
          jest.spyOn(responsiveDesignStore, 'getIsFullScreen').mockReturnValue(true)
          jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
            errorFetchingLinkRequest: true,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          }))

          const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

          expect(getByText("Link code couldn't be loaded")).toBeInTheDocument()
          expect(getByText('Tap to retry')).toBeInTheDocument()
        })
      })

      describe('when the retry button is clicked', () => {
        it('attempts to fetch the link request again', () => {
          const channelId = 'messenger'
          jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
            errorFetchingLinkRequest: true,
            hasFetchedLinkRequest: false,
            isFetchingLinkRequest: false,
            linkRequest: {},
          }))

          const linkRequestSpy = jest.spyOn(integrationStore, 'fetchLinkRequest')

          const { getByText } = renderChannelPage(<ChannelPage />, { channelId })
          expect(linkRequestSpy).toHaveBeenCalledTimes(1)

          getByText('Tap to retry').click()
          expect(linkRequestSpy).toHaveBeenCalledTimes(2)
        })
      })
    })
  })

  describe('when a link request has been fetched', () => {
    beforeEach(() => {
      jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
        errorFetchingLinkRequest: false,
        hasFetchedLinkRequest: true,
        isFetchingLinkRequest: false,
        linkRequest: { channelId: 'messenger', url: 'http://some.url/' },
      }))
    })

    it('should render an integration link', () => {
      const channelId = 'messenger'
      const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

      expect(getByText('Open Messenger', { exact: false })).toBeInTheDocument()
    })

    describe('when the channel is Whatsapp', () => {
      it('should render an integration link with the custom Whatsapp message', () => {
        const channelId = 'whatsapp'
        const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

        const link = getByText('Open WhatsApp on this device', { exact: false })
        expect(link.href).toContain(
          'text=I%27m%20continuing%20my%20conversation%20on%20WhatsApp.%20Here%27s%20my%20code:%20'
        )
      })
    })

    describe('when the back button is clicked', () => {
      it('can go back to previous page', () => {
        jest.spyOn(integrationStore, 'leftChannelPage')
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
        expect(integrationStore.leftChannelPage).toHaveBeenCalledWith({ channelId })
      })
    })

    describe('when the link is cancelled by the user', () => {
      it('displays a notification message', () => {
        const channelId = 'messenger'
        const initialEntries = ['/', `/channelPage/${channelId}`]
        const history = createMemoryHistory({
          initialEntries,
          initialIndex: 1,
        })

        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: true,
          isFetchingLinkRequest: false,
          linkRequest: { channelId: 'messenger', url: 'http://some.url/' },
          linked: 'linked',
          linkCancelled: true,
        }))

        const { getByText } = renderChannelPage(<ChannelPage />, { channelId, history })

        expect(getByText('Couldn???t connect. Try again.')).toBeInTheDocument()
      })
    })

    describe('when the link fails', () => {
      it('displays a notification message', () => {
        const channelId = 'messenger'
        const initialEntries = ['/', `/channelPage/${channelId}`]
        const history = createMemoryHistory({
          initialEntries,
          initialIndex: 1,
        })

        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: true,
          isFetchingLinkRequest: false,
          linkRequest: { channelId: 'messenger', url: 'http://some.url/' },
          linked: 'linked',
          linkFailed: true,
        }))

        const { getByText } = renderChannelPage(<ChannelPage />, { channelId, history })

        expect(getByText('Couldn???t connect. Try again.')).toBeInTheDocument()
      })
    })
  })

  describe('when the selected channel has been linked', () => {
    it('unlinks the channel when the unlink anchor button is clicked', () => {
      const channelId = 'messenger'
      const initialEntries = ['/', `/channelPage/${channelId}`]
      const history = createMemoryHistory({
        initialEntries,
        initialIndex: 1,
      })

      jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
        errorFetchingLinkRequest: false,
        hasFetchedLinkRequest: true,
        isFetchingLinkRequest: false,
        linkRequest: { channelId: 'messenger', url: 'http://some.url/' },
        linked: 'linked',
      }))
      jest.spyOn(integrationStore, 'unlinkIntegration')

      const { getByText } = renderChannelPage(<ChannelPage />, { channelId, history })

      userEvent.click(getByText('Disconnect'))

      expect(integrationStore.unlinkIntegration).toHaveBeenCalledWith({ channelId })
    })

    describe('when the unlink fails', () => {
      it('displays a notification message', () => {
        const channelId = 'messenger'
        const initialEntries = ['/', `/channelPage/${channelId}`]
        const history = createMemoryHistory({
          initialEntries,
          initialIndex: 1,
        })

        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: true,
          isFetchingLinkRequest: false,
          linkRequest: { channelId: 'messenger', url: 'http://some.url/' },
          linked: 'linked',
          unlinkFailed: true,
        }))
        jest.spyOn(integrationStore, 'unlinkIntegration')

        const { getByText } = renderChannelPage(<ChannelPage />, { channelId, history })

        expect(getByText('Couldn???t disconnect. Try again.')).toBeInTheDocument()
      })
    })

    describe('open already linked channel', () => {
      it('opens Facebook Messenger in a new tab', () => {
        const channelId = 'messenger'

        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: true,
          isFetchingLinkRequest: false,
          linkRequest: { channelId: 'messenger', url: 'http://some.url/' },
          linked: 'linked',
          unlinkFailed: true,
          pageId: '123',
        }))

        const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

        const windowOpen = jest.spyOn(window, 'open').mockImplementation(() => null)
        getByText('Open Messenger').click()

        expect(windowOpen).toHaveBeenCalledWith('https://m.me/123', '_blank', 'noopener,noreferrer')
      })

      it('opens WhatsApp in a new tab', () => {
        const channelId = 'whatsapp'

        jest.spyOn(integrationStore, 'selectIntegrationById').mockImplementation(() => ({
          errorFetchingLinkRequest: false,
          hasFetchedLinkRequest: true,
          isFetchingLinkRequest: false,
          linked: 'linked',
          unlinkFailed: true,
          phoneNumber: '123123123',
          linkRequest: {},
        }))

        const { getByText } = renderChannelPage(<ChannelPage />, { channelId })

        const windowOpen = jest.spyOn(window, 'open').mockImplementation(() => null)
        getByText('Open WhatsApp').click()

        expect(windowOpen).toHaveBeenCalledWith(
          'https://wa.me/123123123',
          '_blank',
          'noopener,noreferrer'
        )
      })
    })
  })
})
