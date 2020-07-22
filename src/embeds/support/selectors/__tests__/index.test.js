import createStore from 'src/redux/createStore'
import { TICKET_FIELDS_REQUEST_SUCCESS } from 'src/embeds/support/actions/action-types'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import createKeyID from 'embeds/support/utils/createKeyID'
import * as selectors from '..'
import { i18n } from 'service/i18n'
import {
  getCanDisplayForm,
  getContactFormFields,
  getField,
  getForm,
  getFormsToDisplay,
  getIsFormLoading,
  getIsAnyTicketFormLoading,
  getHasFetchedTicketForms
} from 'embeds/support/selectors'

const expectedNameField = {
  id: 'name',
  title: i18n.t('embeddable_framework.submitTicket.field.name.label'),
  required: false,
  visible: true,
  validation: 'name',
  type: 'text'
}

const expectedEmailField = {
  id: 'email',
  title: 'Email address',
  required: true,
  visible: true,
  type: 'text',
  validation: 'email'
}
const expectedDescriptionField = {
  id: 'description',
  title: 'How can we help you?',
  required: true,
  visible: true,
  type: 'textarea'
}
const checkboxField = {
  id: 123,
  title_in_portal: 'Checkbox field',
  required_in_portal: false,
  visible_in_portal: true,
  type: 'checkbox',
  description: 'hello world'
}
const expectedCheckboxField = {
  id: createKeyID('123'),
  originalId: 123,
  title: 'Checkbox field',
  required: false,
  visible: true,
  type: 'checkbox',
  description: 'hello world'
}

const textField = {
  id: '456',
  title_in_portal: 'Text field',
  required_in_portal: false,
  visible_in_portal: true,
  type: 'text'
}

const expectedTextField = {
  id: createKeyID('456'),
  originalId: '456',
  title: 'Text field',
  required: false,
  visible: true,
  type: 'text'
}
const textareaField = {
  id: '789',
  title_in_portal: 'Textarea field',
  required_in_portal: false,
  visible_in_portal: true,
  type: 'textarea'
}

const expectedTextareaField = {
  id: createKeyID('789'),
  originalId: '789',
  title: 'Textarea field',
  required: false,
  visible: true,
  type: 'textarea'
}
const subjectField = {
  id: 'subject',
  title: 'Subject',
  required: false,
  visible: true,
  type: 'text'
}
const attachmentField = {
  id: 'attachments',
  type: 'attachments',
  validation: 'attachments',
  visible: true
}

describe('getAttachmentTitle', () => {
  it('with attachments', () => {
    const state = {
      support: { attachments: [{ id: '1', uploadToken: '1' }, { id: '2', uploadToken: '2' }] }
    }
    const result = selectors.getAttachmentTitle(state, ['1'])

    expect(result).toEqual('Attachments (1)')
  })

  it('with no attachments', () => {
    const state = { support: { attachments: [] } }
    const result = selectors.getAttachmentTitle(state, [])

    expect(result).toEqual('Attachments')
  })
})

describe('getAttachmentsForForm', () => {
  it('with a matching attachments', () => {
    const state = {
      support: { attachments: [{ id: '1', uploadToken: '1' }, { id: '2', uploadToken: '2' }] }
    }
    const result = selectors.getAttachmentsForForm(state, ['1'])

    expect(result).toEqual([{ id: '1', uploadToken: '1' }])
  })

  it('with no matching attachments', () => {
    const state = {
      support: { attachments: [{ id: '1', uploadToken: '1' }, { id: '2', uploadToken: '2' }] }
    }
    const result = selectors.getAttachmentsForForm(state, ['3'])

    expect(result).toEqual([])
  })
})

