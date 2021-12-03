import userEvent from '@testing-library/user-event'
import * as conversationStore from 'messengerSrc/features/suncoConversation/store'
import MessagePage from 'messengerSrc/features/widget/components/MessagePage'
import createStore from 'messengerSrc/store'
import { messengerConfigReceived } from 'messengerSrc/store/actions'
import { getIsWidgetOpen, widgetOpened } from 'messengerSrc/store/visibility'
import { render } from 'messengerSrc/utils/testHelpers'

jest.mock('messengerSrc/api/sunco')
jest.mock('messengerSrc/features/messageLog/hooks/useFetchMessages.js', () => () => ({
  fetchHistoryOnScrollTop: jest.fn(),
  isFetchingHistory: false,
  errorFetchingHistory: false,
  retryFetchMessages: jest.fn(),
}))

describe('MessagePage', () => {
  const renderComponent = (options) => render(<MessagePage />, options)

  it('renders the header', () => {
    const { getByText, store } = renderComponent()
    store.dispatch(messengerConfigReceived({ title: 'Company name' }))

    expect(getByText('Company name')).toBeInTheDocument()
  })

  it('closes the widget when the escape key is pressed', () => {
    const { store, getByPlaceholderText } = renderComponent()
    store.dispatch(widgetOpened())
    store.dispatch(conversationStore.startConversation.fulfilled({ messages: [] }))

    userEvent.type(getByPlaceholderText('Type a message'), '{esc}')

    expect(getIsWidgetOpen(store.getState())).toBe(false)
  })

  it('starts a sunco conversation if one is not active', () => {
    jest.spyOn(conversationStore, 'startConversation')

    renderComponent()

    expect(conversationStore.startConversation).toHaveBeenCalled()
  })

  it('does not start a conversation if one is already connected/connecting', () => {
    const store = createStore()
    store.dispatch(conversationStore.startConversation.pending())
    jest.spyOn(conversationStore, 'startConversation')

    renderComponent({ store })

    expect(conversationStore.startConversation).not.toHaveBeenCalled()
  })

  describe('when the conversation is active', () => {
    it('displays the message log', () => {
      const { store, queryByRole } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.fulfilled({ messages: [] }))

      expect(queryByRole('log')).toBeInTheDocument()
    })

    it('displays the footer', () => {
      const { store, queryByLabelText } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.fulfilled({ messages: [] }))

      expect(queryByLabelText('Type a message')).toBeInTheDocument()
    })

    it('renders Dropzone', async () => {
      const { store, getByTestId } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.fulfilled({ messages: [] }))

      expect(getByTestId('dropzone-container')).toBeInTheDocument()
    })
  })

  describe('when conversation is initiating', () => {
    it('does not display the message log', () => {
      const { store, queryByRole } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.pending())

      expect(queryByRole('log')).not.toBeInTheDocument()
    })

    it('does not display the footer', () => {
      const { store, queryByLabelText } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.pending())

      expect(queryByLabelText('Type a message')).not.toBeInTheDocument()
    })

    it('displays a loading spinner', () => {
      const { store, queryByRole } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.pending())

      expect(queryByRole('progressbar')).toBeInTheDocument()
    })
  })

  describe('when conversation has failed to initiate', () => {
    it('does not display the message log', () => {
      const { store, queryByRole } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.rejected())

      expect(queryByRole('log')).not.toBeInTheDocument()
    })

    it('does not display the footer', () => {
      const { store, queryByLabelText } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.rejected())

      expect(queryByLabelText('Type a message')).not.toBeInTheDocument()
    })

    it('displays a button to retry starting the conversation', () => {
      const { store, queryByText } = renderComponent()
      store.dispatch(widgetOpened())
      store.dispatch(conversationStore.startConversation.rejected())

      jest.spyOn(conversationStore, 'startConversation')

      userEvent.click(queryByText('Tap to retry'))

      expect(conversationStore.startConversation).toHaveBeenCalled()
    })
  })
})
