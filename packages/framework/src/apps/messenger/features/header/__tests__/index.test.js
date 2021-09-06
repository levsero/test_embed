import { waitFor } from '@testing-library/dom'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import createStore from 'src/apps/messenger/store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { fetchIntegrations } from 'src/apps/messenger/store/integrations'
import { widgetOpened, getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { render } from 'src/apps/messenger/utils/testHelpers'
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

  it('does not display the close button when the widget is open and launcher is visible', () => {
    const { queryByLabelText, store } = renderComponent()
    store.dispatch(widgetOpened())
    expect(queryByLabelText(closeButtonAriaLabel)).not.toBeInTheDocument()
  })

  it('displays the close button when the widget is open and launcher is not visible', () => {
    const { getByLabelText, store } = renderComponent()
    store.dispatch(widgetOpened())
    store.dispatch(screenDimensionsChanged({ isFullScreen: true }))

    expect(getByLabelText(closeButtonAriaLabel)).toBeInTheDocument()
  })

  it('dispatches widgetClosed when the close button is clicked', async () => {
    const { getByLabelText, store } = renderComponent()
    store.dispatch(widgetOpened())
    store.dispatch(screenDimensionsChanged({ isFullScreen: true }))

    expect(getIsWidgetOpen(store.getState())).toEqual(true)
    getByLabelText(closeButtonAriaLabel).click()
    expect(getIsWidgetOpen(store.getState())).toEqual(false)
  })
})
