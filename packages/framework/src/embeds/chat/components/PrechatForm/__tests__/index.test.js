import { fireEvent } from '@testing-library/dom'
import { wait } from '@testing-library/react'
import { TEST_IDS } from 'src/constants/shared'
import { handlePrefillReceived } from 'src/redux/modules/base'
import { setDefaultDepartment } from 'src/redux/modules/chat'
import { SET_VISITOR_INFO_REQUEST_SUCCESS } from 'src/redux/modules/chat/chat-action-types'
import { SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE } from 'src/redux/modules/chat/chat-action-types'
import { render } from 'src/util/testHelpers'
import { Component as PrechatForm } from '../'

jest.mock('src/embeds/chat/components/ViewHistoryButton', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="history button" />
    },
  }
})

describe('PrechatForm', () => {
  const defaultProps = {
    title: 'Chat',
    greetingMessage: 'Greeting message',
    getVisibleFields: jest.fn().mockReturnValue([]),
    departments: {},
    socialLogin: {
      authenticated: false,
    },
    visitor: {},
    initiateSocialLogout: jest.fn(),
    initialValues: {
      name: 'initial name',
      email: 'initialEmail@example.com',
      message: 'initial message',
    },
  }

  const allFields = [
    {
      id: 'name',
      title: 'Name',
      required: true,
      type: 'text',
    },
    {
      id: 'email',
      title: 'Email',
      required: true,
      type: 'text',
    },
    {
      id: 'department',
      title: 'Departments',
      required: true,
      type: 'dropdown',
      options: [
        { value: 1, name: 'Department 1' },
        { value: 2, name: 'Department 2' },
      ],
    },
    {
      id: 'phone',
      title: 'Phone',
      required: true,
      type: 'text',
    },
    {
      id: 'message',
      title: 'Message',
      required: true,
      type: 'text',
    },
  ]

  const renderComponent = (props = {}) => render(<PrechatForm {...defaultProps} {...props} />)

  it('displays the chat title', () => {
    const { queryByText } = renderComponent({
      title: 'Some title',
    })

    expect(queryByText('Some title')).toBeInTheDocument()
  })

  it('renders the view history button', () => {
    const { queryByTestId } = renderComponent()

    expect(queryByTestId('history button')).toBeInTheDocument()
  })

  it('renders the greeting message if one exists', async () => {
    const { queryByText } = renderComponent({
      greetingMessage: 'Greeting message',
    })

    await wait(() => expect(queryByText('Greeting message')).toBeInTheDocument())
  })

  it('does not render a greeting message if it does not exist', () => {
    const { queryByTestId } = renderComponent({
      greetingMessage: null,
    })

    expect(queryByTestId(TEST_IDS.FORM_GREETING_MSG)).not.toBeInTheDocument()
  })

  it('renders the authenticated profile information if the user is authenticated', () => {
    const { getByText } = renderComponent({
      isAuthenticated: true,
    })

    expect(getByText('Your profile:')).toBeInTheDocument()
  })

  describe('form', () => {
    it('calls submit with isDepartmentFieldVisible as true when the department was visible to the user', async () => {
      const onSubmit = jest.fn(() => new Promise(() => {}))

      const { getByText } = renderComponent({
        getVisibleFields: () => [
          {
            id: 'department',
            options: [{ id: 1, value: 'dep 1' }],
          },
        ],
        onSubmit,
      })

      fireEvent.click(getByText('Start chat'))

      expect(onSubmit).toHaveBeenCalledWith({
        values: {},
        isDepartmentFieldVisible: true,
      })
    })

    it('calls submit with isDepartmentFieldVisible as false when the department was not visible to the user', () => {
      const onSubmit = jest.fn(() => new Promise(() => {}))

      const { getByText } = renderComponent({
        getVisibleFields: () => [],
        onSubmit,
      })

      fireEvent.click(getByText('Start chat'))

      expect(onSubmit).toHaveBeenCalledWith({
        values: {},
        isDepartmentFieldVisible: false,
      })
    })

    it('displays a start chat message in the submit button when contacting an online department', () => {
      const { getByText } = renderComponent({
        getVisibleFields: () => [
          {
            id: 'department',
            title: 'Departments',
            required: true,
            type: 'dropdown',
            options: [
              { value: 1, name: 'Department 1' },
              { value: 2, name: 'Department 2' },
            ],
          },
        ],
        departments: {
          1: {
            status: 'online',
          },
        },
      })

      expect(getByText('Start chat')).toBeInTheDocument()
    })

    it('displays a send message in the submit button when contacting an offline department', async () => {
      const { getByText, store } = renderComponent({
        getVisibleFields: () => [
          {
            id: 'department',
            title: 'Departments',
            required: true,
            type: 'dropdown',
            options: [
              { value: 1, name: 'Department 1' },
              { value: 2, name: 'Department 2' },
            ],
            value: 1,
          },
        ],
        departments: {
          1: {
            status: 'offline',
          },
        },
      })

      store.dispatch(setDefaultDepartment(1, 123))
      await wait(() => expect(getByText('Department 1')).toBeInTheDocument())

      expect(getByText('Send message')).toBeInTheDocument()
    })

    it('only respects the initialValue for message', async () => {
      const { getByLabelText } = renderComponent({
        getVisibleFields: () => allFields,
      })

      const name = getByLabelText('Name')
      const email = getByLabelText('Email')
      const message = getByLabelText('Message')

      expect(name).toHaveValue('')
      expect(email).toHaveValue('')
      expect(message).toHaveValue('initial message')
    })

    it('respects the prefill read only values', () => {
      const { getByLabelText } = renderComponent({
        getVisibleFields: () => allFields,
        readOnlyValues: {
          name: true,
          email: false,
          phone: true,
        },
      })

      expect(getByLabelText('Name')).toHaveAttribute('readonly')
      expect(getByLabelText('Email')).not.toHaveAttribute('readonly')
      expect(getByLabelText('Phone')).toHaveAttribute('readonly')
    })

    it('updates when department.select zESetting changes', async () => {
      const { getByText, queryByText, store } = renderComponent({
        getVisibleFields: () => [
          {
            id: 'department',
            title: 'Departments',
            required: true,
            type: 'dropdown',
            options: [
              { value: 1, name: 'Department 1' },
              { value: 2, name: 'Department 2' },
            ],
          },
        ],
        departments: {
          1: { id: 1, name: 'Department 1', status: 'online' },
          2: { id: 2, name: 'Department 2', status: 'online' },
        },
      })

      store.dispatch(setDefaultDepartment(2, 123))
      await wait(() => expect(getByText('Department 2')).toBeInTheDocument())
      expect(queryByText('Department 1')).not.toBeInTheDocument()

      store.dispatch(setDefaultDepartment(1, 124))
      await wait(() => expect(getByText('Department 1')).toBeInTheDocument())
      expect(queryByText('Department 2')).not.toBeInTheDocument()
    })

    it('updates the department when the department is set via the websdk', async () => {
      const { getByText, store } = renderComponent({
        departments: {
          1: { id: 1, name: 'Department 1', status: 'online' },
        },
        getVisibleFields: () => allFields,
      })

      store.dispatch({
        type: SDK_VISITOR_DEFAULT_DEPARTMENT_UPDATE,
        payload: {
          detail: {
            id: 1,
          },
          timestamp: 123,
        },
      })

      await wait(() => expect(getByText('Department 1')).toBeInTheDocument())
    })

    it('updates when the prefill command has been called', async () => {
      const { getByLabelText, store } = renderComponent({
        getVisibleFields: () => allFields,
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
          phone: { value: '222 222 222' },
        })
      )

      await wait(() => expect(name).toHaveValue('Name 2'))
      expect(email).toHaveValue('email2@example.com')
      expect(phone).toHaveValue('222 222 222')
    })

    it('updates when the identify command has been called', async () => {
      const { getByLabelText, store } = renderComponent({
        getVisibleFields: () => allFields,
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
          email: 'email2@example.com',
        },
      })

      await wait(() => expect(name).toHaveValue('Name 2'))
      expect(email).toHaveValue('email2@example.com')
    })
  })
})
