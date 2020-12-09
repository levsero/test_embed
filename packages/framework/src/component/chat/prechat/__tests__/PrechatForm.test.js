import { fireEvent, queryByText } from '@testing-library/react'
import { render } from 'src/util/testHelpers'
import React from 'react'

import { PrechatForm } from '../PrechatForm'
import { TEST_IDS } from 'constants/shared'

const mockFormProp = {
  name: { name: 'name', required: true },
  email: { name: 'email', required: true },
  phone: {
    name: 'phone',
    label: 'Phone Number',
    required: false,
    hidden: false
  },
  message: { name: 'message', label: 'Message', required: false },
  department: {
    name: 'department',
    label: 'Choose Department',
    required: false
  },
  departments: [{ name: 'dept', id: 1234, isDefault: false }]
}

const renderPrechatForm = (inProps = {}) => {
  const defaultProps = {
    title: 'title',
    form: mockFormProp,
    hasChatHistory: false,
    greetingMessage: 'Hi there this is a greeting message',
    initiateSocialLogout: () => {},
    isAuthenticated: false,
    openedChatHistory: () => {},
    chatHistoryLabel: 'Chat History here!'
  }

  const combinedProps = {
    ...defaultProps,
    ...inProps
  }

  const result = render(<PrechatForm {...combinedProps} />)

  const rerender = (updatedProps = {}) =>
    render(<PrechatForm {...combinedProps} {...updatedProps} />, { render: result.rerender })

  return {
    ...result,
    rerender
  }
}

test('renders a greeting message', () => {
  const { queryByText } = renderPrechatForm()

  expect(queryByText('Hi there this is a greeting message')).toBeInTheDocument()
})

test('renders the expected fields', () => {
  const { queryByLabelText } = renderPrechatForm()

  expect(queryByLabelText('Name')).toBeInTheDocument()
  expect(queryByLabelText('Email')).toBeInTheDocument()
  expect(queryByLabelText(/Phone Number/)).toBeInTheDocument()
  expect(queryByLabelText(/Message/)).toBeInTheDocument()
  expect(queryByLabelText(/Choose Department/)).toBeInTheDocument()
})

describe('Departments', () => {
  describe('when there are no departments', () => {
    it('does not show the department dropdown', () => {
      const formProp = {
        ...mockFormProp,
        departments: []
      }

      const { queryByLabelText } = renderPrechatForm({
        form: formProp
      })

      expect(queryByLabelText(/Choose Department/)).not.toBeInTheDocument()
    })
  })

  describe('when there is one department', () => {
    describe('and it is a default, hidden via api', () => {
      it('does not show the department dropdown', () => {
        const formProp = {
          ...mockFormProp,
          departments: [{ id: 1, status: 'online', isDefault: true }]
        }

        const { queryByLabelText } = renderPrechatForm({
          form: formProp,
          settingsDepartmentsEnabled: []
        })

        expect(queryByLabelText(/Choose Department/)).not.toBeInTheDocument()
      })
    })

    describe('and it is not default', () => {
      it('shows the department dropdown', () => {
        const formProp = {
          ...mockFormProp,
          departments: [{ id: 1, status: 'online', isDefault: false }]
        }

        const { queryByLabelText } = renderPrechatForm({
          form: formProp
        })

        expect(queryByLabelText(/Choose Department/)).toBeInTheDocument()
      })
    })
  })

  describe('when there are more than one departments', () => {
    it('shows the department dropdown', () => {
      const formProp = {
        ...mockFormProp,
        departments: [
          { id: 1, status: 'online', isDefault: false },
          { id: 2, status: 'offline', isDefault: true }
        ]
      }

      const { queryByLabelText } = renderPrechatForm({
        form: formProp
      })

      expect(queryByLabelText(/Choose Department/)).toBeInTheDocument()
    })
  })

  describe('when there is a default department', () => {
    let form,
      defaultDeptStatus = 'online',
      departments

    const render = () => {
      const formProp = {
        ...mockFormProp,
        departments
      }
      form = renderPrechatForm({
        form: formProp,
        defaultDepartment: {
          id: 1,
          status: defaultDeptStatus,
          isDefault: true,
          name: 'defaultDept'
        },
        formState: { department: 1 }
      })
    }

    describe('and it is online', () => {
      beforeEach(() => {
        departments = [
          { id: 1, status: 'online', isDefault: true, name: 'defaultDept' },
          { id: 2, status: 'online', isDefault: false, name: 'enabledDept' }
        ]
        defaultDeptStatus = 'online'
      })

      describe('"Choose a Department" default value', () => {
        it('defaults to department1', () => {
          render()

          expect(
            queryByText(
              form.baseElement.querySelector('[data-garden-id="dropdowns.select"]'),
              'defaultDept'
            )
          ).toBeInTheDocument()
        })
      })

      describe('but it is not enabled', () => {
        beforeEach(() => {
          departments = [{ id: 2, status: 'online', isDefault: false, name: 'enabledDept' }]
          render()
        })

        it('makes only department2 selectable in dropdown', () => {
          fireEvent.click(form.getByPlaceholderText('Choose a department'))

          expect(form.queryByLabelText('defaultDept')).not.toBeInTheDocument()

          expect(form.queryByText('enabledDept')).toBeInTheDocument()
        })
      })

      describe('and it is enabled', () => {
        beforeEach(() => {
          departments = [
            { id: 1, status: 'online', isDefault: true, name: 'defaultDept' },
            { id: 2, status: 'online', isDefault: false, name: 'enabledDept' }
          ]
          render()
        })

        it('makes both departments available in dropdown', () => {
          fireEvent.click(form.getByPlaceholderText('Choose a department'))

          expect(form.getByPlaceholderText('Choose a department').textContent).toEqual(
            'defaultDept'
          )

          expect(form.queryByText('enabledDept')).toBeInTheDocument()
        })
      })
    })

    describe('and it is offline', () => {
      beforeEach(() => {
        departments = [
          { id: 1, status: 'offline', isDefault: true, name: 'defaultDept' },
          { id: 2, status: 'online', isDefault: false, name: 'enabledDept' }
        ]
        defaultDeptStatus = 'offline'
        render()
      })

      it('defaults to null', () => {
        expect(form.queryByLabelText('defaultDept')).not.toBeInTheDocument()
      })

      it('makes only the enabled department available in the dropdown', () => {
        fireEvent.click(form.getByPlaceholderText('Choose a department'))

        expect(form.queryByText('enabledDept')).toBeInTheDocument()

        expect(form.queryByLabelText('defaultDept')).not.toBeInTheDocument()
      })
    })
  })
})