describe('getTicketFormFields', () => {
  const run = ({
    nameFieldEnabled,
    nameFieldRequired,
    subjectFieldEnabled,
    fields = [],
    attachmentsEnabled
  } = {}) => {
    const store = createStore()

    store.dispatch({
      type: TICKET_FIELDS_REQUEST_SUCCESS,
      payload: fields
    })

    store.dispatch({
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            subject: Boolean(subjectFieldEnabled),
            settings: { attachments: Boolean(attachmentsEnabled) }
          }
        }
      }
    })

    store.dispatch(
      updateEmbeddableConfig({
        embeds: {
          ticketSubmissionForm: {
            props: {
              nameFieldEnabled: Boolean(nameFieldEnabled),
              nameFieldRequired: Boolean(nameFieldRequired),
              attachmentsEnabled: Boolean(attachmentsEnabled)
            }
          }
        }
      })
    )

    return selectors.getTicketFormFields(store.getState())
  }

  it('always includes an email and description field', () => {
    const result = run()

    expect(result).toEqual([expectedEmailField, expectedDescriptionField])
  })

  describe('when name field is enabled', () => {
    it('includes a required name field when it is required ', () => {
      const result = run({
        nameFieldEnabled: true,
        nameFieldRequired: true
      })

      expect(result).toEqual([
        {
          id: 'name',
          title: 'Your name',
          required: true,
          visible: true,
          validation: 'name',
          type: 'text'
        },
        expectedEmailField,
        expectedDescriptionField
      ])
    })

    it('includes a non-required name field when it is not required ', () => {
      const result = run({
        nameFieldEnabled: true,
        nameFieldRequired: false
      })

      expect(result).toEqual([expectedNameField, expectedEmailField, expectedDescriptionField])
    })
  })

  it('includes a subject field when enabled', () => {
    const result = run({
      subjectFieldEnabled: true
    })

    expect(result).toEqual([expectedEmailField, subjectField, expectedDescriptionField])
  })

  it('attachments are visible when enabled', () => {
    const result = run({
      attachmentsEnabled: true
    })

    expect(result).toEqual([expectedEmailField, expectedDescriptionField, attachmentField])
  })

  it('displays all non-checkbox fields above subject/description and all checkbox fields after subject/description', () => {
    const result = run({
      subjectFieldEnabled: true,
      nameFieldEnabled: true,
      fields: [checkboxField, textField, textareaField]
    })

    expect(result).toEqual([
      {
        id: 'name',
        title: 'Your name',
        required: false,
        visible: true,
        validation: 'name',
        type: 'text'
      },
      expectedEmailField,
      expectedTextField,
      expectedTextareaField,
      {
        id: 'subject',
        title: 'Subject',
        required: false,
        visible: true,
        type: 'text'
      },
      expectedDescriptionField,
      expectedCheckboxField
    ])
  })
})

describe('getCustomTicketFields', () => {
  const defaultTicketFields = {
    123: checkboxField,
    456: textField,
    789: textareaField
  }

  const getState = ({
    nameFieldEnabled = false,
    nameFieldRequired = false,
    ticketFields = defaultTicketFields
  } = {}) => ({
    base: {
      embeddableConfig: {
        embeds: { ticketSubmissionForm: { props: { nameFieldEnabled, nameFieldRequired } } }
      }
    },
    support: {
      forms: {
        123456: { id: '123456', ticket_field_ids: Object.keys(ticketFields), active: true }
      },
      filteredFormsToDisplay: [123456],
      formsWithSuppressedSubject: [],
      fields: ticketFields
    }
  })

  it('always includes an email field', () => {
    const result = selectors.getCustomTicketFields(getState(), 'unknown form')

    expect(result).toEqual([expectedEmailField])
  })

  it('displays all other custom fields below the email field when the form is found', () => {
    const result = selectors.getCustomTicketFields(getState(), '123456')

    expect(result).toEqual([
      expectedEmailField,
      expectedCheckboxField,
      expectedTextField,
      expectedTextareaField
    ])
  })

  it('includes a name field if enabled in config', () => {
    const result = selectors.getCustomTicketFields(getState({ nameFieldEnabled: true }), '123456')

    expect(result).toEqual([
      expectedNameField,
      expectedEmailField,
      expectedCheckboxField,
      expectedTextField,
      expectedTextareaField
    ])
  })

  it('includes the name field as required if set in config', () => {
    const result = selectors.getCustomTicketFields(
      getState({ nameFieldEnabled: true, nameFieldRequired: true }),
      '123456'
    )
    const requiredNameField = {
      ...expectedNameField,
      required: true
    }

    expect(result).toEqual([
      requiredNameField,
      expectedEmailField,
      expectedCheckboxField,
      expectedTextField,
      expectedTextareaField
    ])
  })

  it('overrides the id of description field types so it can be prefilled with the key "description" instead of its id', () => {
    const descriptionField = {
      id: '123',
      title_in_portal: 'Description',
      required_in_portal: false,
      visible_in_portal: true,
      type: 'description'
    }
    const expectedDescriptionField = {
      id: 'description',
      originalId: '123',
      title: 'Description',
      required: false,
      visible: true,
      type: 'description'
    }

    const state = getState({
      ticketFields: {
        123: descriptionField
      }
    })

    const result = selectors.getCustomTicketFields(state, '123456')

    expect(result).toEqual([expectedEmailField, expectedDescriptionField])
  })

  it('overrides the id of "subject" type fields so the subject field so it can be prefilled with the key "subject" instead of its id', () => {
    const subjectField = {
      id: '123',
      title_in_portal: 'Subject',
      required_in_portal: false,
      visible_in_portal: true,
      type: 'subject'
    }

    const expectedSubjectField = {
      id: 'subject',
      originalId: '123',
      title: 'Subject',
      required: false,
      visible: true,
      type: 'subject'
    }

    const state = getState({
      ticketFields: {
        123: subjectField
      }
    })

    const result = selectors.getCustomTicketFields(state, '123456')

    expect(result).toEqual([expectedEmailField, expectedSubjectField])
  })
})

