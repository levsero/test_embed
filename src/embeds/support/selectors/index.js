import { createSelector } from 'reselect'
import {
  getTicketFieldsResponse,
  getTicketFields,
  getTicketForms
} from 'src/redux/modules/submitTicket/submitTicket-selectors'
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
  attachments =>
    attachments.filter(
      attachment => !attachment.uploading && !attachment.errorMessage && attachment.uploadToken
    )
)

export const getAttachmentTokens = createSelector(
  getValidAttachments,
  attachments => attachments.map(attachment => attachment.uploadToken)
)

export const getAttachmentsReady = createSelector(
  [getAllAttachments, getValidAttachments],
  (allAttachments, validAttachments) => allAttachments.length === validAttachments.length
)

export const getAttachmentTypes = createSelector(
  getValidAttachments,
  attachments => attachments.map(attachment => attachment.fileType)
)

export const getTicketFormTitle = (state, id) => {
  const ticketForm = getTicketForms(state).find(form => {
    return form.id === parseInt(id)
  })
  return ticketForm ? ticketForm.display_name : ''
}
export const getCustomTicketFields = createSelector(
  [
    getTicketFieldsResponse,
    getSettingsContactFormSubject,
    getConfigNameFieldEnabled,
    getConfigNameFieldRequired,

    // getLocale is just here so the translations get updated when locale changes
    getLocale
  ],
  (ticketFields, subjectEnabled, nameEnabled, nameRequired) => {
    const checkBoxFields = getCheckboxFields(ticketFields)
    const nonCheckBoxFields = getNonCheckboxFields(ticketFields)

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
    ].filter(Boolean)
  }
)

export const getTicketFormFields = (state, formId) => {
  const ticketFields = getTicketFields(state)
  const ticketForms = getTicketForms(state)
  const ticketFormId = parseInt(formId)
  const ticketForm = ticketForms.find(form => {
    return form.id === ticketFormId
  })
  const formTicketFields =
    ticketForm && ticketForm.ticket_field_ids
      ? Object.values(ticketFields).filter(field => {
          return ticketForm.ticket_field_ids.includes(field.id)
        })
      : []

  return [
    {
      id: 'email',
      title_in_portal: i18n.t('embeddable_framework.form.field.email.label'),
      required_in_portal: true,
      visible_in_portal: true,
      type: 'text',
      validation: 'email',
      keyID: 'key:email'
    },
    ...formTicketFields
    // Attachments will be implemented in this card https://zendesk.atlassian.net/browse/EWW-992
  ].filter(Boolean)
}

export const getFormTicketFields = (state, route) => {
  if (route === routes.defaultFormId) {
    return getCustomTicketFields(state)
  }

  return getTicketFormFields(state, route)
}
