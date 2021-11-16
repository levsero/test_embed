import { waitFor } from '@testing-library/dom'
import errorTracker from 'src/framework/services/errorTracker'
import { messageReceived } from 'messengerSrc/features/suncoConversation/store'
import createStore from 'messengerSrc/store'
import { widgetToggled } from 'messengerSrc/store/visibility'
import trackNoMessageReceived from 'messengerSrc/utils/trackNoMessageReceived'

jest.mock('src/framework/services/errorTracker')

jest.useFakeTimers()

describe('trackNoMessageReceived', () => {
  it('tracks an error when no message was received within 3s after opening', async () => {
    const store = createStore()
    const promise = trackNoMessageReceived(store)

    store.dispatch(widgetToggled())

    jest.advanceTimersByTime(5000)

    await promise

    await waitFor(() => expect(errorTracker.error).toHaveBeenCalled())
  })

  it('does not track an error if a message was received within 3s after opening', async () => {
    const store = createStore()
    const promise = trackNoMessageReceived(store)

    store.dispatch(widgetToggled())
    store.dispatch(messageReceived({ message: { _id: '123' } }))

    jest.advanceTimersByTime(5000)

    await promise

    expect(errorTracker.error).not.toHaveBeenCalled()
  })
})