it('does not render the phone number field for authenticated users', () => {
  const { queryByLabelText } = renderPrechatForm({
    loginEnabled: true,
    phoneEnabled: true,
    isAuthenticated: true
  })

  expect(queryByLabelText('Phone Number (optional)')).not.toBeInTheDocument()
})

it('renders the phone number field for unauthenticated users', () => {
  const { queryByLabelText } = renderPrechatForm({
    loginEnabled: true,
    phoneEnabled: true,
    isAuthenticated: false
  })

  expect(queryByLabelText('Phone Number (optional)')).toBeInTheDocument()
})

test('renders fields as optional if required is false', () => {
  const formProp = {
    name: { name: 'name' },
    email: { name: 'email' },
    phone: {
      name: 'phone',
      label: 'Phone Number',
      required: false,
      hidden: false
    },
    message: { name: 'message', required: false }
  }
  const { queryByLabelText } = renderPrechatForm({
    form: formProp
  })

  expect(queryByLabelText('Name (optional)')).toBeInTheDocument()
  expect(queryByLabelText('Email (optional)')).toBeInTheDocument()
  expect(queryByLabelText('Phone Number (optional)')).toBeInTheDocument()
  expect(queryByLabelText('Message (optional)')).toBeInTheDocument()
})

describe('loginEnabled', () => {
  describe('when loginEnabled is false', () => {
    it('does not render user profile fields', () => {
      const { queryByTestId } = renderPrechatForm({
        loginEnabled: false,
        name: { required: true },
        email: { required: true },
        phone: { required: true }
      })

      expect(queryByTestId(TEST_IDS.NAME_FIELD)).toBeNull()
      expect(queryByTestId(TEST_IDS.EMAIL_FIELD)).toBeNull()
      expect(queryByTestId(TEST_IDS.PHONE_FIELD)).toBeNull()
    })
  })

  describe('when loginEnabled is true', () => {
    it('does render user profile fields', () => {
      const { queryByTestId } = renderPrechatForm({
        loginEnabled: true,
        name: { required: true },
        email: { required: true },
        phone: { required: true }
      })

      expect(queryByTestId(TEST_IDS.NAME_FIELD)).toBeInTheDocument()
      expect(queryByTestId(TEST_IDS.EMAIL_FIELD)).toBeInTheDocument()
      expect(queryByTestId(TEST_IDS.PHONE_FIELD)).toBeInTheDocument()
    })
  })
})

test('does not render phoneEnabled is true', () => {
  let formProp = {
    ...mockFormProp,
    phone: { name: 'phone', required: false, hidden: true }
  }
  const { queryByTestId } = renderPrechatForm({
    phoneEnabled: false,
    form: formProp
  })

  expect(queryByTestId(TEST_IDS.PHONE_FIELD)).not.toBeInTheDocument()
})

