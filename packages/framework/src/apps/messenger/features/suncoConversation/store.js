import { createAction, createAsyncThunk } from '@reduxjs/toolkit'
import {
  fetchMessages,
  getActiveConversation,
  getClient,
  updateSession,
} from 'src/apps/messenger/api/sunco'

export const messageReceived = createAction('message-received')
export const activityReceived = createAction('activity-received')
export const integrationLinked = createAction('integration-linked')
export const integrationLinkCancelled = createAction('integration-link-cancelled')
export const integrationLinkFailed = createAction('integration-link-failed')

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
      appUserId: activeConversation.appUserId,
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
      ...messagesResponse.body,
      integrations: activeConversation.integrations,
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

    activeConversation.socketClient.on('message', (message) => {
      if (getClient().wasMessageSentFromThisTab(message)) {
        return
      }
      dispatch(messageReceived({ message }))
    })

    activeConversation.socketClient.on('activity', (activity) => {
      dispatch(activityReceived({ activity }))
    })

    activeConversation.socketClient.on('link', (linkEvent) => {
      switch (linkEvent.type) {
        case 'link':
          {
            const { appUser, client } = linkEvent
            updateSession(appUser)
            dispatch(integrationLinked({ type: client.platform, clientId: client.id }))
          }
          break
        case 'link:cancelled':
          {
            const { client } = linkEvent
            dispatch(integrationLinkCancelled({ type: client.platform }))
          }
          break
        case 'link:failed':
          {
            const { client } = linkEvent
            dispatch(integrationLinkFailed({ type: client.platform }))
          }
          break
      }
    })

    activeConversation.socketClient.subscribe()
  }
)
