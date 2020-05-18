import React from 'react'
import { render } from 'src/util/testHelpers'
import { Component as PrechatForm } from '../'
import { TEST_IDS } from 'constants/shared'
import { wait } from '@testing-library/react'
import { fireEvent } from '@testing-library/dom'
import { setDefaultDepartment } from 'src/redux/modules/chat'
import { handlePrefillReceived } from 'src/redux/modules/base'
import { SET_VISITOR_INFO_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'

jest.mock('src/embeds/chat/components/ViewHistoryButton', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="history button" />
    }
  }
})

describe('PrechatForm', () => {
  const defaultProps = {
    title: 'Chat',
    greetingMessage: 'Greeting message',
    getFields: jest.fn().mockReturnValue([]),
    departments: {},
    socialLogin: {
      authenticated: false
    },
    visitor: {},
    initiateSocialLogout: jest.fn()
  }

  const allFields = [
    {
      id: 'name',
      title: 'Name',
      required: true,
      type: 'text'
    },
    {
      id: 'email',
      title: 'Email',
      required: true,
      type: 'text'
    },
    {
      id: 'department',
      title: 'Departments',
      required: true,
      type: 'dropdown',
      options: [{ value: 1, name: 'Department 1' }, { value: 2, name: 'Department 2' }]
    },
    {
      id: 'phone',
      title: 'Phone',
      required: true,
      type: 'text'
    }
  ]

  const renderComponent = (props = {}) => render(<PrechatForm {...defaultProps} {...props} />)

  it('displays the chat title', () => {
    const { queryByText } = renderComponent({
      title: 'Some title'
    })

    expect(queryByText('Some title')).toBeInTheDocument()
  })

  it('renders the view history button', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId('history button')).toBeInTheDocument()
  })

  it('renders the greeting message if one exists', async () => {
    const { queryByText } = renderComponent({
      greetingMessage: 'Greeting message'
    })

    await wait(() => expect(queryByText('Greeting message')).toBeInTheDocument())
  })

  it('does not render a greeting message if it does not exist', () => {
    const { queryByTestId } = renderComponent({
      greetingMessage: null
    })

    expect(queryByTestId(TEST_IDS.FORM_GREETING_MSG)).not.toBeInTheDocument()
  })

  it('renders the authenticated profile information if the user is authenticated', () => {
    const { getByText } = renderComponent({
      isAuthenticated: true
    })

    expect(getByText('Your profile:')).toBeInTheDocument()
  })

  describe('form', () => {
    it('calls submit with isDepartmentFieldVisible as true when the department was visible to the user', () => {
      const onSubmit = jest.fn()

      const { getByText } = renderComponent({
        getFields: () => [],
        onSubmit
      })

      fireEvent.click(getByText('Start chat'))

      expect(onSubmit).toHaveBeenCalledWith({
        values: {},
        isDepartmentFieldVisible: false
      })
    })

    it('calls submit with isDepartmentFieldVisible as false when the department was visible to the user', () => {
      const onSubmit = jest.fn()

      const { getByText } = renderComponent({
        getFields: () => [{ id: 'department', options: [] }],
        onSubmit
      })

      fireEvent.click(getByText('Start chat'))

      expect(onSubmit).toHaveBeenCalledWith({
        values: {},
        isDepartmentFieldVisible: true
      })
    })

    it('initialises with the provided default department', async () => {
      const { getByText } = renderComponent({
        getFields: () => [
          {
            id: 'department',
            title: 'Departments',
            required: true,
            type: 'dropdown',
            options: [{ value: 1, name: 'Department 1' }, { value: 2, name: 'Department 2' }]
          }
        ],
        defaultDepartment: 2
      })

      await wait(() => expect(getByText('Departments')).toBeInTheDocument())

      expect(getByText('Department 2')).toBeInTheDocument()
    })

    it('displays a start chat message in the submit button when contacting an online department', () => {
      const { getByText } = renderComponent({
        getFields: () => [
          {
            id: 'department',
            title: 'Departments',
            required: true,
            type: 'dropdown',
            options: [{ value: 1, name: 'Department 1' }, { value: 2, name: 'Department 2' }]
          }
        ],
        defaultDepartment: 1,
        departments: {
          1: {
            status: 'online'
          }
        }
      })

      expect(getByText('Start chat')).toBeInTheDocument()
    })

    it('displays a send message in the submit button when contacting an offline department', () => {
      const { getByText } = renderComponent({
        getFields: () => [
          {
            id: 'department',
            title: 'Departments',
            required: true,
            type: 'dropdown',
            options: [{ value: 1, name: 'Department 1' }, { value: 2, name: 'Department 2' }]
          }
        ],
        defaultDepartment: 1,
        departments: {
          1: {
            status: 'offline'
          }
        }
      })

      expect(getByText('Send message')).toBeInTheDocument()
    })

    it('respects the prefill read only values', () => {
      const { getByLabelText } = renderComponent({
        getFields: () => allFields,
        readOnlyValues: {
          name: true,
          email: false,
          phone: true
        }
      })

      expect(getByLabelText('Name')).toHaveAttribute('readonly')
      expect(getByLabelText('Email')).not.toHaveAttribute('readonly')
      expect(getByLabelText('Phone')).toHaveAttribute('readonly')
    })

    it('updates when department.select zESetting changes', async () => {
      const { getByText, queryByText, store } = renderComponent({
        getFields: () => allFields,
        defaultDepartment: 1
      })

      await wait(() => expect(getByText('Department 1')).toBeInTheDocument())

      store.dispatch(setDefaultDepartment(2, 123))

      await wait(() => expect(getByText('Department 2')).toBeInTheDocument())

      expect(queryByText('Department 1')).not.toBeInTheDocument()
    })

    it('updates when the prefill command has been called', async () => {
      const { getByLabelText, store } = renderComponent({
        getFields: () => allFields,
        defaultDepartment: 1
      })

      const name = getByLabelText('Name')
      const email = getByLabelText('Email')
      const phone = getByLabelText('Phone')

      fireEvent.input(name, { target: { value: 'Name 1' } })
      fireEvent.input(email, { target: { value: 'email1@example.com' } })
      fireEvent.input(phone, { target: { value: '111 111 111' } })

      expect(name).toHaveValue('Name 1')
      expect(email).toHaveValue('email1@example.com')
      expect(phone).toHaveValue('111 111 111')

      store.dispatch(
        handlePrefillReceived({
          name: { value: 'Name 2' },
          email: { value: 'email2@example.com' },
          phone: { value: '222 222 222' }
        })
      )

      await wait(() => expect(name).toHaveValue('Name 2'))
      expect(email).toHaveValue('email2@example.com')
      expect(phone).toHaveValue('222 222 222')
    })

    it('updates when the identify command has been called', async () => {
      const { getByLabelText, store } = renderComponent({
        getFields: () => allFields,
        defaultDepartment: 1
      })

      const name = getByLabelText('Name')
      const email = getByLabelText('Email')
      const phone = getByLabelText('Phone')

      fireEvent.input(name, { target: { value: 'Name 1' } })
      fireEvent.input(email, { target: { value: 'email1@example.com' } })
      fireEvent.input(phone, { target: { value: '111 111 111' } })

      expect(name).toHaveValue('Name 1')
      expect(email).toHaveValue('email1@example.com')
      expect(phone).toHaveValue('111 111 111')

      store.dispatch({
        type: SET_VISITOR_INFO_REQUEST_SUCCESS,
        payload: {
          display_name: 'Name 2',
          email: 'email2@example.com'
        }
      })

      await wait(() => expect(name).toHaveValue('Name 2'))
      expect(email).toHaveValue('email2@example.com')
    })
  })
})
