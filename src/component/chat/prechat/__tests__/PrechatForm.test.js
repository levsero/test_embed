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

  describe('when offline forms are disabled', () => {
    // PrechatForm seems very eager to call onPrechatFormChange on render with empty field values,
    // so this helper function will filter out all calls to onPrechatFormChange that weren't called by handleDepartmentGoingOffline
    const getDepartmentUpdateCalls = onPrechatFormChange =>
      onPrechatFormChange.mock.calls.filter(([changes]) => {
        const changedKeys = Object.keys(changes)
        return changedKeys.length === 1 && changedKeys[0] === 'department'
      })

    describe('when selected department is offline', () => {
      it('unsets the selected department', () => {
        const onPrechatFormChange = jest.fn()
        renderPrechatForm({
          selectedDepartment: {
            id: 123,
            name: 'Something',
            status: 'offline'
          },
          offlineFormEnabled: false,
          formState: {
            department: 123
          },
          onPrechatFormChange
        })

        expect(onPrechatFormChange).toHaveBeenCalledWith({ department: '' })
      })

      it('only calls onPrechatFormChange once to avoid potential infinite re-renders', () => {
        const onPrechatFormChange = jest.fn()
        const { queryByTestId } = renderPrechatForm({
          selectedDepartment: {
            id: 123,
            name: 'Something',
            status: 'offline'
          },
          offlineFormEnabled: false,
          formState: {
            department: 123
          },
          onPrechatFormChange
        })

        fireEvent.change(queryByTestId(TEST_IDS.EMAIL_FIELD), { target: { value: '1' } })
        fireEvent.change(queryByTestId(TEST_IDS.EMAIL_FIELD), { target: { value: '2' } })
        fireEvent.change(queryByTestId(TEST_IDS.EMAIL_FIELD), { target: { value: '3' } })

        expect(onPrechatFormChange).toHaveBeenCalledWith({ department: '' })
        expect(getDepartmentUpdateCalls(onPrechatFormChange)).toHaveLength(1)
      })
    })

    describe('when the selected department goes offline', () => {
      it('unsets the selected department', () => {
        const onPrechatFormChange = jest.fn()
        const { rerender } = renderPrechatForm({
          selectedDepartment: {
            id: 123,
            name: 'Something',
            status: 'online'
          },
          offlineFormEnabled: false,
          formState: {
            department: 123
          },
          onPrechatFormChange
        })

        expect(getDepartmentUpdateCalls(onPrechatFormChange)).toHaveLength(0)

        rerender({
          selectedDepartment: {
            id: 123,
            name: 'Something',
            status: 'offline'
          }
        })

        expect(onPrechatFormChange).toHaveBeenCalledWith({ department: '' })
      })
    })
  })
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

test('does not render phoneEnabled is true', () => {
  let formProp = {
    ...mockFormProp,
    phone: { name: 'phone', required: false, hidden: true }
  }
  const { queryByLabelText } = renderPrechatForm({
    phoneEnabled: false,
    form: formProp
  })

  expect(queryByLabelText(/Phone/)).not.toBeInTheDocument()
})

test('does not render contact information if loginEnabled is false', () => {
  const { queryByLabelText } = renderPrechatForm({
    loginEnabled: false
  })

  expect(queryByLabelText('Name')).not.toBeInTheDocument()
  expect(queryByLabelText('Email')).not.toBeInTheDocument()
  expect(queryByLabelText(/Phone Number/)).not.toBeInTheDocument()
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

describe('ChatHistoryLink', () => {
  describe('when Authenticated and Chat History exists', () => {
    it('contains link', () => {
      const { queryByText } = renderPrechatForm({
        isAuthenticated: true,
        hasChatHistory: true
      })

      expect(queryByText('Chat History here!')).toBeInTheDocument()
    })
  })

  describe('when values are false', () => {
    describe('when isAuthenticated is false', () => {
      it('does not contain link', () => {
        const { queryByText } = renderPrechatForm({
          isAuthenticated: false,
          hasChatHistory: true
        })

        expect(queryByText('Chat History here!')).not.toBeInTheDocument()
      })
    })

    describe('when hasChatHistory is false', () => {
      it('does not contain link', () => {
        const { queryByText } = renderPrechatForm({
          isAuthenticated: true,
          hasChatHistory: false
        })

        expect(queryByText('Chat History here!')).not.toBeInTheDocument()
      })
    })
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

      expect(queryByTestId('Icon--google')).toBeInTheDocument()
      expect(queryByTestId('Icon--facebook')).toBeInTheDocument()
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
