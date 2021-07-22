import { i18n } from 'src/apps/webWidget/services/i18n'
import {
  getDefaultSelectedDepartment,
  getVisiblePrechatFields,
  getPrechatGreeting,
} from 'src/embeds/chat/selectors/prechat-form'
import {
  getAccountDefaultDepartmentId,
  getDepartment,
  getDepartmentsList,
  getIsAuthenticated,
  getLoginSettings,
  getSocialLogin,
} from 'src/embeds/chat/selectors'
import {
  getDefaultFormFields,
  getPrechatFormFields,
  getPrechatFormSettings,
} from 'src/redux/modules/selectors'
import {
  getSettingsChatDepartment,
  getSettingsChatDepartmentsEnabled,
  getSettingsChatPrechatForm,
} from 'src/redux/modules/settings/settings-selectors'

jest.mock('src/redux/modules/selectors')
jest.mock('src/embeds/chat/selectors')
jest.mock('src/redux/modules/settings/settings-selectors')

describe('prechat form selectors', () => {
  describe('getVisiblePrechatFields', () => {
    const defaultOptions = {
      isAuthenticated: false,
      department: {
        status: 'online',
      },
      formFields: {},
      loginSettings: {
        enabled: true,
      },
      socialLogin: { authenticated: false },
      customerDefinedDepartments: undefined,
      prechatFormSettings: {},
      locale: 'en',
    }

    const run = (overrideOptions) => {
      const options = {
        ...defaultOptions,
        ...overrideOptions,
      }

      jest.spyOn(i18n, 'getLocale').mockReturnValue(options.locale)

      getIsAuthenticated.mockReturnValue(options.isAuthenticated)
      getPrechatFormFields.mockReturnValue(options.formFields)
      getDefaultFormFields.mockReturnValue(options.formFields)
      getLoginSettings.mockReturnValue(options.loginSettings)
      getSocialLogin.mockReturnValue(options.socialLogin)
      getDepartment.mockReturnValue(options.department)
      getSettingsChatDepartmentsEnabled.mockReturnValue(options.customerDefinedDepartments)
      getSettingsChatPrechatForm.mockReturnValue(options.prechatFormSettings)

      return getVisiblePrechatFields({}, {})
    }

    describe('name', () => {
      it('is not included when the user is authenticated', () => {
        const result = run({
          isAuthenticated: true,
        })

        const field = result.find((field) => field.id === 'name')
        expect(field).toBeUndefined()
      })

      it('is not included when the user is socially logged in', () => {
        const result = run({
          socialLogin: { authenticated: true },
        })

        const field = result.find((field) => field.id === 'name')
        expect(field).toBeUndefined()
      })

      it('is not included when login is disabled via the chat admin', () => {
        const result = run({
          loginSettings: {
            enabled: false,
          },
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

      it('is required when the department is offline', () => {
        const result = run({
          isAuthenticated: false,
          formFields: {
            name: {
              required: false,
            },
          },
          department: {
            status: 'offline',
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

      it('is not included when the user is socially logged in', () => {
        const result = run({
          socialLogin: { authenticated: true },
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

      it('is not included when login is disabled via the chat admin', () => {
        const result = run({
          loginSettings: {
            enabled: false,
          },
        })

        const field = result.find((field) => field.id === 'email')
        expect(field).toBeUndefined()
      })

      it('is not included when the user is socially logged in', () => {
        const result = run({
          socialLogin: { authenticated: true },
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

      it('is required when the department is offline', () => {
        const result = run({
          isAuthenticated: false,
          formFields: {
            email: {
              required: false,
            },
          },
          department: {
            status: 'offline',
          },
        })

        const field = result.find((field) => field.id === 'email')
        expect(field.required).toBe(true)
      })
    })

    describe('department', () => {
      it('is required when chat sdk says it is required', () => {
        const result = run({
          formFields: {
            department: {
              required: true,
            },
            departments: [{ id: 1 }, { id: 1 }],
          },
        })

        const department = result.find((field) => field.id === 'department')
        expect(department.required).toBe(true)
      })

      it('is not included when customer has used public apis to specify that no departments should be shown', () => {
        const result = run({
          formFields: {
            department: {
              required: true,
            },
            departments: [{ id: 1 }, { id: 1 }],
          },
          customerDefinedDepartments: [],
        })

        const field = result.find((field) => field.id === 'department')
        expect(field).toBeUndefined()
      })

      it('is not included when there are no departments', () => {
        const result = run({
          formFields: {
            department: {
              required: true,
            },
            departments: [],
          },
        })

        const field = result.find((field) => field.id === 'department')
        expect(field).toBeUndefined()
      })

      it('is not included if there is only one department and it is the default department', () => {
        const result = run({
          formFields: {
            department: {
              required: true,
            },
            departments: [
              {
                id: 1,
                isDefault: true,
              },
            ],
          },
        })

        const field = result.find((field) => field.id === 'department')
        expect(field).toBeUndefined()
      })

      it('is included when there is at least one non-default department', () => {
        const result = run({
          formFields: {
            department: {
              required: true,
            },
            departments: [
              {
                id: 1,
                isDefault: false,
              },
            ],
          },
        })

        const field = result.find((field) => field.id === 'department')
        expect(field).not.toBeUndefined()
      })

      it('uses the label defined in settings if it exists', () => {
        const result = run({
          prechatFormSettings: {
            departmentLabel: { '*': 'Label from settings' },
          },
          formFields: {
            departments: [
              {
                id: 1,
                isDefault: false,
              },
            ],
          },
        })

        const field = result.find((field) => field.id === 'department')
        expect(field.title).toBe('Label from settings')
      })

      it('uses the translated label defined in settings if it exists', () => {
        const result = run({
          locale: 'fr',
          prechatFormSettings: {
            departmentLabel: { fr: 'French label', '*': 'Fallback label' },
          },
          formFields: {
            departments: [
              {
                id: 1,
                isDefault: false,
              },
            ],
          },
        })

        const field = result.find((field) => field.id === 'department')
        expect(field.title).toBe('French label')
      })

      it('uses the label provided by chat if it exists and there is no override in settings', () => {
        const result = run({
          formFields: {
            department: {
              label: 'Label from chat',
            },
            departments: [
              {
                id: 1,
                isDefault: false,
              },
            ],
          },
        })

        const field = result.find((field) => field.id === 'department')
        expect(field.title).toBe('Label from chat')
      })

      it('uses a fallback label if no label defined in settings or from chat', () => {
        const result = run({
          formFields: {
            departments: [
              {
                id: 1,
                isDefault: false,
              },
            ],
          },
        })

        const field = result.find((field) => field.id === 'department')
        expect(field.title).toBe('Choose a department')
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

      it('is not included when login is disabled via the chat admin', () => {
        const result = run({
          loginSettings: {
            enabled: false,
          },
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
            enabled: true,
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

      it('is required when the department is offline', () => {
        const result = run({
          formFields: {
            message: {
              required: false,
            },
          },
          department: {
            status: 'offline',
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

  describe('getPrechatGreeting', () => {
    it('returns the prechat form greeting', () => {
      getPrechatFormSettings.mockReturnValue({
        message: 'Some message',
      })

      expect(getPrechatGreeting({})).toBe('Some message')
    })
  })

  describe('getDefaultSelectedDepartment', () => {
    getDepartmentsList.mockReturnValue([
      { id: 1, name: 'department' },
      { id: 2, name: 'sOmE dEpArTmEnT' },
      { id: 3, name: 'another department' },
    ])

    it('returns the department that matches the name specified in the settings', () => {
      getSettingsChatDepartment.mockReturnValue('some department')

      const result = getDefaultSelectedDepartment({})

      expect(result).toEqual({ id: 2, name: 'sOmE dEpArTmEnT' })
    })

    it('returns the department that matches the id specified in the settings', () => {
      getSettingsChatDepartment.mockReturnValue(2)

      const result = getDefaultSelectedDepartment({})

      expect(result).toEqual({ id: 2, name: 'sOmE dEpArTmEnT' })
    })

    it('returns the department that matches the id specified in the account as the default', () => {
      getAccountDefaultDepartmentId.mockReturnValue(2)

      const result = getDefaultSelectedDepartment({})

      expect(result).toEqual({ id: 2, name: 'sOmE dEpArTmEnT' })
    })
  })
})
