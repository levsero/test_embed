import MessagesApi from '../MessagesApi'

describe('MessagesApi', () => {
  const createMessagesApi = (mockResponse) => {
    const messagesApi = new MessagesApi({
      baseUrl: 'www.zendesk.com',
      appId: 'app-id',
      integrationId: 'integration-id',
      appUserId: 'app-user-id',
    })

    messagesApi.request = jest.fn().mockReturnValue(mockResponse)

    return messagesApi
  }

  describe('list', () => {
    it('calls the messages API', async () => {
      const messagesApi = createMessagesApi()

      messagesApi.list('app-user-id', 'conversation-id')

      expect(messagesApi.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          path: `/v2/apps/app-id/conversations/conversation-id/messages`,
        })
      )
    })

    it('returns a list of messages', async () => {
      const mockMessages = [{ id: 1 }, { id: 2 }]
      const messagesApi = createMessagesApi(mockMessages)

      const result = await messagesApi.list('app-user-id', 'conversation-id')

      expect(result).toEqual(mockMessages)
    })

    it('accepts params so that messages can be paginated', async () => {
      const mockMessages = [{ id: 3 }, { id: 4 }]
      const messagesApi = createMessagesApi(mockMessages)

      messagesApi.list('app-user-id', 'conversation-id', {
        before: 'message-2',
      })

      expect(messagesApi.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          path: `/v2/apps/app-id/conversations/conversation-id/messages`,
          params: {
            before: 'message-2',
          },
        })
      )
    })
  })
})
