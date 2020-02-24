import formatRequestData from '../requestFormatter'
import { i18n } from 'service/i18n'
import * as globals from 'utility/globals'
import routes from 'embeds/support/routes'

jest.mock('service/i18n')
jest.mock('utility/globals')

const mockTicketField = {
  id: '22660514',
  type: 'text',
  title: 'Text'
}

describe('formatRequestData', () => {
  const format = (
    formStateOverrides = {},
    settingOverrides = {},
    submitTicketOverrides = {},
    ticketFormName = routes.defaultFormId,
    fields = []
  ) => {
    jest.spyOn(i18n, 'getLocaleId').mockReturnValue('fr')
    jest.spyOn(i18n, 't').mockImplementation(st => st)
    globals.location = {
      href: 'test.com'
    }

    const formState = {
      name: 'bob',
      email: 'mock@email.com',
      description: 'Mock Description',
      subject: 'Mock Subject',
      ...formStateOverrides
    }
    const state = {
      settings: {
        contactForm: {
          settings: {
            tags: [],
            subject: false,
            ...settingOverrides
          }
        }
      },
      submitTicket: {
        ticketForms: {},
        ticketFields: [],
        activeForm: null,
        ...submitTicketOverrides
      }
    }

    return formatRequestData(state, formState, [], ticketFormName, fields)
  }

  it('formats the requester correctly', () => {
    const result = format()

    expect(result.request.requester).toEqual({
      name: 'bob',
      email: 'mock@email.com',
      locale_id: 'fr'
    })
  })

  it('Adds the correct tag', () => {
    const result = format()

    expect(result.request.tags).toContain('web_widget')
  })

  it('adds any extra tags', () => {
    const tagsValue = 'extra_tag'
    const result = format({}, { tags: [tagsValue] })

    expect(result.request.tags).toContain(tagsValue)
  })

  it('Adds the correct via_id', () => {
    const result = format()

    expect(result.request.via_id).toEqual(48)
  })

  describe('when name field is empty', () => {
    const values = [
      {
        email: 'harry.j.potter@hogwarts.com',
        expected: 'Harry J Potter'
      },
      {
        email: 'ron_b.weasley@hogwarts.com',
        expected: 'Ron B Weasley'
      },
      {
        email: 'hermione_granger@hogwarts.com',
        expected: 'Hermione Granger'
      },
      {
        email: 'dracomalfoy@hogwarts.com',
        expected: 'Dracomalfoy'
      },
      {
        email: 'ginny-weasley@hogwarts.com',
        expected: 'Ginny Weasley'
      }
    ]

    values.forEach(value => {
      it(`formats the name based on the email ${value.email}`, () => {
        const result = format({ name: '', email: value.email })

        expect(result.request.requester.name).toEqual(value.expected)
      })
    })
  })

  it('uses the description as the subject when a subject is not filled in', () => {
    const result = format({ subject: '' })

    expect(result.request.subject).toEqual('Mock Description')
  })

  it('trims the subject if it is too long', () => {
    const result = format({
      subject: '',
      description: 'this text is longer then 50 characters 12345678987654321'
    })

    expect(result.request.subject).toEqual('this text is longer then 50 characters 12345678987...')
  })

  describe('description field', () => {
    it('adds "submitted from" data when referrerPolicy is false', () => {
      jest.spyOn(globals, 'getReferrerPolicy').mockReturnValue(false)

      const result = format()

      expect(result.request.comment.body).toBe(
        'Mock Description\n\n------------------\nembeddable_framework.submitTicket.form.submittedFrom.label'
      )
    })

    it('does not add "submitted from" data when referrerPolicy is true', () => {
      jest.spyOn(globals, 'getReferrerPolicy').mockReturnValue(true)
      const result = format()

      expect(result.request.comment.body).toBe('Mock Description')
    })
  })

  describe('when the form has custom ticket fields', () => {
    it('should correctly format custom fields', () => {
      const result = format(
        { '22660514': 'mockCustomField' },
        {},
        { ticketFields: [mockTicketField] }
      )

      expect(result.request.fields['22660514']).toBe('mockCustomField')
    })
  })

  describe('when the form is a ticket form', () => {
    const ticketFields = [
      {
        id: 123,
        type: 'description',
        removable: false
      },
      {
        id: 456,
        type: 'text',
        removable: true
      }
    ]
    const ticketForms = {
      id: 50,
      ticket_field_ids: [123, 234, 456]
    }

    const mockValues = {
      123: 'Just saying Hi',
      234: 'Hello',
      456: 'Cheeseburger'
    }

    it('should correctly format custom fields', () => {
      const result = format(mockValues, {}, { ticketFields, ticketForms }, '50')

      expect(result.request.fields[456]).toBe('Cheeseburger')
    })

    it('uses the description as the subject when subject is not available', () => {
      const result = format({ ...mockValues, subject: '' }, {}, { ticketFields, ticketForms }, '50')

      expect(result.request.subject).toBe('Just saying Hi')
    })

    it('correctly formats the subject field when available', () => {
      const result = format(
        { ...mockValues, subject: '' },
        {},
        {
          ticketFields: [...ticketFields, { id: 234, type: 'subject', removable: false }],
          ticketForms
        },
        50
      )

      expect(result.request.fields[234]).not.toBe('Hello')

      expect(result.request.subject).toBe('Hello')
    })

    it('correctly formats the description field based on the ticket field id', () => {
      const result = format(mockValues, {}, { ticketFields, ticketForms }, '50')

      expect(result.request.fields[123]).not.toBe('Just saying Hi')

      expect(result.request.comment.body).toContain('Just saying Hi')
    })

    it('sends through the ticket_form_id', () => {
      const result = format(mockValues, {}, { ticketFields, ticketForms }, '50')

      expect(result.request.ticket_form_id).toBe(50)
    })
  })

  describe('empty values', () => {
    const tests = [
      { type: 'checkbox', expected: 0 },
      { type: 'integer', expected: '' },
      { type: 'decimal', expected: '' },
      { type: 'text', expected: '' },
      { type: 'tagger', expected: '' },
      { type: 'textarea', expected: '' }
    ]

    tests.forEach(testCase => {
      it(`defaults to ${JSON.stringify(testCase.expected)} when field type ${
        testCase.type
      } has no value`, () => {
        const fieldId = '123'

        const result = format({ [fieldId]: undefined }, {}, {}, undefined, [
          { type: testCase.type, id: fieldId }
        ])

        expect(result.request.fields[fieldId]).toBe(testCase.expected)
      })
    })
  })
})
