import { render, fireEvent } from '@testing-library/react'
import React from 'react'
import { ThemeProvider } from 'styled-components'

import { IdManager } from '@zendeskgarden/react-selection'
import { i18n } from 'service/i18n'

import { SubmitTicketForm } from '../SubmitTicketForm'
import createStore from 'src/redux/createStore'
import { Provider } from 'react-redux'

jest.useFakeTimers()

const renderSubmitTicketForm = (props, renderer) => {
  const defaultProps = {
    attachmentSender: noop,
    submit: noop,
    formTitle: 'message',
    nameFieldRequired: false,
    nameFieldEnabled: true
  }
  const mergedProps = { ...defaultProps, ...props }
  const component = (
    <ThemeProvider theme={{}}>
      <Provider store={createStore()}>
        <SubmitTicketForm {...mergedProps} />
      </Provider>
    </ThemeProvider>
  )
  IdManager.setIdCounter(0)
  return renderer ? renderer(component) : render(component)
}

test('renders the expected components', () => {
  const { container } = renderSubmitTicketForm()

  expect(container).toMatchSnapshot()
})

test('renders the form title', () => {
  const { queryByText } = renderSubmitTicketForm({ formTitle: 'hello' })

  expect(queryByText('hello')).toBeInTheDocument()
})

describe('name field', () => {
  it('renders with correct props when it is required', () => {
    const { getByLabelText } = renderSubmitTicketForm({ nameFieldRequired: true })

    expect(getByLabelText('Your name').required).toEqual(true)
  })

  it('renders with the expected prop and label when it is not required', () => {
    const { getByLabelText } = renderSubmitTicketForm({ nameFieldRequired: false })

    expect(getByLabelText('Your name (optional)').required).toBeFalsy()
  })

  it('does not render the name field with it is not enabled', () => {
    const { container } = renderSubmitTicketForm({ nameFieldEnabled: false })

    expect(container.querySelector('input[name="name"]')).not.toBeInTheDocument()
  })
})

describe('email field', () => {
  it('renders with correct props', () => {
    const { getByLabelText } = renderSubmitTicketForm()

    expect(getByLabelText('Email address').required).toEqual(true)
  })
})

describe('description field', () => {
  it('renders with correct props', () => {
    const { getByLabelText } = renderSubmitTicketForm({
      activeTicketForm: null
    })

    expect(getByLabelText('How can we help you?').required).toEqual(true)
  })
})

describe('subject field', () => {
  it('renders with expected label', () => {
    const { queryByLabelText } = renderSubmitTicketForm({
      activeTicketForm: null,
      subjectEnabled: true
    })

    expect(queryByLabelText('Subject (optional)')).toBeInTheDocument()
  })
})

describe('footer', () => {
  it('renders scrollContainer without footer shadow when attachments and ticket fields are false', () => {
    const { container } = renderSubmitTicketForm()

    expect(container.querySelector('footer').className).not.toContain('footerShadow')
  })

  it('renders scrollContainer with footer when attachments are true', () => {
    const { container } = renderSubmitTicketForm({
      attachmentsEnabled: true
    })

    expect(container.querySelector('footer').className).toContain('footerShadow')
  })

  it('renders scrollContainer with footer when ticket fields are true', () => {
    const { container } = renderSubmitTicketForm({
      ticketFields: [1, 2, 3]
    })

    expect(container.querySelector('footer').className).toContain('footerShadow')
  })
})

