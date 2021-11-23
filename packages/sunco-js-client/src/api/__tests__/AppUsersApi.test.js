import AppUsersApi from '../AppUsersApi'

describe('AppUsersApi', () => {
  const createAppUsersApi = (baseApiArgs, mockResponse) => {
    const appUsersApi = new AppUsersApi({
      ...baseApiArgs,
      baseUrl: 'www.zendesk.com',
      appId: 'app-id',
      integrationId: 'integration-id',
      user: {
        getCurrentAppUserIfAny: jest.fn().mockImplementation(() => ({
          appUserId: undefined,
          clientId: 'client-id',
        })),
      },
    })

    appUsersApi.request = jest.fn().mockReturnValue(mockResponse)

    return appUsersApi
  }

  describe('login', () => {
    it('calls login with the expected params', () => {
      const appUsersApi = createAppUsersApi()
      appUsersApi.login(undefined, '123456')

      expect(appUsersApi.request).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            userId: '123456',
          }),
          method: 'POST',
          path: `/v2/apps/app-id/login`,
        })
      )
    })

    describe('when an appUserId is supplied', () => {
      it('calls login with the appUserId on the request body data', () => {
        const appUsersApi = createAppUsersApi({ appUserId: 'app-user-id' })
        appUsersApi.login('app-user-id', '123456')

        expect(appUsersApi.request).toHaveBeenCalledWith(
          expect.objectContaining({
            data: expect.objectContaining({
              appUserId: 'app-user-id',
            }),
          })
        )
      })
    })
  })

  describe('logout', () => {
    it('calls the logout API with the expected params', () => {
      const appUsersApi = createAppUsersApi()
      appUsersApi.logout('app-user-id')

      expect(appUsersApi.request).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          path: `/v2/apps/app-id/appusers/app-user-id/logout`,
        })
      )
    })
  })
})