describe('getFormTicketFields', () => {
  const setUpState = ({ fields, contactFormFields, attachmentsEnabled = false }) => {
    return {
      support: {
        forms: { 123456: { id: '123456', ticket_field_ids: ['123', '456', '789'], active: true } },
        filteredFormsToDisplay: [123456],
        formsWithSuppressedSubject: [],
        fields,
        contactFormFields
      },
      settings: { contactForm: { settings: { subject: false, attachments: attachmentsEnabled } } },
      base: {
        embeddableConfig: { embeds: { ticketSubmissionForm: { props: { attachmentsEnabled } } } }
      }
    }
  }

  it('returns the contact form when the contact-form route is passed in', () => {
    const contactFormFields = [checkboxField, textField, textareaField]
    const result = selectors.getFormTicketFields(setUpState({ contactFormFields }), 'contact-form')

    expect(result).toEqual([
      expectedEmailField,
      expectedTextField,
      expectedTextareaField,
      expectedDescriptionField,
      expectedCheckboxField
    ])
  })

  it('returns the attachmentField when visible', () => {
    const result = selectors.getFormTicketFields(
      setUpState({ contactFormFields: [], attachmentsEnabled: true }),
      'contact-form'
    )

    expect(result).toEqual([expectedEmailField, expectedDescriptionField, attachmentField])
  })

  it('returns a ticket form when an id is passed in', () => {
    const fields = {
      123: checkboxField,
      456: textField,
      789: textareaField
    }
    const result = selectors.getFormTicketFields(setUpState({ fields }), '123456')

    expect(result).toEqual([
      expectedEmailField,
      expectedCheckboxField,
      expectedTextField,
      expectedTextareaField
    ])
  })
})

const state = {
  support: {
    config: {
      yolo: 'yolo',
      maxFileCount: 10,
      maxFileSize: 5,
      webWidgetReactRouterSupport: true
    },
    activeFormName: 'ticketForm',
    formStates: { contactForm: { name: 'Bobby' } },
    showFormErrors: 'blap'
  }
}

const supportState = state => ({
  support: state
})

test('getSupportConfig', () => {
  const result = selectors.getSupportConfig(state)

  expect(result).toEqual({
    yolo: 'yolo',
    maxFileCount: 10,
    maxFileSize: 5,
    webWidgetReactRouterSupport: true
  })
})

test('getMaxFileSize', () => {
  const result = selectors.getMaxFileSize(state)

  expect(result).toEqual(5)
})

test('getMaxFileCount', () => {
  const result = selectors.getMaxFileCount(state)

  expect(result).toEqual(10)
})

test('getActiveFormName', () => {
  const result = selectors.getActiveFormName(state)

  expect(result).toEqual('ticketForm')
})

