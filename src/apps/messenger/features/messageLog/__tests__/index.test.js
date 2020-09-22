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
          text: 'One',
          role: 'appUser'
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
          text: 'Two',
          role: 'appUser'
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

  it('does not render form messages that have already been submitted', () => {
    const { getByRole, store } = renderComponent()

    store.dispatch(
      messageReceived({
        message: {
          _id: 1,
          type: 'form',
          isLocalMessageType: false,
          received: 1,
          submitted: false,
          fields: [
            {
              label: 'Your first name?',
              name: 'first_name',
              type: 'text',
              _id: '5f669695c511asdsd9877'
            }
          ]
        }
      })
    )

    store.dispatch(
      messageReceived({
        message: {
          _id: 2,
          type: 'form',
          received: 2,
          isLocalMessageType: false,
          submitted: true,
          fields: [
            {
              label: 'Your first name?',
              name: 'first_name',
              type: 'text',
              _id: '5f669695c511asdsd9877'
            }
          ]
        }
      })
    )

    expect(getByRole('log').children).toHaveLength(1)
  })
})
