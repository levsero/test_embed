import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import MessageLog from 'src/apps/messenger/features/messageLog'
import { messageReceived } from 'src/apps/messenger/features/messageLog/store'

describe('MessageLog', () => {
  const renderComponent = () => render(<MessageLog />)

  it('renders the messages', () => {
    const { getByRole, store } = renderComponent()

    store.dispatch(
      messageReceived({
        message: {
          _id: 1,
          type: 'dummy',
          isLocalMessageType: true,
          received: 1,
          text: 'One'
        }
      })
    )

    store.dispatch(
      messageReceived({
        message: {
          _id: 2,
          type: 'dummy',
          isLocalMessageType: true,
          received: 2,
          text: 'Two'
        }
      })
    )

    expect(getByRole('log').children).toHaveLength(2)
  })

  it('does not render messages that have an unknown type', () => {
    const { getByRole, store } = renderComponent()

    store.dispatch(
      messageReceived({
        message: {
          _id: 1,
          type: 'dummy',
          isLocalMessageType: true,
          received: 1
        }
      })
    )

    store.dispatch(
      messageReceived({
        message: {
          _id: 2,
          type: 'unknown',
          received: 2
        }
      })
    )

    expect(getByRole('log').children).toHaveLength(1)
  })
})