describe('submit button', () => {
  it('has the `Start chat` string when an online department is selected', () => {
    let formProp = {
      ...mockFormProp,
      departments: [{ name: 'department', id: 123, status: 'online' }]
    }

    const { queryByText } = renderPrechatForm({
      form: formProp,
      formState: { department: 123 }
    })

    expect(queryByText('Start chat')).toBeInTheDocument()
  })

  it('has the `Send message` string when an offline department is selected', () => {
    let formProp = {
      ...mockFormProp,
      departments: [{ name: 'department', id: 123, status: 'offline' }]
    }

    const { queryByText } = renderPrechatForm({
      form: formProp,
      formState: { department: 123 }
    })

    expect(queryByText('Send message')).toBeInTheDocument()
  })
})

describe('validation', () => {
  it('validates required fields', () => {
    const formProp = {
      name: { name: 'name', required: true },
      email: { name: 'email', required: true },
      phone: { name: 'phone', label: 'Phone Number', required: true },
      message: { name: 'message', label: 'Message', required: true },
      department: {
        name: 'department',
        label: 'Choose Department',
        required: true
      },
      departments: [{ name: 'dept', id: 1234, isDefault: false }]
    }
    const { getByText, queryByText } = renderPrechatForm({
      form: formProp
    })

    fireEvent.click(getByText('Start chat'))

    expect(queryByText('Please enter a valid name.')).toBeInTheDocument()
    expect(queryByText('Please enter a valid email address.')).toBeInTheDocument()
    expect(queryByText('Please enter a valid phone number.')).toBeInTheDocument()
    expect(queryByText('Please enter a valid message.')).toBeInTheDocument()
    expect(queryByText('Please select a department.')).toBeInTheDocument()
  })

  it('validates email value is a valid email', () => {
    const formProp = {
      name: { name: 'name', required: true },
      email: { name: 'email', required: false },
      phone: { name: 'phone', required: false },
      message: { name: 'message', required: false }
    }
    const { getByText, queryByText } = renderPrechatForm({
      form: formProp,
      formState: { email: 'sadfasdfsfd' }
    })

    fireEvent.click(getByText('Start chat'))

    expect(queryByText('Please enter a valid email address.')).toBeInTheDocument()
  })

  it('validates phone number value is a valid phone number', () => {
    const { getByText, queryByText } = renderPrechatForm({
      formState: { phone: 'sadfasdfsfd' }
    })

    fireEvent.click(getByText('Start chat'))

    expect(queryByText('Please enter a valid phone number.')).toBeInTheDocument()
  })
})

test('submits expected form data', () => {
  jest.useFakeTimers()
  const formData = {
    email: 'me@zd.com',
    name: 'Homer Simpson',
    phone: '555-555-5555',
    message: 'This is the message',
    department: {
      name: 'department',
      label: 'Choose Department',
      required: false
    },
    departments: [{ name: 'dept', id: 1234, isDefault: false }]
  }
  const formHandler = jest.fn()
  const { getByText } = renderPrechatForm({
    formState: formData,
    onFormCompleted: formHandler
  })

  jest.runAllTimers()

  fireEvent.click(getByText('Start chat'))

  expect(formHandler).toHaveBeenCalledWith(formData)
})

describe('social logins', () => {
  describe('when there is at least one social login available', () => {
    it('render the social login section', () => {
      const { getByText } = renderPrechatForm({
        form: mockFormProp,
        authUrls: {
          google:
            'https://www.zopim.com/auth/goggle/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY'
        }
      })

      expect(getByText('Or social sign in:')).toBeInTheDocument()
    })

    it('renders social login icon buttons ', () => {
      const { queryByTestId } = renderPrechatForm({
        form: mockFormProp,
        authUrls: {
          google:
            'https://www.zopim.com/auth/goggle/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY',
          facebook:
            'https://www.zopim.com/auth/facebook/3DsjCpVY6RGFpfrfQk88xJ6DqnM82JMJ-mJhKBcIWnWUWJY'
        }
      })

      expect(queryByTestId(TEST_IDS.ICON_GOOGLE)).toBeInTheDocument()
      expect(queryByTestId(TEST_IDS.ICON_FACEBOOK)).toBeInTheDocument()
    })
  })

  describe('when there are no social logins availalble', () => {
    it('does not render the social login section', () => {
      const { queryByText } = renderPrechatForm({
        form: mockFormProp,
        authUrls: {}
      })

      expect(queryByText('Or social sign in:')).not.toBeInTheDocument()
    })
  })
})