describe('ticket forms', () => {
  /* eslint-disable camelcase */
  const activeTicketForm = {
    id: 1,
    raw_name: 'Ticket Formz',
    display_name: 'Ticket Forms'
  }
  const ticketFields = [
    { id: 1, type: 'text', title_in_portal: 'Description' },
    { id: 2, type: 'subject', title_in_portal: 'Subject' },
    { id: 4, type: 'text', description: 'blah blah', title_in_portal: 'Favorite Burger' },
    { id: 5, type: 'text', title_in_portal: 'Favorite Pizza', required_in_portal: true },
    {
      id: 6,
      type: 'text',
      title_in_portal: 'Favorite Drink',
      editable_in_portal: false,
      visible_in_portal: false
    },
    {
      id: 7,
      type: 'integer',
      title_in_portal: 'Favorite Integer',
      description: 'description number'
    },
    { id: 8, type: 'decimal', title_in_portal: 'Favorite Decimal', required_in_portal: true },
    {
      id: 9,
      type: 'description',
      title_in_portal: 'Favorite Description',
      required_in_portal: true
    },
    {
      id: 10,
      type: 'textarea',
      title_in_portal: 'Favorite Textarea'
    },
    {
      id: 11,
      type: 'checkbox',
      title_in_portal: 'Favorite Checkbox',
      description: 'this is the description',
      required_in_portal: true
    },
    {
      id: 12,
      type: 'tagger',
      title_in_portal: 'Favorite Tagger',
      description: 'this is the tagger description',
      custom_field_options: [
        { name: 'one', value: '1' },
        { name: 'two', value: '2', default: true }
      ],
      required_in_portal: true
    }
  ]
  /* eslint-enable camelcase */

  it('renders the extra fields defined in the ticket form', () => {
    const { container } = renderSubmitTicketForm({
      activeTicketForm,
      ticketFields
    })

    expect(container).toMatchSnapshot()
  })

  it('prefills the form state', () => {
    const setFormState = jest.fn()
    jest.spyOn(i18n, 'getLocale').mockReturnValue('fr')
    renderSubmitTicketForm({
      activeTicketForm,
      ticketFields,
      setFormState,
      ticketFormSettings: [
        { id: 6, prefill: { '*': 'hello world' } },
        { id: 'name', prefill: { '*': 'Lanselot' } },
        { id: 'subject', prefill: { '*': 'Nybeth' } },
        { id: '1', prefill: { fr: 'french', '*': 'fallback' } }
      ],
      ticketFieldSettings: [
        { id: 'email', prefill: { '*': 'blah@blah.com' } },
        { id: 4, prefill: { '*': 'four' } },
        { id: 6, prefill: { '*': 'six' } },
        { id: 5, prefill: { en: 'en', '*': 'fallback', fr: 'fr' } },
        { Terence: 1234 },
        new Date(),
        { Terence: 1234 },
        { id: 1234, Ezel: 'Berbier' }
      ]
    })
    expect(setFormState).toHaveBeenCalledWith(
      expect.objectContaining({
        '6': 'hello world',
        '4': 'four',
        '2': 'Nybeth',
        '5': 'fr',
        '1': 'french',
        name: '', // name cannot be prefilled
        email: '' // email cannot be prefilled
      })
    )
  })
})

describe('preview mode', () => {
  it('disables all fields', () => {
    const { getByLabelText } = renderSubmitTicketForm({
      previewEnabled: true,
      subjectEnabled: true,
      activeTicketForm: null
    })
    expect(getByLabelText('Your name (optional)').disabled).toEqual(true)
    expect(getByLabelText('Email address').disabled).toEqual(true)
    expect(getByLabelText('Subject (optional)').disabled).toEqual(true)
    expect(getByLabelText('How can we help you?').disabled).toEqual(true)
  })
})

