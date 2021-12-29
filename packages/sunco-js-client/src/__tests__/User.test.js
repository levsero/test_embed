import AppUser from 'src/AppUser'
import storage from 'src/utils/storage'

describe('User', () => {
  beforeEach(() => {
    storage.setStorageType('variable')
  })

  describe('getCurrentAppUserIfAny', () => {
    describe('when all data is valid and available', () => {
      it('returns information about the user when sessionId is used', () => {
        const user = new AppUser({ integrationId: '123' })
        user.updateAppUser({
          appUserId: 'app-user',
          clientId: 'client-id',
          sessionToken: 'session-token',
        })

        const result = user.getCurrentAppUserIfAny()

        expect(result).toEqual({
          sessionToken: 'session-token',
          appUserId: 'app-user',
          clientId: 'client-id',
        })
      })

      it('returns information about the user when jwt is used and fetched', () => {
        const user = new AppUser({ integrationId: '123' })
        user.jwt = 'some-jwt'
        const mockGetJWTFn = jest.fn()
        user.updateAppUser({
          appUserId: 'app-user',
          clientId: 'client-id',
          getJWT: mockGetJWTFn,
          externalId: '123456',
        })

        const result = user.getCurrentAppUserIfAny()

        expect(result).toEqual({
          clientId: 'client-id',
          appUserId: 'app-user',
          jwt: 'some-jwt',
          getJWT: mockGetJWTFn,
          externalId: '123456',
        })
      })

      it('returns information about the user when jwt is used but not generated yet', () => {
        const user = new AppUser({ integrationId: '123' })
        const mockGetJWTFn = jest.fn()

        user.updateAppUser({
          appUserId: 'app-user',
          clientId: 'client-id',
          getJWT: mockGetJWTFn,
          externalId: '123456',
        })

        const result = user.getCurrentAppUserIfAny()

        expect(result).toEqual({
          clientId: 'client-id',
          appUserId: 'app-user',
          jwt: null,
          getJWT: mockGetJWTFn,
          externalId: '123456',
        })
      })
    })
  })

  describe('updateAppUser', () => {
    it('saves appUserId in storage if provided', () => {
      const user = new AppUser({ integrationId: '123' })
      user.updateAppUser({
        appUserId: 'new-app-user-id',
      })

      expect(storage.getItem(`123.appUserId`)).toBe('new-app-user-id')
    })

    it('saves sessionToken in storage if provided', () => {
      const user = new AppUser({ integrationId: '123' })
      user.updateAppUser({
        sessionToken: 'new-session-token',
      })

      expect(storage.getItem(`123.sessionToken`)).toBe('new-session-token')
    })

    it('saves clientId in storage if provided', () => {
      const user = new AppUser({ integrationId: '123' })
      user.updateAppUser({
        clientId: 'new-client-id',
      })

      expect(storage.getItem(`123.clientId`)).toBe('new-client-id')
    })

    it('saves getJWT locally if provided', () => {
      const user = new AppUser({ integrationId: '123' })
      const mockGetJWTFn = jest.fn()
      user.updateAppUser({
        getJWT: mockGetJWTFn,
      })
      expect(user.getJWT).toBe(mockGetJWTFn)
    })

    it('saves externalId locally if provided', () => {
      const user = new AppUser({ integrationId: '123' })
      user.updateAppUser({
        externalId: '123456',
      })
      expect(user.externalId).toBe('123456')
    })

    it('saves jwt locally if provided', () => {
      const user = new AppUser({ integrationId: '123' })
      user.updateAppUser({
        jwt: 'fakejwttoken',
      })
      expect(user.jwt).toBe('fakejwttoken')
    })
  })

  describe('removeAppUser', () => {
    it('removes all user data from storage', () => {
      const user = new AppUser({ integrationId: '123' })
      const mockGetJWTFn = jest.fn()
      user.jwt = 'some-jwt'
      user.updateAppUser({
        appUserId: 'app-user',
        clientId: 'client-id',
        sessionToken: 'session-token',
        getJWT: mockGetJWTFn,
        externalId: '123456',
      })

      user.removeAppUser()

      expect(storage.getItem(`123.clientId`)).toBe(undefined)
      expect(storage.getItem(`123.sessionId`)).toBe(undefined)
      expect(storage.getItem(`123.clientId`)).toBe(undefined)
      expect(user.getJWT).toBe(null)
      expect(user.jwt).toBe(null)
      expect(user.externalId).toBe(null)
    })
  })

  describe('generateJWT', () => {
    it('throws an error if no function to generate JWT has been provided', () => {
      const user = new AppUser({ integrationId: '123' })
      user.updateAppUser({
        appUserId: 'app-user',
        clientId: 'client-id',
        getJWT: null,
      })

      return expect(user.generateJWT()).rejects.toEqual(new Error('no JWT provided'))
    })

    it('resolves with the JWT', async () => {
      const user = new AppUser({ integrationId: '123' })
      const mockGetJWTFn = jest.fn((callback) => callback('some-jwt'))
      user.updateAppUser({
        appUserId: 'app-user',
        clientId: 'client-id',
        getJWT: mockGetJWTFn,
        externalId: '123456',
      })

      await user.generateJWT()
      expect(user.jwt).toBe('some-jwt')
    })

    it('throws an error if the getJWT function errors', async () => {
      const user = new AppUser({ integrationId: '123' })
      const mockGetJWTFn = jest.fn(() => {
        throw new Error('something')
      })
      user.updateAppUser({
        appUserId: 'app-user',
        clientId: 'client-id',
        getJWT: mockGetJWTFn,
      })

      return expect(user.generateJWT()).rejects.toEqual(new Error('something'))
    })

    it('removes the JWT promise cache on failure, so it can be tried again', async () => {
      const user = new AppUser({ integrationId: '123' })
      const mockGetJWTFn = jest.fn(() => {
        throw new Error('something')
      })
      user.updateAppUser({
        appUserId: 'app-user',
        clientId: 'client-id',
        getJWT: mockGetJWTFn,
      })

      try {
        await user.generateJWT()
      } catch {}

      try {
        await user.generateJWT()
      } catch {}

      expect(mockGetJWTFn).toHaveBeenCalledTimes(2)
    })
  })

  describe('getJWTFromCallback', () => {
    it('resolves with the jwtCallback', async () => {
      const user = new AppUser({ integrationId: '123' })
      const mockGetJWTFn = jest.fn((callback) => callback('some-jwt'))
      user.updateAppUser({
        appUserId: 'app-user',
        clientId: 'client-id',
        getJWT: mockGetJWTFn,
        externalId: '123456',
      })
      return expect(user.getJWTFromCallback(mockGetJWTFn)).resolves.toBe('some-jwt')
    })

    it('throws an error if the jwtCallback function errors', async () => {
      const user = new AppUser({ integrationId: '123' })
      const mockGetJWTFn = jest.fn(() => {
        throw new Error('something')
      })
      user.updateAppUser({
        appUserId: 'app-user',
        clientId: 'client-id',
        getJWT: mockGetJWTFn,
        externalId: '123456',
      })

      return expect(user.getJWTFromCallback(mockGetJWTFn)).rejects.toEqual(new Error('something'))
    })
  })
})
