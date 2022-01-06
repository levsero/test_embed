import decodeJwt from 'jwt-decode'
import Sunco from '../Sunco'
import SocketClient from '../socket/SocketClient'

jest.mock('jwt-decode')
jest.mock('../socket/SocketClient')

const responseBodyWithConversation = {
  body: {
    settings: {
      realtime: {},
    },
    conversations: [
      {
        _id: 'test-conversation-id',
        participants: [{ userId: '123456', appUserId: 'test-appuser-id', unreadCount: 0 }],
      },
    ],
    appUser: {
      _id: 'test-appuser-id',
      userId: '123456',
      conversationStarted: true,
      clients: [{ platform: 'web' }],
    },
  },
}

const responseBodyWithoutConversation = {
  body: {
    appUser: {
      conversationStarted: false,
      _id: 'test-appuser-id',
    },
  },
}

describe('Sunco', () => {
  const createSunco = () => {
    const messengerConfig = {
      appId: '123',
      integrationId: '456',
      baseUrl: 'https://api.smooch.io/sdk',
    }

    const sunco = new Sunco(messengerConfig)

    return sunco
  }

  describe('loginUser', () => {
    describe('when a generateJWT function has been provided', () => {
      it('updates the app user with the generate jwt function', async () => {
        const fakeJWTFn = (callback) => callback('fakejwttoken')
        decodeJwt.mockReturnValue({ external_id: '123456' })
        const sunco = createSunco()
        sunco.user.updateAppUser = jest.fn()
        sunco.appUsers.login = jest.fn(() => Promise.resolve(responseBodyWithoutConversation))

        await sunco.loginUser(fakeJWTFn)

        expect(sunco.user.updateAppUser).toHaveBeenNthCalledWith(1, {
          getJWT: fakeJWTFn,
          externalId: '123456',
          jwt: 'fakejwttoken',
        })
      })
    })

    describe('when no generateJWT function has been provided', () => {
      it('throws an error if no generateJWT function has been provided', () => {
        const sunco = createSunco()

        expect(sunco.loginUser()).rejects.toEqual(new Error('no JWT provided'))
      })
    })

    describe('when an invalid generateJWT function has been provided', () => {
      it('throws an error if the generateJWT function fails to return a jwt token', () => {
        const invalidGenerateJWT = (callback) => callback(null)
        const sunco = createSunco()

        expect(sunco.loginUser(invalidGenerateJWT)).rejects.toEqual(new Error('Invalid jwt'))
      })

      it('throws an error if the external_id is not able to be decoded from the token', () => {
        decodeJwt.mockImplementation(() => {
          throw new Error('Unable to read external_id from JWT token')
        })
        const generateJWT = (callback) => callback('token')
        const sunco = createSunco()

        expect(sunco.loginUser(generateJWT)).rejects.toEqual(
          new Error('Unable to read external_id from JWT token')
        )
      })
    })

    describe('when a valid generateJWT function has been prvovided', () => {
      beforeEach(() => {
        decodeJwt.mockReturnValue({ external_id: '123456' })
      })

      describe('and the app user does not have a conversation', () => {
        it('updates the app user and does not set a conversation', async () => {
          const validGenerateJWT = (callback) => callback('jwtToken')

          const sunco = createSunco()
          sunco.user.generateJWT = jest.fn().mockImplementation(() => 'jwtToken')
          sunco.user.updateAppUser = jest.fn()
          sunco.appUsers.login = jest.fn(() => Promise.resolve(responseBodyWithoutConversation))

          const promise = sunco.loginUser(validGenerateJWT)

          await expect(promise).resolves.toEqual({ hasExternalIdChanged: false })
          expect(sunco.user.updateAppUser).toHaveBeenNthCalledWith(2, {
            appUserId: 'test-appuser-id',
          })
          expect(SocketClient).not.toHaveBeenCalled()
        })
      })

      describe('and the app user does have a conversation', () => {
        it('updates the app user and sets a conversation', async () => {
          const validGenerateJWT = (callback) => callback('jwtToken')

          const sunco = createSunco()
          sunco.user.generateJWT = jest.fn().mockImplementation(() => 'jwtToken')
          sunco.user.updateAppUser = jest.fn()
          sunco.appUsers.login = jest.fn(() => Promise.resolve(responseBodyWithConversation))
          sunco.conversationPromise = jest.fn()
          const promise = sunco.loginUser(validGenerateJWT)

          await expect(promise).resolves.toEqual(
            expect.objectContaining({ hasExternalIdChanged: false })
          )
          expect(sunco.user.updateAppUser).toHaveBeenNthCalledWith(2, {
            appUserId: 'test-appuser-id',
          })
          expect(SocketClient).toHaveBeenCalledWith(
            expect.objectContaining({
              appId: '123',
            })
          )
        })
      })

      describe('when the login call fails', () => {
        it('rejects the login request with an error message', async () => {
          const validGenerateJWT = (callback) => callback('jwtToken')
          const sunco = createSunco()
          sunco.user.generateJWT = jest.fn().mockImplementation(() => 'jwtToken')
          sunco.user.updateAppUser = jest.fn()
          const error = new Error('Error while attempting to login')
          sunco.appUsers.login = jest.fn().mockRejectedValueOnce(error)
          const promise = sunco.loginUser(validGenerateJWT)

          await expect(promise).rejects.toEqual({
            message: 'Error while attempting to login',
            error,
          })
        })
      })
    })
  })

  describe('logoutUser', () => {
    describe('when an appUserId and jwt exist', () => {
      describe('when there is an active conversation', () => {
        it('logs out the user and stops the conversation', async () => {
          const sunco = createSunco()
          sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
            appUserId: 'test-appuser-id',
            jwt: 'some-jwt-token',
          }))

          sunco.appUsers.logout = jest.fn(() => Promise.resolve())
          sunco._activeConversation = jest.fn()
          sunco._activeConversation.stopConversation = jest.fn()
          sunco.forgetUser = jest.fn()

          const promise = sunco.logoutUser()
          await expect(promise).resolves.toBeUndefined()
          expect(sunco._activeConversation.stopConversation).toHaveBeenCalled()
          expect(sunco.forgetUser).toHaveBeenCalled()
        })
      })

      describe('when there is not an active conversation', () => {
        it('logs out the user and does not have any active conversation to stop', async () => {
          const sunco = createSunco()
          sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
            appUserId: 'test-appuser-id',
            jwt: 'some-jwt-token',
          }))
          sunco.appUsers.logout = jest.fn(() => Promise.resolve())

          const promise = sunco.logoutUser()
          await expect(promise).resolves.toBeUndefined()
          expect(sunco._activeConversation).toBeNull()
        })
      })
    })

    describe('when the appUserId does not exist', () => {
      it('rejects the logout request with an error message', async () => {
        const sunco = createSunco()
        sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
          jwt: 'some-jwt-token',
        }))

        const promise = sunco.logoutUser()
        await expect(promise).rejects.toEqual({ message: 'No user to log out' })
      })
    })

    describe('when either the jwt does not exist', () => {
      it('rejects the logout request with an error message', async () => {
        const sunco = createSunco()
        sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
          appUserId: 'test-appuser-id',
        }))

        const promise = sunco.logoutUser()
        await expect(promise).rejects.toEqual({ message: 'No user to log out' })
      })
    })

    describe('when both the appUserId and jwt does not exist', () => {
      it('rejects the logout request with an error message', async () => {
        const sunco = createSunco()
        sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
          appUserId: null,
          jwt: null,
        }))

        const promise = sunco.logoutUser()
        await expect(promise).rejects.toEqual({ message: 'No user to log out' })
      })
    })

    describe('when the logout call fails', () => {
      it('rejects the logout request with an error message', async () => {
        const sunco = createSunco()
        sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
          appUserId: 'test-appuser-id',
          jwt: 'some-jwt-token',
        }))
        const error = new Error('Error while attempting to logout')
        sunco.appUsers.logout = jest.fn().mockRejectedValueOnce(error)

        const promise = sunco.logoutUser()
        await expect(promise).rejects.toEqual({
          message: 'Error while attempting to logout',
          error,
        })
      })
    })
  })

  describe('createConversation', () => {
    it('creates a new conversation for a user', async () => {
      const sunco = createSunco()
      sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
        appUserId: 'test-appuser-id',
      }))
      sunco.conversations.create = jest.fn(() => Promise.resolve(responseBodyWithConversation))
      const promise = sunco.createConversation()

      await expect(promise).resolves.toEqual(
        expect.objectContaining({ conversationId: 'test-conversation-id' })
      )
      expect(SocketClient).toHaveBeenCalledWith(
        expect.objectContaining({
          appId: '123',
        })
      )
    })

    describe('when the create conversation call fails', () => {
      it('rejects with an error message', async () => {
        const sunco = createSunco()
        sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
          appUserId: 'test-appuser-id',
        }))
        const error = new Error()
        sunco.conversations.create = jest.fn().mockRejectedValueOnce(error)

        const promise = sunco.createConversation()
        await expect(promise).rejects.toEqual(error)
      })
    })
  })

  describe('startConversation', () => {
    describe('when there is an existing active conversation', () => {
      it('returns that conversation', () => {
        const sunco = createSunco()
        sunco.activeConversation = jest.fn()

        expect(sunco.startConversation()).toEqual(sunco.activeConversation)
      })
    })

    describe('when there is not an existing active conversation', () => {
      describe('when there is an existing conversation promise', () => {
        it('returns that promise', () => {
          const sunco = createSunco()
          sunco.conversationPromise = jest.fn()

          expect(sunco.startConversation()).toEqual(sunco.conversationPromise)
        })
      })

      describe('when there is an appUserId', () => {
        describe('and the app user does not have a conversation', () => {
          it('creates a new conversation for that user', async () => {
            const sunco = createSunco()
            sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
              appUserId: 'test-appuser-id',
            }))
            sunco.appUsers.get = jest.fn(() => Promise.resolve(responseBodyWithoutConversation))
            sunco.createConversation = jest.fn()

            await sunco.startConversation()
            expect(sunco.createConversation).toHaveBeenCalled()
          })
        })

        describe('and the app user does have a conversation', () => {
          it('sets the active conversation', async () => {
            const sunco = createSunco()
            sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
              appUserId: 'test-appuser-id',
            }))
            sunco.appUsers.get = jest.fn(() => Promise.resolve(responseBodyWithConversation))
            const promise = sunco.startConversation()

            await expect(promise).resolves.toEqual(
              expect.objectContaining({ conversationId: 'test-conversation-id' })
            )
            expect(SocketClient).toHaveBeenCalledWith(
              expect.objectContaining({
                appId: '123',
              })
            )
          })
        })
      })

      describe('when no appUserId exists', () => {
        it('creates a new conversation for that user', async () => {
          const sunco = createSunco()
          sunco.user.getCurrentAppUserIfAny = jest.fn().mockImplementation(() => ({
            appUserId: null,
          }))
          sunco.createAppUser = jest.fn()

          await sunco.startConversation()
          expect(sunco.createAppUser).toHaveBeenCalled()
        })
      })
    })
  })
})
