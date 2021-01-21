import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import createStore from 'src/apps/messenger/store'
import { widgetOpened, getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import Header from '../'

const closeButtonAriaLabel = 'Close'

describe('Header', () => {
  const renderComponent = () => {
    const store = createStore()
    store.dispatch(
      messengerConfigReceived({
        title: 'Zendesk',
        description: 'Elevate the conversation',
        avatar: 'https://example.com/dummyUrl.jpg'
      })
    )

    return render(<Header />, { store })
  }

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
