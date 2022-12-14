import { waitFor, fireEvent } from '@testing-library/dom'
import MessageLog from 'messengerSrc/features/messageLog'
import { submitForm } from 'messengerSrc/features/messageLog/Message/messages/FormStructuredMessage/store'
import { activityReceived } from 'messengerSrc/features/suncoConversation/store'
import { render } from 'messengerSrc/utils/testHelpers'

let mockRetryFetchMessages = jest.fn()
jest.mock('messengerSrc/features/messageLog/hooks/useFetchMessages.js', () => () => ({
  fetchHistoryOnScrollTop: jest.fn(),
  isFetchingHistory: false,
  errorFetchingHistory: false,
  retryFetchMessages: mockRetryFetchMessages,
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
            type: 'text',
            received: 1,
            text: 'One',
            role: 'appUser',
          },
          {
            _id: 2,
            type: 'text',
            received: 2,
            text: 'Two',
            role: 'appUser',
          },
        ],
      },
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
            received: 1,
            submitted: false,
            fields: [
              {
                label: 'Form one',
                name: 'first_name',
                type: 'text',
                _id: '5f669695c511asdsd9877',
              },
            ],
          },
          {
            _id: 2,
            type: 'form',
            received: 2,
            submitted: true,
            fields: [
              {
                label: 'Form two',
                name: 'first_name',
                type: 'text',
                _id: '5f669695c511asdsd9877',
              },
            ],
          },
          {
            _id: 3,
            type: 'form',
            received: 3,
            submitted: false,
            fields: [
              {
                label: 'Form three',
                name: 'first_name',
                type: 'text',
                _id: '5f669695c511asdsd9877',
              },
            ],
          },
        ],
      },
    })

    const fulfilledAction = submitForm.fulfilled({ messages: [] })
    fulfilledAction.meta = {
      arg: {
        formId: 1,
      },
    }

    store.dispatch(fulfilledAction)

    expect(queryByText('Form one')).not.toBeInTheDocument()
    expect(queryByText('Form two')).not.toBeInTheDocument()
    expect(queryByText('Form three')).toBeInTheDocument()
  })

  describe('Activity Indicators', () => {
    const typingStarted = {
      data: { name: 'ABot' },
      role: 'appMaker',
      type: 'typing:start',
    }

    const typingStop = {
      data: { name: 'ABot' },
      role: 'appMaker',
      type: 'typing:stop',
    }

    const setupMessageLog = (store) => {
      store.dispatch({
        type: 'messageLog/fetchMessages/fulfilled',
        payload: {
          messages: [
            {
              _id: 1,
              type: 'text',
              received: 1,
              text: 'One',
              role: 'appUser',
            },
          ],
        },
      })
    }
    const quickReplies = [
      {
        type: 'reply',
        _id: '1',
        payload: 'one-payload',
        text: 'First quick reply',
        metadata: {
          one: 'metadata',
        },
      },
      {
        type: 'reply',
        _id: '2',
        payload: 'two-payload',
        text: 'Second quick reply',
        metadata: {
          two: 'metadata',
        },
      },
    ]

    it('renders the typing indicator on typing:start', async () => {
      const { getByLabelText, store } = renderComponent()
      setupMessageLog(store)
      store.dispatch(activityReceived({ activity: typingStarted }))

      await waitFor(() => expect(getByLabelText('ABot is typing...')).toBeInTheDocument()) // how to interpolate properly?
    })

    it('removes the typing indicator on typing:stop', async () => {
      const { queryByLabelText, store } = renderComponent()
      setupMessageLog(store)
      store.dispatch(activityReceived({ activity: typingStarted }))
      store.dispatch(activityReceived({ activity: typingStop }))

      expect(queryByLabelText('{{name}} is typing...')).not.toBeInTheDocument() // how to interpolate properly?
    })

    it('does not render a typing indicator when the last message is a Quick Reply', async () => {
      const { queryByLabelText, getByText, store } = renderComponent()
      setupMessageLog(store)
      store.dispatch({
        type: 'messageLog/fetchMessages/fulfilled',
        payload: {
          messages: [
            {
              _id: 2,
              type: 'text',
              received: 2,
              text: 'Quick Reply',
              role: 'appUser',
              actions: quickReplies,
            },
          ],
        },
      })
      store.dispatch(activityReceived({ activity: typingStarted }))

      expect(getByText('First quick reply')).toBeInTheDocument()
      expect(queryByLabelText('{{name}} is typing...')).not.toBeInTheDocument() // how to interpolate properly?
    })
  })

  describe('When messages fail to load', () => {
    it('renders an option to retry', () => {
      const { getByText, store } = renderComponent()
      store.dispatch({
        type: 'messageLog/fetchMessages/rejected',
      })
      const retryButton = getByText('Tap to retry')

      expect(retryButton).toBeInTheDocument()
    })

    it('retryFetchMessages is called when tap to retry is clicked', () => {
      const { getByText, store } = renderComponent()
      store.dispatch({ type: 'messageLog/fetchMessages/rejected' })
      const retryButton = getByText('Tap to retry')
      fireEvent.click(retryButton)

      expect(mockRetryFetchMessages).toHaveBeenCalled()
    })
  })
})
