import * as selectors from '..'
import createStore from 'src/redux/createStore'
import { TICKET_FIELDS_REQUEST_SUCCESS } from 'src/redux/modules/submitTicket/submitTicket-action-types'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { updateEmbeddableConfig } from 'src/redux/modules/base'

describe('getCustomTicketFields', () => {
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

    expect(result).toEqual([
      emailField,
      {
        id: 'subject',
        title_in_portal: 'subject',
        required_in_portal: false,
        type: 'text',
        keyID: 'subject'
      },
      descriptionField
    ])
  })

  it('displays all non-checkbox fields above subject/description and all checkbox fields after subject/description', () => {
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
        title_in_portal: 'subject',
        required_in_portal: false,
        type: 'text',
        keyID: 'subject'
      },
      descriptionField,
      checkboxField
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

test('getFormState', () => {
  const result = selectors.getFormState(state, 'contactForm')

  expect(result).toEqual({ name: 'Bobby' })
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
