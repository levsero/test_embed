import React from 'react'
import MessagePage from 'src/apps/messenger/features/widget/components/MessagePage'
import { render } from 'src/apps/messenger/utils/testHelpers'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'
import { getIsWidgetOpen, widgetOpened } from 'src/apps/messenger/store/visibility'
import userEvent from '@testing-library/user-event'
import * as suncoApi from 'src/apps/messenger/api/sunco'
import * as conversationStore from 'src/apps/messenger/features/suncoConversation/store'

jest.mock('src/apps/messenger/api/sunco')
jest.mock('src/apps/messenger/features/messageLog/hooks/useFetchMessages.js', () => () => ({
  fetchHistoryOnScrollTop: jest.fn(),
  isFetchingHistory: false,
  errorFetchingHistory: false,
  retryFetchMessages: jest.fn(),
}))

describe('MessagePage', () => {
  const renderComponent = () => render(<MessagePage />)

  it('renders the header', () => {
    const { getByText, store } = renderComponent()
    store.dispatch(messengerConfigReceived({ title: 'Company name' }))

    expect(getByText('Company name')).toBeInTheDocument()
  })

  it('closes the widget when the escape key is pressed', () => {
    const { store, getByPlaceholderText } = renderComponent()
    store.dispatch(widgetOpened())

    userEvent.type(getByPlaceholderText('Type a message'), '{esc}')

    expect(getIsWidgetOpen(store.getState())).toBe(false)
  })

  it('starts a new sunco conversation when there is no existing conversation', () => {
    jest.spyOn(conversationStore, 'startNewConversation')

    renderComponent()

    expect(conversationStore.startNewConversation).toHaveBeenCalled()
  })

  it('does not start a new conversation when there is an existing one', () => {
    jest.spyOn(suncoApi, 'hasExistingConversation').mockReturnValue(true)
    jest.spyOn(conversationStore, 'startNewConversation')

    renderComponent()

    expect(conversationStore.startNewConversation).not.toHaveBeenCalled()
  })
})
