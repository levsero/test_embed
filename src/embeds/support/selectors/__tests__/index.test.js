import * as selectors from '..'
import createStore from 'src/redux/createStore'
import { TICKET_FIELDS_REQUEST_SUCCESS } from 'src/redux/modules/submitTicket/submitTicket-action-types'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { updateEmbeddableConfig } from 'src/redux/modules/base'
import { getPrefillValues } from '..'
import { getLastPrefillTimestamp } from '..'

const emailField = {
  id: 'email',
  title_in_portal: 'Email address',
  required_in_portal: true,
  type: 'text',
  validation: 'email',
  keyID: 'email'
}
const descriptionField = {
  id: 'description',
  title_in_portal: 'How can we help you?',
  required_in_portal: true,
  type: 'textarea',
  keyID: 'description'
}
const checkboxField = {
  id: '123',
  title_in_portal: 'Checkbox field',
  required_in_portal: false,
  type: 'checkbox',
  keyID: '123'
}
const textField = {
  id: '456',
  title_in_portal: 'Text field',
  required_in_portal: false,
  type: 'text',
  keyID: '456'
}
const textareaField = {
  id: '789',
  title_in_portal: 'Textarea field',
  required_in_portal: false,
  type: 'textarea',
  keyID: '789'
}
const subjectField = {
  id: 'subject',
  title_in_portal: 'Subject',
  required_in_portal: false,
  type: 'text',
  keyID: 'subject'
}

describe('getCustomTicketFields', () => {
  const run = ({ nameFieldEnabled, nameFieldRequired, subjectFieldEnabled, fields = [] } = {}) => {
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
            subject: Boolean(subjectFieldEnabled)
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
              nameFieldRequired: Boolean(nameFieldRequired)
            }
          }
        }
      })
    )

    return selectors.getCustomTicketFields(store.getState())
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
          type: 'text',
          keyID: 'name'
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
          type: 'text',
          keyID: 'name'
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
        type: 'text',
        keyID: 'name'
      },
      emailField,
      textField,
      textareaField,
      {
        id: 'subject',
        title_in_portal: 'Subject',
        required_in_portal: false,
        type: 'text',
        keyID: 'subject'
      },
      descriptionField,
      checkboxField
    ])
  })
})

describe('getTicketFormFields', () => {
  const state = {
    submitTicket: {
      ticketForms: [{ id: '123456', ticket_field_ids: ['123', '456', '789'] }],
      ticketFields: {
        123: checkboxField,
        456: textField,
        789: textareaField
      }
    }
  }

  it('always includes an email field', () => {
    const result = selectors.getTicketFormFields(state)

    expect(result).toEqual([emailField])
  })

  it('displays all other custom fields below the email field when the form is found', () => {
    const result = selectors.getTicketFormFields(state, '123456')

    expect(result).toEqual([emailField, checkboxField, textField, textareaField])
  })
})

describe('getFormTicketFields', () => {
  const setUpState = fields => {
    return {
      submitTicket: {
        ticketForms: [{ id: '123456', ticket_field_ids: ['123', '456', '789'] }],
        ticketFields: fields
      },
      settings: { contactForm: { settings: { subject: false } } },
      base: { embeddableConfig: { embeds: { ticketSubmissionForm: { props: {} } } } }
    }
  }

  it('returns the contact form when the contact-form route is passed in', () => {
    const fields = [checkboxField, textField, textareaField]
    const result = selectors.getFormTicketFields(setUpState(fields), 'contact-form')

    expect(result).toEqual([emailField, textField, textareaField, descriptionField, checkboxField])
  })

  it('returns a ticket form when an id route is passed in', () => {
    const fields = {
      123: checkboxField,
      456: textField,
      789: textareaField
    }
    const result = selectors.getFormTicketFields(setUpState(fields), '123456')

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
      support: {
        formStates: {},
        prefillValues: {
          name: 'Prefill name'
        }
      }
    }

    if (formExists) {
      state.support.formStates.contactForm = {
        name: 'Bobby'
      }
    }

    return state
  }

  it('returns the form state if it exists', () => {
    const result = selectors.getFormState(createState(true), 'contactForm')

    expect(result).toEqual({ name: 'Bobby' })
  })

  it('returns the prefill values if the form state does not exist', () => {
    const result = selectors.getFormState(createState(false), 'contactForm')

    expect(result).toEqual({ name: 'Prefill name' })
  })
})

describe('getPrefillValues', () => {
  it('returns the prefill values', () => {
    const state = {
      support: {
        prefillValues: {
          name: 'Some name'
        }
      }
    }

    expect(getPrefillValues(state)).toEqual({ name: 'Some name' })
  })
})

describe('getLastPrefillTimestamp', () => {
  it('returns the time of the last prefill', () => {
    const state = {
      support: {
        prefillTimestamp: 123
      }
    }

    expect(getLastPrefillTimestamp(state)).toBe(123)
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

  test('getValidAttachments', () => {
    const selector = selectors.getValidAttachments.resultFunc
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
