import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import MessageLog from 'src/apps/messenger/features/messageLog'
import { messageReceived, messagesReceived } from 'src/apps/messenger/features/messageLog/store'
import { submitForm } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'

jest.mock('src/apps/messenger/features/messageLog/hooks/useFetchMessages.js', () => () => ({
  fetchHistoryOnScrollTop: jest.fn(),
  isFetchingHistory: false
}))

describe('MessageLog', () => {
  const renderComponent = () => render(<MessageLog />)

  it('renders the loading when hasFetchedConversation is false', () => {
    const { getByRole } = renderComponent()

    expect(getByRole('progressbar')).toBeInTheDocument()
    expect(getByRole('log').children).toHaveLength(1)
  })

  it('renders the messages', () => {
    const { getByRole, store } = renderComponent()
    store.dispatch(
      messagesReceived({
        messages: [
          {
            _id: 1,
            type: 'dummy',
            isLocalMessageType: true,
            received: 1,
            text: 'One',
            role: 'appUser'
          },
          {
            _id: 2,
            type: 'dummy',
            isLocalMessageType: true,
            received: 2,
            text: 'Two',
            role: 'appUser'
          }
        ]
      })
    )

    expect(getByRole('log').children).toHaveLength(2)
  })

  it('does not render messages that have an unknown type', () => {
    const { getByRole, store } = renderComponent()
    store.dispatch(messagesReceived({ messages: [] }))

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

  it('does not render form messages that have been successfully submitted', () => {
    const { getByRole, store } = renderComponent()

    store.dispatch(
      messagesReceived({
        messages: [
          {
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
          },
          {
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
          },
          {
            _id: 3,
            type: 'form',
            received: 3,
            isLocalMessageType: false,
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
        ]
      })
    )

    const fulfilledAction = submitForm.fulfilled({ messages: [] })
    fulfilledAction.meta = {
      arg: {
        formId: 1
      }
    }

    store.dispatch(fulfilledAction)

    expect(getByRole('log').children).toHaveLength(1)
  })
})
