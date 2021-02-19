import userEvent from '@testing-library/user-event'
import { waitFor, screen, fireEvent } from '@testing-library/dom'
import { render } from 'src/apps/messenger/utils/testHelpers'
import FormStructuredMessage from '../'
import { sendFormResponse } from 'src/apps/messenger/api/sunco'
import { getFormInfo } from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'

jest.mock('src/apps/messenger/api/sunco')

describe('FormMessage', () => {
  const defaultProps = {
    message: {
      _id: '123',
      isFirstInGroup: false,
      fields: [
        {
          _id: 'field-1',
          type: 'text',
          name: 'first_name',
          label: 'First name',
        },
        {
          _id: 'field-2',
          type: 'email',
          name: 'email',
          label: 'Email',
        },
        {
          _id: 'field-3',
          type: 'select',
          name: 'favourite_food',
          label: 'Favourite food',
          options: [
            {
              _id: 'option-1',
              label: 'Tacos',
            },
            {
              _id: 'option-2',
              label: 'Cheese',
            },
          ],
        },
      ],
      avatarUrl: 'www.example.com/cat.jpg',
      name: 'Some user',
    },
  }

  const renderComponent = (props = {}, options = {}) => {
    return render(<FormStructuredMessage {...defaultProps} {...props} />, options)
  }

  it('renders the form, beginning with step one', () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('First name')).toBeInTheDocument()
    expect(queryByLabelText('Email')).not.toBeInTheDocument()
    expect(queryByLabelText('Favourite food')).not.toBeInTheDocument()
  })

  it('reveals the next step when field passes validation', async () => {
    const { queryByLabelText } = renderComponent()

    expect(queryByLabelText('First name')).toBeInTheDocument()
    expect(queryByLabelText('Email')).not.toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), 'Bobby')
    userEvent.type(queryByLabelText('First name'), '{enter}')

    await waitFor(() => expect(queryByLabelText('Email')).toBeInTheDocument())
  })

  it('displays an error when the user tries to go to the next step without filling out the current field', () => {
    const { queryByLabelText, queryByText } = renderComponent()

    expect(queryByLabelText('First name')).toBeInTheDocument()
    expect(queryByLabelText('Email')).not.toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), '{enter}')

    expect(queryByLabelText('Email')).not.toBeInTheDocument()
    expect(queryByText('This field is required')).toBeInTheDocument()
  })

  it('displays an error when the user tries to go to the next step after entering an invalid email', () => {
    const { queryByLabelText, queryByText } = renderComponent()

    expect(queryByLabelText('First name')).toBeInTheDocument()
    expect(queryByLabelText('Email')).not.toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), 'Bobby')
    userEvent.type(queryByLabelText('First name'), '{enter}')

    userEvent.type(queryByLabelText('Email'), 'invalid email')
    userEvent.type(queryByLabelText('Email'), '{enter}')

    expect(queryByText('Enter a valid email address')).toBeInTheDocument()
  })

  it('does not validate a field until the user tries to go to the next step', () => {
    const { queryByLabelText, queryByText } = renderComponent()

    expect(queryByLabelText('First name')).toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), 'Bobby')
    userEvent.clear(queryByLabelText('First name'))

    expect(queryByText('This field is required')).not.toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), '{enter}')

    expect(queryByText('This field is required')).toBeInTheDocument()
  })

  it('validates fields on change after the user has tried to go to the next step', async () => {
    const { queryByLabelText, queryByText } = renderComponent()

    userEvent.type(queryByLabelText('First name'), '{enter}')
    expect(queryByText('This field is required')).toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), 'Bobby')
    expect(queryByText('This field is required')).not.toBeInTheDocument()

    userEvent.clear(queryByLabelText('First name'))
    await waitFor(() => expect(queryByText('This field is required')).toBeInTheDocument())
  })

  it('submits the form when all fields pass', async () => {
    const { queryByLabelText, getByText, store } = renderComponent()

    expect(queryByLabelText('First name')).toBeInTheDocument()
    expect(queryByLabelText('Email')).not.toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), 'Bobby')
    userEvent.type(queryByLabelText('First name'), '{enter}')

    userEvent.type(queryByLabelText('Email'), 'valid@example.com')
    userEvent.type(queryByLabelText('Email'), '{enter}')

    // Dropdown defaults to first, so click it to open dropdown
    userEvent.click(getByText('Tacos'))
    // Select cheese
    await waitFor(() => expect(getByText('Cheese')).toBeInTheDocument())
    userEvent.click(getByText('Cheese'))

    fireEvent.submit(document.querySelector('form'))

    expect(sendFormResponse).toHaveBeenCalledWith(
      [
        {
          type: 'text',
          name: 'first_name',
          label: 'First name',
          text: 'Bobby',
        },
        {
          type: 'email',
          name: 'email',
          label: 'Email',
          email: 'valid@example.com',
        },
        {
          type: 'select',
          name: 'favourite_food',
          label: 'Favourite food',
          select: [
            {
              _id: 'option-2',
              label: 'Cheese',
            },
          ],
        },
      ],
      '123'
    )

    await waitFor(() =>
      expect(getFormInfo(store.getState(), '123').formSubmissionStatus).toBe('success')
    )
  })

  it('prevents emails from being sent with invalid length', async () => {
    const { queryByLabelText } = renderComponent({
      message: {
        _id: '123',
        isFirstInGroup: false,
        isLastInGroup: false,
        fields: [
          {
            _id: 'field-2',
            type: 'email',
            name: 'email',
            label: 'Email',
          },
        ],
        avatarUrl: 'www.example.com/cat.jpg',
        name: 'Some user',
      },
    })

    userEvent.type(
      queryByLabelText('Email'),
      'anEmailThatExceedsTheMaximumLength@WeCreateReallyLongEmailsLikeSuperSuperSuperfluousWhyWouldYouEvenUseAnEmailThisLong.PleaseStopNow'
    )
    userEvent.type(queryByLabelText('Email'), '{enter}')

    fireEvent.submit(document.querySelector('form'))

    expect(screen.getByText('Enter 128 characters or less')).toBeInTheDocument()

    expect(sendFormResponse).not.toHaveBeenCalled()

    userEvent.type(queryByLabelText('Email'), '{backspace}{backspace}{backspace}')

    fireEvent.submit(document.querySelector('form'))

    expect(screen.queryByText('Enter 128 characters or less')).toBeNull()

    expect(sendFormResponse).toHaveBeenCalled()
  })

  it('persists the values after unmounting and re-mounting the form', () => {
    const { queryByLabelText, unmount, store } = renderComponent()

    expect(queryByLabelText('First name')).toBeInTheDocument()

    userEvent.type(queryByLabelText('First name'), 'Bobby')

    unmount()

    const { queryByLabelText: queryByLabelText2 } = renderComponent(undefined, {
      store,
    })

    expect(queryByLabelText2('First name')).toHaveValue('Bobby')
  })
})
