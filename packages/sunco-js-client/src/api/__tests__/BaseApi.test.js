import Request from '../../http/Request'
import { buildUrl } from '../../utils/path'
import BaseApi from '../BaseApi'

jest.mock('../../utils/constants')
jest.mock('../../utils/path')

const mockRequestResponse = jest.fn()
jest.mock('../../http/Request', () => {
  return jest.fn().mockImplementation(() => {
    return { response: mockRequestResponse }
  })
})

describe('BaseApi', () => {
  const createBaseApi = (baseApiArgs) => {
    const baseApi = new BaseApi({
      baseUrl: 'www.zendesk.com',
      appId: 'app-id',
      integrationId: 'integration-id',
      user: {
        getCurrentAppUserIfAny: jest.fn().mockImplementation(() => ({
          appUserId: 'app-user-id',
          clientId: 'client-id',
          sessionToken: 'session-token',
        })),
      },
      ...baseApiArgs,
    })

    return baseApi
  }

  describe('request', () => {
    describe('when authorization is required', () => {
      describe('and we have a jwt token', () => {
        it('sets the jwt token in the Authorization headers', () => {
          const baseApi = createBaseApi({
            user: {
              getCurrentAppUserIfAny: jest.fn().mockImplementation(() => ({
                jwt: 'some-jwt-token',
              })),
            },
          })
          baseApi.request({ authorizationRequired: true })

          expect(Request).toHaveBeenCalledWith(
            expect.objectContaining({
              headers: expect.objectContaining({
                Authorization: 'Bearer some-jwt-token',
              }),
            })
          )
        })
      })
      describe('and we do not have a jwt token', () => {
        it('sets the session token in the Authorization headers', () => {
          const baseApi = createBaseApi({})
          baseApi.request({ authorizationRequired: true })

          expect(Request).toHaveBeenCalledWith(
            expect.objectContaining({
              headers: expect.objectContaining({
                Authorization: `Basic ${btoa('app-user-id:session-token')}`,
              }),
            })
          )
        })
      })

      describe('when the initial request fails with a 401', () => {
        it('refetches the jwt token before trying again', async () => {
          const mockRefetchJWT = jest.fn().mockResolvedValue('new-jwt-token')
          const baseApi = createBaseApi({
            user: {
              getCurrentAppUserIfAny: jest.fn().mockImplementation(() => ({
                jwt: 'some-jwt-token',
              })),
              refetchJWT: mockRefetchJWT,
            },
          })
          mockRequestResponse
            .mockRejectedValueOnce({ status: 401 })
            .mockResolvedValueOnce({ status: 200 })
          jest.spyOn(baseApi, 'handleResponseFailure')
          await expect(baseApi.request({ authorizationRequired: true })).resolves.toEqual({
            status: 200,
          })
          expect(baseApi.handleResponseFailure).toHaveBeenCalledTimes(1)
          expect(mockRefetchJWT).toHaveBeenCalledTimes(1)
        })

        describe('and subsequent requests fail with a 401', () => {
          it('refetches the jwt token before trying again up to 3 times', async () => {
            const mockRefetchJWT = jest.fn().mockResolvedValue('new-jwt-token')
            const baseApi = createBaseApi({
              user: {
                getCurrentAppUserIfAny: jest.fn().mockImplementation(() => ({
                  jwt: 'some-jwt-token',
                })),
                refetchJWT: mockRefetchJWT,
              },
            })
            mockRequestResponse.mockRejectedValue({ status: 401 })
            jest.spyOn(baseApi, 'handleResponseFailure')
            await expect(baseApi.request({ authorizationRequired: true })).rejects.toEqual({
              status: 401,
            })
            expect(baseApi.handleResponseFailure).toHaveBeenCalledTimes(4)
            expect(mockRefetchJWT).toHaveBeenCalledTimes(3)
          })
        })
      })
    })
    describe('when authorization is not required', () => {
      it('does not set the authorization headers', () => {
        const baseApi = createBaseApi({})
        baseApi.request({ authorizationRequired: false })
        expect(Request).toHaveBeenCalledWith(
          expect.objectContaining({
            headers: expect.not.objectContaining({
              Authorization: expect.anything(),
            }),
          })
        )
      })
    })
  })

  it('builds the url with the correct path', () => {
    const baseApi = createBaseApi({})
    baseApi.request({ path: '/some/path' })
    expect(buildUrl).toHaveBeenCalledWith('www.zendesk.com', '/some/path')
  })
})