describe('form', () => {
  describe('default contact form', () => {
    describe('validation', () => {
      it('displays an error message for name and email fields', () => {
        const submit = jest.fn()
        const { getByText, queryByText } = renderSubmitTicketForm({
          nameFieldRequired: true,
          subjectEnabled: true,
          activeTicketForm: null,
          submit
        })
        expect(queryByText('Please enter a valid name.')).not.toBeInTheDocument()
        expect(queryByText('Please enter a valid email address.')).not.toBeInTheDocument()
        expect(queryByText('Please enter a value.')).not.toBeInTheDocument()

        fireEvent.click(getByText('Send'))

        expect(queryByText('Please enter a valid name.')).toBeInTheDocument()
        expect(queryByText('Please enter a valid email address.')).toBeInTheDocument()
        expect(queryByText('Please enter a value.')).toBeInTheDocument()
        expect(submit).not.toHaveBeenCalled()
      })

      it('displays an error message for invalid email', () => {
        const { getByText, queryByText, getByLabelText } = renderSubmitTicketForm({
          activeTicketForm: null
        })
        fireEvent.change(getByLabelText('Email address'), { target: { value: 'blah' } })
        fireEvent.click(getByText('Send'))

        expect(queryByText('Please enter a valid email address.')).toBeInTheDocument()
      })
    })

    describe('submission', () => {
      it('calls submit handler and changes the button text', () => {
        const submit = jest.fn()
        const { getByText, getByLabelText } = renderSubmitTicketForm({
          nameFieldRequired: true,
          subjectEnabled: true,
          activeTicketForm: null,
          submit
        })
        fireEvent.change(getByLabelText('Email address'), { target: { value: 'hello@world.com' } })
        fireEvent.change(getByLabelText('Your name'), { target: { value: 'Slim Shady' } })
        fireEvent.change(getByLabelText('Subject (optional)'), {
          target: {
            value: "Mom's spaghetti"
          }
        })
        fireEvent.change(getByLabelText('How can we help you?'), { target: { value: 'Help me' } })
        fireEvent.click(getByText('Send'))

        expect(submit).toHaveBeenCalledWith(expect.anything(), {
          isFormValid: true,
          value: {
            description: 'Help me',
            email: 'hello@world.com',
            name: 'Slim Shady',
            subject: "Mom's spaghetti"
          }
        })
        expect(getByText('Submitting...')).toBeInTheDocument()
      })
    })
  })

  describe('ticket forms', () => {
    const activeTicketForm = {
      id: 1,
      raw_name: 'Ticket Formz',
      display_name: 'Ticket Forms'
    }
    const ticketFields = [
      { id: 1, type: 'text', title_in_portal: 'Description', required_in_portal: true },
      { id: 2, type: 'subject', title_in_portal: 'Subject', required_in_portal: true },
      {
        id: 4,
        type: 'text',
        description: 'blah blah',
        title_in_portal: 'Favorite Burger',
        required_in_portal: true
      },
      {
        id: 7,
        type: 'integer',
        title_in_portal: 'Favorite Integer',
        required_in_portal: true
      },
      { id: 8, type: 'decimal', title_in_portal: 'Favorite Decimal', required_in_portal: true },
      {
        id: 10,
        type: 'textarea',
        title_in_portal: 'Favorite Textarea',
        required_in_portal: true
      },
      {
        id: 11,
        type: 'checkbox',
        title_in_portal: 'Favorite Checkbox',
        required_in_portal: true
      },
      {
        id: 12,
        type: 'tagger',
        title_in_portal: 'Favorite Tagger',
        custom_field_options: [
          {
            name: 'one',
            value: 'one'
          },
          {
            name: 'two',
            value: 'two'
          },
          {
            name: 'three',
            value: 'three'
          }
        ],
        required_in_portal: true
      }
    ]

    describe('validation', () => {
      it('renders the error messages', () => {
        const { container, getByText } = renderSubmitTicketForm({
          activeTicketForm,
          ticketFields
        })
        fireEvent.click(getByText('Send'))
        expect(container).toMatchSnapshot()
      })

      it('validates number fields', () => {
        const { getAllByText, getByText, getByLabelText } = renderSubmitTicketForm({
          activeTicketForm,
          ticketFields
        })
        fireEvent.change(getByLabelText('Favorite Integer'), { target: { value: 'hello' } })
        fireEvent.change(getByLabelText('Favorite Decimal'), { target: { value: 'world' } })
        fireEvent.click(getByText('Send'))
        expect(getAllByText('Please enter a number.').length).toEqual(2)
      })
    })

    const renderWithState = (state, renderer) => {
      const submit = jest.fn()
      const setFormState = jest.fn()
      const getLatestState = () => {
        const calls = setFormState.mock.calls
        return calls[calls.length - 1][0]
      }
      return {
        submit,
        getLatestState,
        ...renderSubmitTicketForm(
          {
            formState: state,
            activeTicketForm,
            ticketFields,
            submit,
            setFormState
          },
          renderer
        )
      }
    }

    const ticketFieldAct = (state, renderer, cb) => {
      const getState = renderWithState(state, renderer).getLatestState
      cb()
      return getState()
    }

    describe('submission', () => {
      it('submits the expected object and changes the button text', () => {
        let state = {}
        const { container, rerender, getByText, getByLabelText } = renderWithState(state)
        fireEvent.click(container.querySelector('[data-garden-id="dropdowns.select"]'))
        fireEvent.click(getByText('three'))
        jest.runAllTimers()
        fireEvent.change(getByLabelText('Email address'), { target: { value: 'hello@world.com' } })
        fireEvent.change(getByLabelText('Your name (optional)'), {
          target: { value: 'Slim Shady' }
        })
        state = ticketFieldAct(state, rerender, () => {
          fireEvent.change(getByLabelText('Favorite Integer'), { target: { value: '99' } })
        })
        state = ticketFieldAct(state, rerender, () => {
          fireEvent.change(getByLabelText('Favorite Decimal'), { target: { value: '100.00' } })
        })
        state = ticketFieldAct(state, rerender, () => {
          fireEvent.change(getByLabelText('Description'), { target: { value: 'despacito' } })
        })
        state = ticketFieldAct(state, rerender, () => {
          fireEvent.change(getByLabelText('Subject'), { target: { value: 'subject' } })
        })
        state = ticketFieldAct(state, rerender, () => {
          fireEvent.change(getByLabelText('Favorite Textarea'), { target: { value: 'textarea' } })
        })
        state = ticketFieldAct(state, rerender, () => {
          fireEvent.change(getByLabelText('Favorite Burger'), { target: { value: 'burger' } })
        })
        state = ticketFieldAct(state, rerender, () => {
          fireEvent.click(getByLabelText('Favorite Checkbox'))
        })
        const { submit } = renderWithState(state, rerender)
        fireEvent.click(getByText('Send'))
        expect(submit).toHaveBeenCalledWith(expect.anything(), {
          isFormValid: true,
          value: {
            email: 'hello@world.com',
            name: 'Slim Shady',
            '1': 'despacito',
            '10': 'textarea',
            '11': 1,
            '12': 'three',
            '2': 'subject',
            '4': 'burger',
            '7': '99',
            '8': '100.00'
          }
        })
        expect(getByText('Submitting...')).toBeInTheDocument()
      })
    })
  })
})
