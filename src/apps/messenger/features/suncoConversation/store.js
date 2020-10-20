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

  dispatch(subscribeToSocketEvents())
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

export const subscribeToSocketEvents = createAsyncThunk(
  'subscribeToSuncoEvents',
  async (_, { dispatch }) => {
    const conversation = await getActiveConversation()
    conversation.socketClient.subscribe(event => {
      switch (event.type) {
        case 'message':
          if (getClient().wasMessageSentFromThisTab(event.message)) {
            return
          }
          dispatch(messageReceived({ message: event.message }))
          break
        case 'activity':
          dispatch(activityReceived({ activity: event.activity }))
          break
      }
    })
  }
)
