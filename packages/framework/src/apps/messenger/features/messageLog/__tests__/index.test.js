import React from 'react'
import { render } from 'src/apps/messenger/utils/testHelpers'
import MessageLog from 'src/apps/messenger/features/messageLog'
import { submitForm } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'

jest.mock('src/apps/messenger/features/messageLog/hooks/useFetchMessages.js', () => () => ({
  fetchHistoryOnScrollTop: jest.fn(),
  isFetchingHistory: false,
  errorFetchingHistory: false,
  retryFetchMessages: jest.fn()
}))

describe('MessageLog', () => {
  const renderComponent = () => render(<MessageLog />)

  it('renders the messages', () => {
    const { queryByText, store } = renderComponent()
    store.dispatch({
      type: 'messageLog/fetchMessages/fulfilled',
      payload: {
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
      }
    })

    expect(queryByText('One')).toBeInTheDocument()
    expect(queryByText('Two')).toBeInTheDocument()
  })

  it('does not render form messages that have been successfully submitted', () => {
    const { queryByText, store } = renderComponent()
    store.dispatch({
      type: 'messageLog/fetchMessages/fulfilled',
      payload: {
        messages: [
          {
            _id: 1,
            type: 'form',
            isLocalMessageType: false,
            received: 1,
            submitted: false,
            fields: [
              {
                label: 'Form one',
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
                label: 'Form two',
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
                label: 'Form three',
                name: 'first_name',
                type: 'text',
                _id: '5f669695c511asdsd9877'
              }
            ]
          }
        ]
      }
    })

    const fulfilledAction = submitForm.fulfilled({ messages: [] })
    fulfilledAction.meta = {
      arg: {
        formId: 1
      }
    }

    store.dispatch(fulfilledAction)

    expect(queryByText('Form one')).not.toBeInTheDocument()
    expect(queryByText('Form two')).not.toBeInTheDocument()
    expect(queryByText('Form three')).toBeInTheDocument()
  })
})
