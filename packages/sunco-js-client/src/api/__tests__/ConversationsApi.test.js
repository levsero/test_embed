import ConversationsApi from '../ConversationsApi'

describe('ConversationsApi', () => {
  const createConversationsApi = (baseApiArgs, mockResponse) => {
    const conversationsApi = new ConversationsApi({
      ...baseApiArgs,
      baseUrl: 'www.zendesk.com',
      appId: 'app-id',
      integrationId: 'integration-id',
      user: {
        getCurrentAppUserIfAny: jest.fn().mockImplementation(() => ({
          clientId: 'client-id',
        })),
      },
    })

    conversationsApi.request = jest.fn().mockReturnValue(mockResponse)

    return conversationsApi
  }

  describe('list', () => {
    it('calls the conversations list API with the expected params', () => {
      const conversationsApi = createConversationsApi()
      conversationsApi.list('app-user-id')

      expect(conversationsApi.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          path: `/v2/apps/app-id/appusers/app-user-id/conversations`,
        })
      )
    })
  })
  describe('create', () => {
    it('calls the conversations create API with the expected params', () => {
      const conversationsApi = createConversationsApi()
      conversationsApi.create('app-user-id')

      expect(conversationsApi.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          path: `/v2/apps/app-id/appusers/app-user-id/conversations`,
        })
      )
    })
  })
})
