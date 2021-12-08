import { waitFor } from '@testing-library/dom'
import userEvent from '@testing-library/user-event'
import { TEST_IDS } from 'classicSrc/constants/shared'
import { handlePrefillReceived } from 'classicSrc/redux/modules/base'
import { SET_VISITOR_INFO_REQUEST_SUCCESS } from 'classicSrc/redux/modules/chat/chat-action-types'
import { render } from 'classicSrc/util/testHelpers'
import { Component as OfflineForm } from '../'

jest.mock('classicSrc/embeds/chat/components/ViewHistoryButton', () => {
  return {
    __esModule: true,
    default: () => {
      return <div data-testid="viewHistoryButton" />
    },
  }
})

describe('OfflineForm', () => {
  const defaultProps = {
    authUrls: { google: 'googleUrl', facebook: 'facebookUrl' },
    formSettings: {
      channels: {
        facebook: { allowed: true, page_id: 'facebookPageId' },
        twitter: { allowed: true, page_id: 'twitterPageId' },
      },
      message: "Hey, here's a form message",
    },
    getFields: jest.fn().mockReturnValue([]),
    handleOperatingHoursClick: jest.fn(),
    initiateSocialLogout: jest.fn(),
    isAuthenticated: false,
    isPreview: false,
    operatingHours: { enabled: false },
    readOnlyValues: {},
    onSubmit: jest.fn(),
    setHasSubmitted: jest.fn(),
    socialLogin: { avatarPath: 'asd', authenticated: false, screen: '' },
    visitor: {},
  }

  const allFields = [
    {
      id: 'name',
      title: 'Name',
      required: true,
      visible: true,
      type: 'text',
    },
    {
      id: 'email',
      title: 'Email',
      required: true,
      visible: true,
      type: 'text',
    },
    {
      id: 'phone',
      title: 'Phone',
      required: true,
      visible: true,
      type: 'text',
    },
    {
      id: 'message',
      title: 'Message',
      required: true,
      visible: true,
      type: 'textarea',
    },
  ]

  const renderComponent = (props = {}, renderProps) => {
    return render(<OfflineForm {...defaultProps} {...props} />, renderProps)
  }

  it('renders the greeting message if one exists', () => {
    const { getByTestId, queryByText } = renderComponent()

    expect(queryByText("Hey, here's a form message")).toBeInTheDocument()
    expect(getByTestId(TEST_IDS.FORM_GREETING_MSG)).toBeInTheDocument()
  })

  it('does not render a greeting message if it does not exist', () => {
    const { queryByTestId, queryByText } = renderComponent({
      formSettings: {
        channels: {
          facebook: { allowed: true, page_id: 'facebookPageId' },
          twitter: { allowed: true, page_id: 'twitterPageId' },
        },
      },
    })

    expect(queryByText("Hey, here's a form message")).not.toBeInTheDocument()
    expect(queryByTestId(TEST_IDS.FORM_GREETING_MSG)).not.toBeInTheDocument()
  })

  it('respects the prefill read only values', () => {
    const { getByLabelText } = renderComponent({
      getFields: () => allFields,
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

  it('updates when the prefill command has been called', async () => {
    const { getByLabelText, store } = renderComponent({
      getFields: () => allFields,
    })

    const name = getByLabelText('Name')
    const email = getByLabelText('Email')
    const phone = getByLabelText('Phone')

    await userEvent.type(name, 'Name 1')
    await userEvent.type(email, 'email1@example.com')
    await userEvent.type(phone, '111 111 111')

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

    await waitFor(() => expect(name).toHaveValue('Name 2'))
    expect(email).toHaveValue('email2@example.com')
    expect(phone).toHaveValue('222 222 222')
  })

  it('updates when the identify command has been called', async () => {
    const { getByLabelText, store } = renderComponent({
      getFields: () => allFields,
    })

    const name = getByLabelText('Name')
    const email = getByLabelText('Email')
    const phone = getByLabelText('Phone')

    await userEvent.type(name, 'Name 1')
    await userEvent.type(email, 'email1@example.com')
    await userEvent.type(phone, '111 111 111')

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

    await waitFor(() => expect(name).toHaveValue('Name 2'))
    expect(email).toHaveValue('email2@example.com')
  })

  describe('when values are empty', () => {
    it('fails to submit, ', async () => {
      const onSubmit = jest.fn()
      const { getByText } = renderComponent({
        getFields: () => allFields,
        onSubmit,
      })

      await userEvent.click(getByText('Send message'))

      expect(onSubmit).not.toHaveBeenCalled()
    })

    it('renders errors for required fields on submit', async () => {
      const { getByText, rerender } = renderComponent({
        getFields: () => allFields,
      })

      await userEvent.click(getByText('Send message'))

      renderComponent({ getFields: () => allFields }, { render: rerender })

      expect(getByText('Enter a valid name.')).toBeInTheDocument()
      expect(getByText('Enter a valid email address.')).toBeInTheDocument()
      expect(getByText('Enter a valid phone number.')).toBeInTheDocument()
      expect(getByText('Enter a valid message.')).toBeInTheDocument()
    })

    const inputIntoFields = async (getByLabelText) => {
      const name = getByLabelText('Name')
      const email = getByLabelText('Email')
      const phone = getByLabelText('Phone')
      const message = getByLabelText('Message')

      await userEvent.type(name, 'bob')
      await userEvent.type(email, 'bobSaget@test.com')
      await userEvent.type(phone, '123')
      await userEvent.type(message, 'hey, look at this working form')
    }

    it('hides errors when values are input into the fields', async () => {
      const onSubmit = jest.fn()
      const { getByLabelText, getByText, queryByText, rerender } = renderComponent({
        getFields: () => allFields,
        onSubmit,
      })

      const send = getByText('Send message')

      await userEvent.click(send)

      renderComponent({ getFields: () => allFields, onSubmit }, { render: rerender })

      expect(getByText('Enter a valid name.')).toBeInTheDocument()
      expect(getByText('Enter a valid email address.')).toBeInTheDocument()
      expect(getByText('Enter a valid phone number.')).toBeInTheDocument()
      expect(getByText('Enter a valid message.')).toBeInTheDocument()

      await inputIntoFields(getByLabelText)

      expect(queryByText('Enter a valid name.')).toBeNull()
      expect(queryByText('Enter a valid email.')).toBeNull()
      expect(queryByText('Enter a valid phone number.')).toBeNull()
      expect(queryByText('Enter a valid message.')).toBeNull()
    })

    it('submits when values are correct', async () => {
      const onSubmit = jest.fn()
      const { getByLabelText, getByText } = renderComponent({
        getFields: () => allFields,
        onSubmit,
      })

      const send = getByText('Send message')

      await inputIntoFields(getByLabelText)

      await userEvent.click(send)

      expect(onSubmit).toHaveBeenCalled()
    })
  })

  describe('authenticated profile', () => {
    describe('when user is authenticated', () => {
      it('renders the authenticated profile information', () => {
        const { getByText } = renderComponent({
          isAuthenticated: true,
        })

        expect(getByText('Your profile:')).toBeInTheDocument()
      })
    })

    describe('when user is not authenticated', () => {
      it('does not render the authenticated profile information', () => {
        const { queryByText } = renderComponent({
          isAuthenticated: false,
        })

        expect(queryByText('Your profile:')).toBeNull()
      })
    })
  })

  describe('operating hours', () => {
    describe('when operating hours is enabled', () => {
      it('renders operating hours link', () => {
        const { getByText } = renderComponent({ operatingHours: { enabled: true } })

        expect(getByText('Our Operating Hours')).toBeInTheDocument()
      })
    })

    describe('when operating hours is disabled', () => {
      it('does not render operating hours link', () => {
        const { queryByText } = renderComponent({ operatingHours: { enabled: false } })
        expect(queryByText('Our Operating Hours')).toBeNull()
      })
    })
  })

  describe('ChatMessagingChannels', () => {
    describe('when there is at least one messaging channel', () => {
      it('renders the messaging channels component', () => {
        const { getByText } = renderComponent({ channels: { testChannel: true } })

        expect(getByText('Contact us here')).toBeInTheDocument()
      })
    })

    describe('when there are no messaging channels', () => {
      it("doesn't render the messaging channels component", () => {
        const { getByText } = renderComponent({ channels: {} })

        expect(getByText('Contact us here')).toBeInTheDocument()
      })
    })
  })

  it("renders a button to view the user's chat history", () => {
    const { getByTestId } = renderComponent({})

    expect(getByTestId('viewHistoryButton')).toBeInTheDocument()
  })

  it('renders a submit button', () => {
    const { getByRole } = renderComponent()

    getByRole('button', { name: 'Send message' })
  })
})