describe('getFormState', () => {
  const createState = formExists => {
    const state = {
      base: {
        locale: 'en-US',
        embeddableConfig: {
          embeds: { ticketSubmissionForm: { props: { attachmentsEnabled: false } } }
        }
      },
      support: {
        formStates: {},
        prefillValues: {
          '*': {
            name: 'Prefill name'
          }
        },
        forms: {
          contactForm: {
            id: 'contactForm',
            ticket_field_ids: [123],
            active: true
          }
        },
        filteredFormsToDisplay: ['contactForm'],
        formsWithSuppressedSubject: [],
        fields: {
          123: {
            id: 123,
            type: 'tagger',
            custom_field_options: [
              {
                value: 'option 1'
              },
              {
                value: 'option 2',
                default: true
              }
            ]
          }
        },
        prefillSpecificFormValues: {}
      }
    }

    if (formExists) {
      state.support.formStates.contactForm = {
        [createKeyID('name')]: 'Bobby'
      }
    }

    return state
  }

  describe('when form state exists', () => {
    it('returns the form state if it exists', () => {
      const result = selectors.getFormState(createState(true), 'contactForm')

      expect(result).toEqual({ [createKeyID('name')]: 'Bobby' })
    })
  })

  describe('when form state does not exist', () => {
    it('includes the default value for dropdown fields', () => {
      const result = selectors.getFormState(createState(false), 'contactForm')

      expect(result).toEqual(expect.objectContaining({ [createKeyID(123)]: 'option 2' }))
    })
  })
})

describe('attachments', () => {
  const attachment1 = {
    id: 1,
    fileName: 'screenshot-1.png',
    fileSize: 42356,
    fileType: 'image/png',
    uploading: false,
    uploadProgress: 100,
    errorMessage: null,
    uploadToken: 'a35g4a3f5v1a6df5bv1a'
  }
  const attachment2 = {
    id: 2,
    fileName: 'purchase-receipt.pdf',
    fileSize: 82354,
    fileType: 'application/pdf',
    uploading: false,
    uploadProgress: 100,
    errorMessage: 'failed',
    uploadToken: null
  }
  const attachment3 = {
    id: 3,
    fileName: 'proof-of-damage.jpg',
    fileSize: 135468,
    fileType: 'image/jpg',
    uploading: true,
    uploadProgress: 0,
    errorMessage: null,
    uploadToken: null
  }
  const attachments = [attachment1, attachment2, attachment3]
  const state = supportState({ attachments })

  test('getAllAttachments', () => {
    const result = selectors.getAllAttachments(state)

    expect(result).toEqual(attachments)
  })

  test('getSuccessfulAttachments', () => {
    const selector = selectors.getSuccessfulAttachments.resultFunc
    const result = selector(attachments)

    expect(result).toEqual([attachment1])
  })

  test('getAttachmentTokens', () => {
    const selector = selectors.getAttachmentTokens.resultFunc
    const result = selector([attachment1])

    expect(result).toEqual([attachment1.uploadToken])
  })

  describe('getAttachmentsReady', () => {
    const selector = selectors.getAttachmentsReady.resultFunc
    const validAttachments = [attachment1]

    describe('when the list of valid attachments equals the total number of attachments', () => {
      it('returns true', () => {
        const allAttachments = [attachment1]

        expect(selector(allAttachments, validAttachments)).toEqual(true)
      })
    })

    describe('when the list of valid attachments is less than the total number of attachments', () => {
      it('returns false', () => {
        expect(selector(attachments, validAttachments)).toEqual(false)
      })
    })
  })

  test('getAttachmentTypes', () => {
    const selector = selectors.getAttachmentTypes.resultFunc
    const result = selector([attachment1])

    expect(result).toEqual(['image/png'])
  })
})

describe('getReadOnlyState', () => {
  it('returns the read only state', () => {
    const result = selectors.getReadOnlyState({
      support: {
        readOnly: {
          email: true,
          name: false
        }
      }
    })

    expect(result).toEqual({
      email: true,
      name: false
    })
  })
})

