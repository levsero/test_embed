import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import createStore from 'src/apps/messenger/store'
import { widgetOpened, getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import { screenDimensionsChanged } from 'src/apps/messenger/features/responsiveDesign/store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import Header from '../'

const closeButtonAriaLabel = 'close messenger'

describe('Header', () => {
  const renderComponent = (actions = []) => {
    const store = createStore()

    store.dispatch(
      messengerConfigReceived({
        title: 'Zendesk',
        description: 'Elevate the conversation',
        avatar: 'https://example.com/dummyUrl.jpg'
      })
    )
    actions.forEach(([callback, callbackArgs]) => {
      store.dispatch(callback(callbackArgs))
    })

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
    expect(getByAltText('company avatar')).toBeInTheDocument()
    expect(getByAltText('company avatar').src).toEqual('https://example.com/dummyUrl.jpg')
  })

  it('does not display the close button when the widget is open and launcher is visible', () => {
    const { queryByLabelText } = renderComponent([[widgetOpened]])
    expect(queryByLabelText(closeButtonAriaLabel)).not.toBeInTheDocument()
  })

  it('displays the close button when the widget is open and launcher is not visible', () => {
    const { getByLabelText } = renderComponent([
      [widgetOpened],
      [screenDimensionsChanged, { isFullScreen: true }]
    ])
    expect(getByLabelText(closeButtonAriaLabel)).toBeInTheDocument()
  })

  it('dispatches widgetClosed when the close button is clicked', async () => {
    const { getByLabelText, store } = renderComponent([
      [widgetOpened],
      [screenDimensionsChanged, { isFullScreen: true }]
    ])
    getByLabelText(closeButtonAriaLabel).click()

    expect(getIsWidgetOpen(store.getState())).toEqual(false)
  })
})
