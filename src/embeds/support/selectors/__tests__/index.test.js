import createStore from 'src/redux/createStore'
import { TICKET_FIELDS_REQUEST_SUCCESS } from 'src/embeds/support/actions/action-types'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import createKeyID from 'embeds/support/utils/createKeyID'
import * as selectors from '..'
import { i18n } from 'service/i18n'
import { getContactFormFields, getField, getForm } from 'embeds/support/selectors'
import { getAllForms } from '..'
import { getIsLoading } from '..'

const nameField = {
  id: 'name',
  title_in_portal: i18n.t('embeddable_framework.submitTicket.field.name.label'),
  required_in_portal: false,
  visible_in_portal: true,
  type: 'text',
  keyID: createKeyID('name')
}

const emailField = {
  id: 'email',
  title_in_portal: 'Email address',
  required_in_portal: true,
  visible_in_portal: true,
  type: 'text',
  validation: 'email',
  keyID: createKeyID('email')
}
const descriptionField = {
  id: 'description',
  title_in_portal: 'How can we help you?',
  required_in_portal: true,
  visible_in_portal: true,
  type: 'textarea',
  keyID: createKeyID('description')
}
const checkboxField = {
  id: '123',
  title_in_portal: 'Checkbox field',
  required_in_portal: false,
  visible_in_portal: true,
  type: 'checkbox',
  keyID: createKeyID('123')
}
const textField = {
  id: '456',
  title_in_portal: 'Text field',
  required_in_portal: false,
  visible_in_portal: true,
  type: 'text',
  keyID: createKeyID('456')
}
const textareaField = {
  id: '789',
  title_in_portal: 'Textarea field',
  required_in_portal: false,
  visible_in_portal: true,
  type: 'textarea',
  keyID: createKeyID('789')
}
const subjectField = {
  id: 'subject',
  title_in_portal: 'Subject',
  required_in_portal: false,
  visible_in_portal: true,
  type: 'text',
  keyID: createKeyID('subject')
}
const attachmentField = {
  id: 'attachments',
  keyID: 'key:attachments',
  type: 'attachments',
  validation: 'attachments',
  visible_in_portal: true
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

    expect(result).toEqual([emailField, descriptionField])
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
          title_in_portal: 'Your name',
          required_in_portal: true,
          visible_in_portal: true,
          type: 'text',
          keyID: createKeyID('name')
        },
        emailField,
        descriptionField
      ])
    })

    it('includes a non-required name field when it is not required ', () => {
      const result = run({
        nameFieldEnabled: true,
        nameFieldRequired: false
      })

      expect(result).toEqual([
        {
          id: 'name',
          title_in_portal: 'Your name',
          required_in_portal: false,
          visible_in_portal: true,
          type: 'text',
          keyID: createKeyID('name')
        },
        emailField,
        descriptionField
      ])
    })
  })

  it('includes a subject field when enabled', () => {
    const result = run({
      subjectFieldEnabled: true
    })

    expect(result).toEqual([emailField, subjectField, descriptionField])
  })

  it('attachments are visible when enabled', () => {
    const result = run({
      attachmentsEnabled: true
    })

    expect(result).toEqual([emailField, descriptionField, attachmentField])
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
        title_in_portal: 'Your name',
        required_in_portal: false,
        visible_in_portal: true,
        type: 'text',
        keyID: createKeyID('name')
      },
      emailField,
      textField,
      textareaField,
      {
        id: 'subject',
        title_in_portal: 'Subject',
        required_in_portal: false,
        visible_in_portal: true,
        type: 'text',
        keyID: createKeyID('subject')
      },
      descriptionField,
      checkboxField
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
        123456: { id: '123456', ticket_field_ids: Object.keys(ticketFields) }
      },
      fields: ticketFields
    }
  })

  it('always includes an email field', () => {
    const result = selectors.getCustomTicketFields(getState(), 'unknown form')

    expect(result).toEqual([emailField])
  })

  it('displays all other custom fields below the email field when the form is found', () => {
    const result = selectors.getCustomTicketFields(getState(), '123456')

    expect(result).toEqual([emailField, checkboxField, textField, textareaField])
  })

  it('includes a name field if enabled in config', () => {
    const result = selectors.getCustomTicketFields(getState({ nameFieldEnabled: true }), '123456')

    expect(result).toEqual([nameField, emailField, checkboxField, textField, textareaField])
  })

  it('includes the name field as required if set in config', () => {
    const result = selectors.getCustomTicketFields(
      getState({ nameFieldEnabled: true, nameFieldRequired: true }),
      '123456'
    )
    const requiredNameField = {
      ...nameField,
      required_in_portal: true
    }

    expect(result).toEqual([requiredNameField, emailField, checkboxField, textField, textareaField])
  })

  it('adds a keyID of "description" to the description field so it can be prefilled with the key "description" instead of its id', () => {
    const descriptionField = {
      id: '123',
      title_in_portal: 'Description',
      required_in_portal: false,
      visible_in_portal: true,
      type: 'description'
    }

    const state = getState({
      ticketFields: {
        123: descriptionField
      }
    })

    const expectedDescriptionField = {
      ...descriptionField,
      keyID: createKeyID('description')
    }

    const result = selectors.getCustomTicketFields(state, '123456')

    expect(result).toEqual([emailField, expectedDescriptionField])
  })

  it('adds a keyID of "subject" to the subject field so it can be prefilled with the key "subject" instead of its id', () => {
    const subjectField = {
      id: '123',
      title_in_portal: 'Subject',
      required_in_portal: false,
      visible_in_portal: true,
      type: 'subject'
    }

    const state = getState({
      ticketFields: {
        123: subjectField
      }
    })

    const expectedSubjectField = {
      ...subjectField,
      keyID: createKeyID('subject')
    }

    const result = selectors.getCustomTicketFields(state, '123456')

    expect(result).toEqual([emailField, expectedSubjectField])
  })
})