describe('getForm', () => {
  const form = { id: 123, active: true }

  it('returns the form when it exists', () => {
    const result = getForm(
      {
        base: {
          embeddableConfig: { embeds: { ticketSubmissionForm: { props: { ticketForms: [123] } } } }
        },
        support: { forms: { 123: form }, filteredFormsToDisplay: [] }
      },
      123
    )

    expect(result).toBe(form)
  })

  it('returns undefined when the form does not exist', () => {
    const result = getForm(
      {
        base: {
          embeddableConfig: { embeds: { ticketSubmissionForm: { props: { ticketForms: [] } } } }
        },
        support: { forms: { 456: form }, filteredFormsToDisplay: [] }
      },
      123
    )

    expect(result).toEqual(undefined)
  })
})

describe('getCanDisplayForm', () => {
  const form = { id: 123, active: true }

  it('returns false if the form is not available to be displayed', () => {
    const result = getCanDisplayForm(
      {
        base: {
          embeddableConfig: { embeds: { ticketSubmissionForm: { props: { ticketForms: [] } } } }
        },
        support: { forms: { 123: form }, filteredFormsToDisplay: [456] }
      },
      123
    )

    expect(result).toBe(false)
  })

  it('returns true if the form is available to be displayed and exists', () => {
    const result = getCanDisplayForm(
      {
        base: {
          embeddableConfig: { embeds: { ticketSubmissionForm: { props: { ticketForms: [] } } } }
        },
        support: { forms: { 123: form }, filteredFormsToDisplay: [123] }
      },
      123
    )

    expect(result).toBe(true)
  })
})

describe('getField', () => {
  it('returns the field when it exists', () => {
    const field = { id: 123 }

    const result = getField({ support: { fields: { 123: field } } }, 123)

    expect(result).toBe(field)
  })

  it('returns undefined when the field does not exist', () => {
    const field = { id: 123 }

    const result = getField({ support: { fields: { 456: field } } }, 123)

    expect(result).toEqual(undefined)
  })
})

describe('getContactFormFields', () => {
  it('returns the contact form fields', () => {
    const fields = [{ id: 123 }, { id: 456 }]

    const result = getContactFormFields({ support: { contactFormFields: fields } })

    expect(result).toBe(fields)
  })
})

describe('getFormsToDisplay', () => {
  const createState = ({ forms, formIds, filteredFormIds = [] }) => ({
    base: {
      embeddableConfig: {
        embeds: {
          ticketSubmissionForm: {
            props: {
              ticketForms: formIds
            }
          }
        }
      }
    },
    support: {
      forms,
      filteredFormsToDisplay: filteredFormIds
    }
  })

  describe('when the customer has filtered forms using the ticketForms setting', () => {
    it('only returns the filtered forms', () => {
      const form1 = { id: 1, position: 1, active: true }
      const form2 = { id: 2, position: 2, active: true }
      const form3 = { id: 3, position: 3, active: true }

      const forms = {
        [form1.id]: form1,
        [form2.id]: form2,
        [form3.id]: form3
      }

      const formIds = Object.keys(forms)
      const filteredFormIds = [form1.id, form3.id]

      const result = getFormsToDisplay(createState({ forms, formIds, filteredFormIds }))

      expect(result).toEqual([form1, form3])
    })

    it("ignores filtered ids that don't match any of the forms from the embeddable config", () => {
      const form1 = { id: 1, position: 1, active: true }
      const form2 = { id: 2, position: 2, active: true }
      const form3 = { id: 3, position: 3, active: true }

      const forms = {
        [form1.id]: form1,
        [form2.id]: form2,
        [form3.id]: form3
      }

      const formIds = Object.keys(forms)
      const filteredFormIds = [form1.id, form3.id, "some id that doesn't match"]

      const result = getFormsToDisplay(createState({ forms, formIds, filteredFormIds }))

      expect(result).toEqual([form1, form3])
    })
  })

  it('returns all forms sorted by their position', () => {
    const form1 = { id: 1, position: 3, active: true }
    const form2 = { id: 2, position: 1, active: true }
    const form3 = { id: 3, position: 2, active: true }

    const forms = {
      [form1.id]: form1,
      [form2.id]: form2,
      [form3.id]: form3
    }

    const result = getFormsToDisplay(createState({ forms, formIds: Object.keys(forms) }))

    expect(result).toEqual([form2, form3, form1])
  })

  it('only includes active forms', () => {
    const form1 = { id: 1, position: 1, active: false }
    const form2 = { id: 2, position: 2, active: true }
    const form3 = { id: 3, position: 3, active: false }

    const forms = {
      [form1.id]: form1,
      [form2.id]: form2,
      [form3.id]: form3
    }

    const result = getFormsToDisplay(createState({ forms, formIds: Object.keys(forms) }))

    expect(result).toEqual([form2])
  })

  it('deduplicates ids', () => {
    const form1 = { id: 1, position: 1, active: true }
    const form2 = { id: 2, position: 2, active: true }

    const forms = {
      [form1.id]: form1,
      [form2.id]: form2
    }

    const formIds = Object.keys(forms)
    const filteredFormIds = [form1.id, form2.id, form1.id, form2.id, form1.id, form2.id]

    const result = getFormsToDisplay(createState({ forms, formIds, filteredFormIds }))

    expect(result).toEqual([form1, form2])
  })
})

