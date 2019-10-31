import React from 'react'
import { render } from '@testing-library/react'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'
import { Component as AgentScreen } from 'component/chat/agents/AgentScreen'
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types'

describe('AgentScreen', () => {
  const defaultProps = {
    activeAgents: {},
    updateChatScreen: jest.fn()
  }

  const renderComponent = (props = {}) => {
    return render(
      <Provider store={createStore()}>
        <AgentScreen {...defaultProps} {...props} />
      </Provider>
    )
  }

  it('renders the agent screen title', () => {
    const { queryByText } = renderComponent()

    expect(queryByText('Chat with us')).toBeInTheDocument()
  })

  it('navigates to the chatting screen when back button is clicked', () => {
    const updateChatScreen = jest.fn()

    const { queryByText } = renderComponent({ updateChatScreen })

    queryByText('Back to chat').click()

    expect(updateChatScreen).toHaveBeenCalledWith(CHATTING_SCREEN)
  })
})
