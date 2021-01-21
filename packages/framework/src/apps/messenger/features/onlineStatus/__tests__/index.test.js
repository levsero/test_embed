import React from 'react'
import createStore from 'src/apps/messenger/store'
import { render } from 'src/apps/messenger/utils/testHelpers'
import OnlineStatusBanner from '../'
import { onlineStatusChanged } from '../store'

jest.useFakeTimers()

const offlineMsg = 'Offline. You won’t receive messages.'
const reconnectedMsg = 'You’re now online'

describe('ConnectionStatusBanner', () => {
  const renderComponent = () => {
    const store = createStore()
    return render(<OnlineStatusBanner />, { store })
  }

  it('does not render a banner when online', () => {
    const { queryByText, store } = renderComponent()
    store.dispatch(onlineStatusChanged({ isOnline: true }))

    expect(queryByText(offlineMsg)).not.toBeInTheDocument()
    expect(queryByText(reconnectedMsg)).not.toBeInTheDocument()
  })

  it('renders an offline banner when its offline', () => {
    const { queryByText, store } = renderComponent()
    store.dispatch(onlineStatusChanged({ isOnline: false }))

    expect(queryByText(offlineMsg)).toBeInTheDocument()
  })

  it('renders a reconnected banner when it changes from offline to online', () => {
    const { queryByText, store } = renderComponent()

    store.dispatch(onlineStatusChanged({ isOnline: false }))
    expect(queryByText(offlineMsg)).toBeInTheDocument()

    store.dispatch(onlineStatusChanged({ isOnline: true }))
    expect(queryByText(reconnectedMsg)).toBeInTheDocument()
  })

  it('automatically removes banners after reconnecting', () => {
    const { queryByText, store } = renderComponent()

    store.dispatch(onlineStatusChanged({ isOnline: false }))
    store.dispatch(onlineStatusChanged({ isOnline: true }))
    expect(queryByText(reconnectedMsg)).toBeInTheDocument()

    jest.advanceTimersByTime(4000)

    expect(queryByText(offlineMsg)).not.toBeInTheDocument()
    expect(queryByText(reconnectedMsg)).not.toBeInTheDocument()
  })
})
