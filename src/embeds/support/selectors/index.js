import { createSelector } from 'reselect'
import { getSettingsContactFormSubject } from 'src/redux/modules/settings/settings-selectors'
import {
  getConfigNameFieldEnabled,
  getConfigNameFieldRequired,
  getLocale
} from 'src/redux/modules/base/base-selectors'
import { getCheckboxFields, getNonCheckboxFields } from 'embeds/support/utils/fieldConversion'
import { i18n } from 'service/i18n'
import createKeyID from 'embeds/support/utils/createKeyID'
import routes from 'embeds/support/routes'

export const getSupportConfig = state => state.support.config
export const getNewSupportEmbedEnabled = state =>
  getSupportConfig(state).webWidgetReactRouterSupport
export const getMaxFileCount = state => getSupportConfig(state).maxFileCount
export const getMaxFileSize = state => getSupportConfig(state).maxFileSize
export const getActiveFormName = state => state.support.activeFormName
export const getAllAttachments = state => state.support.attachments
export const getAttachmentLimitExceeded = state => state.support.attachmentLimitExceeded

export const getPrefillId = state => state.support.prefillId
export const getLastFormPrefillId = (state, formId) => state.support.lastFormPrefillId[formId]

const getSpecificFormPrefills = state => state.support.prefillSpecificFormValues
const getGenericFormPrefillValues = state => state.support.prefillValues

export const getPrefillValues = formId =>
  createSelector(
    getSpecificFormPrefills,
    getGenericFormPrefillValues,
    getLocale,
    (specific, generic, locale) => {
      const getSpecificValues = locale => {
        if (!specific[formId] || !specific[formId][locale]) {
          return {}
        }

        return specific[formId][locale]
      }

      const values = {
        ...(generic['*'] || {}),
        ...(generic[locale] || {}),
        ...getSpecificValues('*'),
        ...getSpecificValues(locale)
      }

      return Object.keys(values).reduce(
        (prev, key) => ({
          ...prev,
          [createKeyID(key)]: values[key]
        }),
        {}
      )
    }
  )

export const getReadOnlyState = state => state.support.readOnly

export const getFormState = (state, name) =>
  state.support.formStates[name] || getPrefillValues(name)(state)

export const getValidAttachments = createSelector(
  getAllAttachments,
  attachments => attachments.filter(attachment => attachment.uploading || attachment.uploadToken)
)

export const getSuccessfulAttachments = createSelector(
  getAllAttachments,
  attachments => attachments.filter(attachment => attachment.uploadToken)
)

export const getAttachmentTokens = createSelector(
  getSuccessfulAttachments,
  attachments => attachments.map(attachment => attachment.uploadToken)
)

export const getAttachmentsReady = createSelector(
  [getAllAttachments, getSuccessfulAttachments],
  (allAttachments, successfulAttachments) => allAttachments.length === successfulAttachments.length
)

export const getAttachmentTypes = createSelector(
  getValidAttachments,
  attachments => attachments.map(attachment => attachment.fileType)
)

export const getForm = (state, formId) => state.support.forms[formId]
export const getField = (state, fieldId) => state.support.fields[fieldId]
export const getContactFormFields = state => state.support.contactFormFields

export const getTicketFormFields = createSelector(
  [
    getContactFormFields,
    getSettingsContactFormSubject,
    getConfigNameFieldEnabled,
    getConfigNameFieldRequired,

    // getLocale is just here so the translations get updated when locale changes
    getLocale
  ],
  (ticketFields, subjectEnabled, nameEnabled, nameRequired) => {
    const fields = ticketFields.map(field => ({ ...field, visible_in_portal: true }))

    const checkBoxFields = getCheckboxFields(fields)
    const nonCheckBoxFields = getNonCheckboxFields(fields)

    return [
      nameEnabled && {
        id: 'name',
        title_in_portal: i18n.t('embeddable_framework.submitTicket.field.name.label'),
        required_in_portal: nameRequired,
        visible_in_portal: true,
        type: 'text',
        keyID: 'key:name'
      },
      {
        id: 'email',
        title_in_portal: i18n.t('embeddable_framework.form.field.email.label'),
        required_in_portal: true,
        visible_in_portal: true,
        type: 'text',
        validation: 'email',
        keyID: 'key:email'
      },
      ...nonCheckBoxFields.filter(field => field.type !== 'description'),
      subjectEnabled && {
        id: 'subject',
        title_in_portal: i18n.t('embeddable_framework.submitTicket.field.subject.label'),
        required_in_portal: false,
        visible_in_portal: true,
        type: 'text',
        keyID: 'key:subject'
      },
      {
        id: 'description',
        title_in_portal: i18n.t('embeddable_framework.submitTicket.field.description.label'),
        required_in_portal: true,
        visible_in_portal: true,
        type: 'textarea',
        keyID: 'key:description'
      },
      ...checkBoxFields
      // Attachments will be implemented in this card https://zendesk.atlassian.net/browse/EWW-992
    ]
      .filter(Boolean)
      .map(field => ({
        ...field,
        keyID: field.keyID || createKeyID(field.id)
      }))
  }
)

export const getCustomTicketFields = (state, formId) => {
  const fallbackForm = {
    ticket_field_ids: []
  }
  const ticketForm = getForm(state, formId) || fallbackForm
  const nameEnabled = getConfigNameFieldEnabled(state)
  const nameRequired = getConfigNameFieldRequired(state)
  const fields = ticketForm.ticket_field_ids.map(id => getField(state, id))

  return [
    nameEnabled && {
      id: 'name',
      title_in_portal: i18n.t('embeddable_framework.submitTicket.field.name.label'),
      required_in_portal: nameRequired,
      visible_in_portal: true,
      type: 'text',
      keyID: 'key:name'
    },
    {
      id: 'email',
      title_in_portal: i18n.t('embeddable_framework.form.field.email.label'),
      required_in_portal: true,
      visible_in_portal: true,
      type: 'text',
      validation: 'email',
      keyID: 'key:email'
    },
    ...fields
    // Attachments will be implemented in this card https://zendesk.atlassian.net/browse/EWW-992
  ]
    .filter(Boolean)
    .map(field => {
      if (field.type === 'description') {
        return {
          ...field,
          keyID: createKeyID('description')
        }
      }

      if (field.type === 'subject') {
        return {
          ...field,
          keyID: createKeyID('subject')
        }
      }

      return {
        ...field,
        keyID: createKeyID(field.id)
      }
    })
}

export const getFormTicketFields = (state, formId) => {
  if (formId === routes.defaultFormId) {
    return getTicketFormFields(state)
  }

  return getCustomTicketFields(state, formId)
}
