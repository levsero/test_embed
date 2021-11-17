import { waitFor } from '@testing-library/dom'
import { LAUNCHER_SHAPES } from '@zendesk/conversation-components'
import { screenDimensionsChanged } from 'messengerSrc/features/responsiveDesign/store'
import createStore from 'messengerSrc/store'
import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { fetchIntegrations } from 'messengerSrc/store/integrations'
import { widgetOpened, getIsWidgetOpen } from 'messengerSrc/store/visibility'
import { render } from 'messengerSrc/utils/testHelpers'
import Header from '../'

// Garden uses a css selector that is most likely being affected by this bug
// https://github.com/dperini/nwsapi/issues/46
jest.mock('@zendeskgarden/react-avatars', () => ({
  // eslint-disable-next-line react/prop-types
  Avatar: ({ children }) => <div data-avatar={true}>{children}</div>,
}))

const closeButtonAriaLabel = 'Close'

describe('Header', () => {
  const renderComponent = () => {
    const store = createStore()
    store.dispatch(
      messengerConfigReceived({
        title: 'Zendesk',
        description: 'Elevate the conversation',
        avatar: 'https://example.com/dummyUrl.jpg',
      })
    )

    return render(<Header />, { store })
  }

  it('navigates to the channel page when a channel is selected', async () => {
    const { getByLabelText, getByText, history, store } = renderComponent()
    store.dispatch({
      type: fetchIntegrations.fulfilled.toString(),
      payload: [{ pageId: '12345678', appId: '23456789', _id: '0c19f2c2c28', type: 'messenger' }],
    })

    getByLabelText('Channel linking menu option').click()
    await waitFor(() => expect(getByText('Continue on Messenger')).toBeInTheDocument())
    getByText('Continue on Messenger').click()
    expect(history.location.pathname).toEqual('/channelPage/messenger')
  })

  it('renders company title', () => {
    const { getByText } = renderComponent()
    expect(getByText('Zendesk')).toBeInTheDocument()
  })

  it('renders company tagline', () => {
    const { getByText } = renderComponent()
    expect(getByText('Elevate the conversation')).toBeInTheDocument()
  })

  it('renders the company avatar', () => {
    const { getByAltText } = renderComponent()
    expect(getByAltText('Company logo')).toBeInTheDocument()
    expect(getByAltText('Company logo').src).toEqual('https://example.com/dummyUrl.jpg')
  })

  it('dispatches widgetClosed when the close button is clicked', async () => {
    const { getByLabelText, store } = renderComponent()
    store.dispatch(widgetOpened())
    store.dispatch(screenDimensionsChanged({ isFullScreen: true }))

    expect(getIsWidgetOpen(store.getState())).toEqual(true)
    getByLabelText(closeButtonAriaLabel).click()
    expect(getIsWidgetOpen(store.getState())).toEqual(false)
  })

  describe('close button', () => {
    it('is not displayed when the widget is open and the launcher is visible', () => {
      const { queryByLabelText, store } = renderComponent()
      store.dispatch(widgetOpened())
      expect(queryByLabelText(closeButtonAriaLabel)).not.toBeInTheDocument()
    })

    it('is displayed when the widget is open and launcher is not visible', () => {
      const { getByLabelText, store } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(screenDimensionsChanged({ isFullScreen: true }))

      expect(getByLabelText(closeButtonAriaLabel)).toBeInTheDocument()
    })

    it("is displayed when the widget is open and launcher shape is 'none'", () => {
      const { queryByLabelText, store } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(
        messengerConfigReceived({
          launcher: {
            shape: LAUNCHER_SHAPES.none,
          },
        })
      )
      expect(queryByLabelText(closeButtonAriaLabel)).toBeInTheDocument()
    })
  })
})