describe('getIsFormLoading', () => {
  it('returns true if the form is currently loading', () => {
    const state = {
      support: {
        isFormLoading: {
          123: 'fetchKey'
        }
      }
    }

    expect(getIsFormLoading(state, 123)).toBe(true)
  })

  it('returns false if the form is not loading', () => {
    const state = {
      support: {
        isFormLoading: {
          123: false
        }
      }
    }

    expect(getIsFormLoading(state, 123)).toBe(false)
  })

  it('returns false if there is no loading data for the form', () => {
    const state = {
      support: {
        isFormLoading: {
          456: 'fetchKey'
        }
      }
    }

    expect(getIsFormLoading(state, 123)).toBe(false)
  })
})

describe('getIsAnyTicketFormLoading', () => {
  it('returns true if any ticket form is loading', () => {
    expect(
      getIsAnyTicketFormLoading({
        support: {
          ticketFormsRequest: {
            isLoading: true
          }
        }
      })
    ).toBe(true)
  })

  it('returns false if no ticket forms are loading', () => {
    expect(
      getIsAnyTicketFormLoading({
        support: {
          ticketFormsRequest: {
            isLoading: false
          }
        }
      })
    ).toBe(false)
  })
})

describe('getHasFetchedTicketForms', () => {
  it('returns true if the fetchKey matches the latest fetch and it currently loading', () => {
    const state = {
      support: {
        ticketFormsRequest: {
          fetchKey: 'fetchKey'
        }
      }
    }

    expect(getHasFetchedTicketForms(state, 'fetchKey')).toBe(true)
  })

  it('returns false if the fetchKey does not match the latest fetch', () => {
    const state = {
      support: {
        ticketFormsRequest: {
          fetchKey: 'aNewerFetchKey'
        }
      }
    }

    expect(getHasFetchedTicketForms(state, 'anOlderFetchKey')).toBe(false)
  })
})

describe('getTicketFormTitle', () => {
  const createState = () => {
    return {
      base: {
        embeddableConfig: {
          embeds: {
            ticketSubmissionForm: {
              props: {
                ticketForms: [123]
              }
            }
          }
        }
      },
      support: {
        forms: {
          123: {
            display_name: 'one two three'
          },
          456: {
            display_name: 'four five six'
          }
        },
        formsWithSuppressedTitle: [123]
      }
    }
  }

  it('returns the title of the corresponding form id', () => {
    const result = selectors.getTicketFormTitle(createState(), 456)
    expect(result).toEqual('four five six')
  })

  it('returns undefined if title is suppressed', () => {
    const result = selectors.getTicketFormTitle(createState(), 123)
    expect(result).toBeUndefined()
  })

  it('returns undefined if id does not exist', () => {
    const result = selectors.getTicketFormTitle(createState(), 1234)
    expect(result).toBeUndefined()
  })

  it('returns the title of the corresponding form id even if id is string', () => {
    const result = selectors.getTicketFormTitle(createState(), '456')
    expect(result).toEqual('four five six')
  })
})