describe('getFormTicketFields', () => {
  const setUpState = ({ fields, contactFormFields, attachmentsEnabled = false }) => {
    return {
      support: {
        forms: { 123456: { id: '123456', ticket_field_ids: ['123', '456', '789'] } },
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

    expect(result).toEqual([emailField, textField, textareaField, descriptionField, checkboxField])
  })

  it('returns the attachmentField when visible', () => {
    const result = selectors.getFormTicketFields(
      setUpState({ contactFormFields: [], attachmentsEnabled: true }),
      'contact-form'
    )

    expect(result).toEqual([emailField, descriptionField, attachmentField])
  })

  it('returns a ticket form when an id route is passed in', () => {
    const fields = {
      123: checkboxField,
      456: textField,
      789: textareaField
    }
    const result = selectors.getFormTicketFields(setUpState({ fields }), '123456')

    expect(result).toEqual([emailField, checkboxField, textField, textareaField])
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

test('getNewSupportEmbedEnabled', () => {
  const result = selectors.getNewSupportEmbedEnabled(state)

  expect(result).toEqual(true)
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
            ticket_field_ids: [123]
          }
        },
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
    it('returns the prefill values if the form state does not exist', () => {
      const result = selectors.getFormState(createState(false), 'contactForm')

      expect(result).toEqual(expect.objectContaining({ [createKeyID('name')]: 'Prefill name' }))
    })

    it('includes the default value for dropdown fields', () => {
      const result = selectors.getFormState(createState(false), 'contactForm')

      expect(result).toEqual(expect.objectContaining({ [createKeyID(123)]: 'option 2' }))
    })
  })
})

describe('getPrefillValues', () => {
  const run = ({ formId = 123, genericValues = {}, specificValues = {}, locale = 'en-US' }) => {
    const state = {
      base: {
        locale
      },
      support: {
        prefillValues: genericValues,
        prefillSpecificFormValues: specificValues
      }
    }

    return selectors.getPrefillValues(formId)(state)
  }

  it('returns the prefill values prioritising specific values over generic ones', () => {
    const result = run({
      formId: 123,
      genericValues: {
        '*': {
          ['name']: 'Some name'
        }
      },
      specificValues: {
        123: {
          '*': {
            ['name']: 'Specific name'
          }
        }
      }
    })

    expect(result).toEqual({ [createKeyID('name')]: 'Specific name' })
  })

  it('returns the prefill values prioritising specific form locale values over specific fallback ones', () => {
    const result = run({
      locale: 'fr',
      formId: 123,
      specificValues: {
        123: {
          '*': {
            ['name']: 'Specific name'
          },
          fr: {
            ['name']: 'French name'
          }
        }
      }
    })

    expect(result).toEqual({ [createKeyID('name')]: 'French name' })
  })

  it('returns the prefill values prioritising specific locale values over fallback ones', () => {
    const result = run({
      locale: 'fr',
      formId: 123,
      genericValues: {
        '*': {
          ['name']: 'Specific name'
        },
        fr: {
          ['name']: 'French name'
        }
      }
    })

    expect(result).toEqual({ [createKeyID('name')]: 'French name' })
  })
})

describe('getPrefillCount', () => {
  it('returns the value used to determine if prefills have updated', () => {
    const state = {
      support: {
        prefillId: 2
      }
    }

    expect(selectors.getPrefillId(state)).toBe(2)
  })
})

describe('getLastFormPrefillId', () => {
  it('returns the id of the last prefill the form has received', () => {
    const state = {
      support: {
        lastFormPrefillId: {
          123: 2
        }
      }
    }

    expect(selectors.getLastFormPrefillId(state, 123)).toBe(2)
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
  it('returns the form when it exists', () => {
    const form = { id: 123 }

    const result = getForm({ support: { forms: { 123: form } } }, 123)

    expect(result).toBe(form)
  })

  it('returns undefined when the form does not exist', () => {
    const form = { id: 123 }

    const result = getForm({ support: { forms: { 456: form } } }, 123)

    expect(result).toEqual(undefined)
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

describe('getAllForms', () => {
  it('returns all forms sorted by their position', () => {
    const form1 = { id: 1, position: 3 }
    const form2 = { id: 2, position: 1 }
    const form3 = { id: 3, position: 2 }

    const forms = {
      [form1.id]: form1,
      [form2.id]: form2,
      [form3.id]: form3
    }

    const result = getAllForms({ support: { forms } })

    expect(result).toEqual([form2, form3, form1])
  })
})

describe('getIsLoading', () => {
  it('returns true if the form or field api is currently loading', () => {
    const result = getIsLoading({ support: { isLoading: true } })

    expect(result).toBe(true)
  })

  it('returns false if the form or field api is not currently loading', () => {
    const result = getIsLoading({ support: { isLoading: false } })

    expect(result).toBe(false)
  })
})
