import { createAsyncThunk } from '@reduxjs/toolkit'

import { getActiveConversation, fetchMessages, getClient } from 'src/apps/messenger/api/sunco'
import { messageReceived } from 'src/apps/messenger/features/messageLog/store'
import { activityReceived } from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'

const waitForSocketToConnect = async (activeConversation, dispatch) => {
  const socketIsConnected = new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject('Timed out waiting for socket to connect'), 3000)
    activeConversation.socketClient.on('connected', async () => {
      clearTimeout(timeout)
      resolve(true)
    })
  })

  dispatch(subscribeToConversationEvents())
  return await socketIsConnected
}

export const startNewConversation = createAsyncThunk(
  'startNewConversation',
  async (_, { dispatch }) => {
    const activeConversation = await getActiveConversation()
    await waitForSocketToConnect(activeConversation, dispatch)
    const messagesResponse = await fetchMessages()
    return {
      messages: Array.isArray(messagesResponse?.body?.messages)
        ? messagesResponse?.body?.messages
        : [],
      conversationId: activeConversation.conversationId,
      appUserId: activeConversation.appUserId
    }
  }
)

export const fetchExistingConversation = createAsyncThunk(
  'fetchExistingConversation',
  async (_, { dispatch }) => {
    const activeConversation = await getActiveConversation()
    await waitForSocketToConnect(activeConversation, dispatch)
    const messagesResponse = await fetchMessages()
    return {
      lastRead: activeConversation.lastRead,
      ...messagesResponse.body
    }
  }
)

let conversationSocketHasAborted = false

const subscribeToConversationEvents = createAsyncThunk(
  'subscribeToConversationEvents',
  async (_, { dispatch }) => {
    const activeConversation = await getActiveConversation()

    activeConversation.socketClient.on('aborted', () => {
      conversationSocketHasAborted = true
    })

    activeConversation.socketClient.on('connected', async () => {
      if (conversationSocketHasAborted) {
        conversationSocketHasAborted = false
        dispatch(fetchExistingConversation())
      }
    })

    activeConversation.socketClient.on('message', message => {
      if (getClient().wasMessageSentFromThisTab(message)) {
        return
      }
      dispatch(messageReceived({ message }))
    })

    activeConversation.socketClient.on('activity', activity => {
      dispatch(activityReceived({ activity }))
    })

    activeConversation.socketClient.subscribe()
  }
)
