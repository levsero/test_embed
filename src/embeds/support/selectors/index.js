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

export const getSupportConfig = state => state.support.config
export const getNewSupportEmbedEnabled = state =>
  getSupportConfig(state).webWidgetReactRouterSupport
export const getMaxFileCount = state => getSupportConfig(state).maxFileCount
export const getMaxFileSize = state => getSupportConfig(state).maxFileSize
export const getActiveFormName = state => state.support.activeFormName
export const getFormState = (state, name) => state.support.formStates[name]
export const getAllAttachments = state => state.support.attachments

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
        type: 'text',
        keyID: 'name'
      },
      {
        id: 'email',
        title_in_portal: i18n.t('embeddable_framework.form.field.email.label'),
        required_in_portal: true,
        type: 'text',
        validation: 'email',
        keyID: 'email'
      },
      ...nonCheckBoxFields,
      subjectEnabled && {
        id: 'subject',
        title_in_portal: 'subject',
        required_in_portal: false,
        type: 'text',
        keyID: 'subject'
      },
      {
        id: 'description',
        title_in_portal: i18n.t('embeddable_framework.submitTicket.field.description.label'),
        required_in_portal: true,
        type: 'textarea',
        keyID: 'description'
      },
      ...checkBoxFields
      // Attachments will be implemented in this card https://zendesk.atlassian.net/browse/EWW-992
    ].filter(Boolean)
  }
)

export const getTicketFormFields = (state, formId) => {
  const ticketFields = getTicketFields(state)
  const ticketForms = getTicketForms(state)
  const ticketForm = ticketForms.find(form => {
    return form.id === formId
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
      type: 'text',
      validation: 'email',
      keyID: 'email'
    },
    ...formTicketFields
    // Attachments will be implemented in this card https://zendesk.atlassian.net/browse/EWW-992
  ].filter(Boolean)
}

export const getFormTicketFields = (state, route = 'contact-form') => {
  // 'contact-form' is placeholder for now, will be replaced with whatever the route ends up becoming
  if (route === 'contact-form') {
    return getCustomTicketFields(state)
  }

  return getTicketFormFields(state, route)
}
