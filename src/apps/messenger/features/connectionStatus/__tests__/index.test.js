import React from 'react'
import createStore from 'src/apps/messenger/store'
import { render } from 'src/apps/messenger/utils/testHelpers'
import ConnectionStatusBanner from '../'
import { connectionStatusChanged } from '../store'

jest.useFakeTimers()

const offlineMsg = 'Offline. You will not receive messages.'
const reconnectedMsg = "You're back online!"

describe('ConnectionStatusBanner', () => {
  const renderComponent = () => {
    const store = createStore()
    return render(<ConnectionStatusBanner />, { store })
  }

  it('does not render a banner when online', () => {
    const { queryByText, store } = renderComponent()
    store.dispatch(connectionStatusChanged({ isOnline: true }))

    expect(queryByText(offlineMsg)).not.toBeInTheDocument()
    expect(queryByText(reconnectedMsg)).not.toBeInTheDocument()
  })

  it('renders an offline banner when its offline', () => {
    const { queryByText, store } = renderComponent()
    store.dispatch(connectionStatusChanged({ isOnline: false }))

    expect(queryByText(offlineMsg)).toBeInTheDocument()
  })

  it('renders a reconnected banner when it changes from offline to online', () => {
    const { queryByText, store } = renderComponent()

    store.dispatch(connectionStatusChanged({ isOnline: false }))
    expect(queryByText(offlineMsg)).toBeInTheDocument()

    store.dispatch(connectionStatusChanged({ isOnline: true }))
    expect(queryByText(reconnectedMsg)).toBeInTheDocument()
  })

  it('automatically removes banners after reconnecting', () => {
    const { queryByText, store } = renderComponent()

    store.dispatch(connectionStatusChanged({ isOnline: false }))
    store.dispatch(connectionStatusChanged({ isOnline: true }))
    expect(queryByText(reconnectedMsg)).toBeInTheDocument()

    jest.advanceTimersByTime(4000)

    expect(queryByText(offlineMsg)).not.toBeInTheDocument()
    expect(queryByText(reconnectedMsg)).not.toBeInTheDocument()
  })
})
