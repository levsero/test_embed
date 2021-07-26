import { getFields } from 'src/embeds/chat/selectors/offline-form'
import {
  getIsAuthenticated,
  getLoginSettings,
  getSocialLogin,
} from 'src/redux/modules/chat/chat-selectors'
import { getOfflineFormFields } from 'src/redux/modules/selectors'

jest.mock('src/redux/modules/selectors')
jest.mock('src/redux/modules/chat/chat-selectors')

describe('offline form selectors', () => {
  describe('getFields', () => {
    const defaultOptions = {
      isAuthenticated: false,
      formFields: {},
      socialLogin: { authenticated: false },
      loginSettings: {},
    }

    const run = (overrideOptions = {}) => {
      const options = {
        ...defaultOptions,
        ...overrideOptions,
      }

      getIsAuthenticated.mockReturnValue(options.isAuthenticated)
      getOfflineFormFields.mockReturnValue(options.formFields)
      getSocialLogin.mockReturnValue(options.socialLogin)
      getLoginSettings.mockReturnValue(options.loginSettings)

      return getFields({})
    }

    describe('name', () => {
      it('is not included when the user is authenticated', () => {
        const result = run({
          isAuthenticated: true,
        })

        const field = result.find((field) => field.id === 'name')
        expect(field).toBeUndefined()
      })

      it('is included when the user is not authenticated', () => {
        const result = run({
          isAuthenticated: false,
        })

        const field = result.find((field) => field.id === 'name')
        expect(field).not.toBeUndefined()
      })

      it('is required when chat sdk says it is required', () => {
        const result = run({
          isAuthenticated: false,
          formFields: {
            name: {
              required: true,
            },
          },
        })

        const field = result.find((field) => field.id === 'name')
        expect(field.required).toBe(true)
      })
    })

    describe('social login', () => {
      it('is not included when the user is authenticated', () => {
        const result = run({
          isAuthenticated: true,
        })

        const field = result.find((field) => field.id === 'socialLogin')
        expect(field).toBeUndefined()
      })

      it('is included when the user is not authenticated', () => {
        const result = run({
          isAuthenticated: false,
        })

        const field = result.find((field) => field.id === 'socialLogin')
        expect(field).not.toBeUndefined()
      })
    })

    describe('email', () => {
      it('is not included when the user is authenticated', () => {
        const result = run({
          isAuthenticated: true,
        })

        const field = result.find((field) => field.id === 'email')
        expect(field).toBeUndefined()
      })

      it('is included when the user is not authenticated', () => {
        const result = run({
          isAuthenticated: false,
        })

        const field = result.find((field) => field.id === 'email')
        expect(field).not.toBeUndefined()
      })

      it('is required when chat sdk says it is required', () => {
        const result = run({
          isAuthenticated: false,
          formFields: {
            email: {
              required: true,
            },
          },
        })

        const field = result.find((field) => field.id === 'email')
        expect(field.required).toBe(true)
      })
    })

    describe('phone', () => {
      it('is not included when the user is authenticated', () => {
        const result = run({
          isAuthenticated: true,
        })

        const field = result.find((field) => field.id === 'phone')
        expect(field).toBeUndefined()
      })

      it('is not included when login settings have phone disabled', () => {
        const result = run({
          isAuthenticated: false,
          loginSettings: {
            phoneEnabled: false,
          },
        })

        const field = result.find((field) => field.id === 'phone')
        expect(field).toBeUndefined()
      })

      it('is required when chat sdk says it is required', () => {
        const result = run({
          isAuthenticated: false,
          loginSettings: {
            phoneEnabled: true,
          },
          formFields: {
            phone: {
              required: true,
            },
          },
        })

        const field = result.find((field) => field.id === 'phone')
        expect(field.required).toBe(true)
      })
    })

    describe('message', () => {
      it('is required when chat sdk says it is required', () => {
        const result = run({
          formFields: {
            message: {
              required: true,
            },
          },
        })

        const field = result.find((field) => field.id === 'message')
        expect(field.required).toBe(true)
      })

      it('is always visible', () => {
        const result = run()

        const field = result.find((field) => field.id === 'message')
        expect(field).not.toBeUndefined()
      })
    })
  })
})
