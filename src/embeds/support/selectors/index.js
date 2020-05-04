import { createSelector } from 'reselect'
import {
  getSettingsContactFormSubject,
  getSettingsContactFormAttachments,
  getSettingsContactFormTitle
} from 'src/redux/modules/settings/settings-selectors'
import {
  getConfigNameFieldEnabled,
  getConfigNameFieldRequired,
  getLocale,
  getConfigAttachmentsEnabled,
  getFormTitleKey,
  getTicketFormIds
} from 'src/redux/modules/base/base-selectors'
import { getCheckboxFields, getNonCheckboxFields } from 'embeds/support/utils/fieldConversion'
import { i18n } from 'service/i18n'
import createKeyID from 'embeds/support/utils/createKeyID'
import routes from 'embeds/support/routes'

export const getSupportConfig = state => state.support.config
export const getMaxFileCount = state => getSupportConfig(state).maxFileCount
export const getMaxFileSize = state => getSupportConfig(state).maxFileSize
export const getActiveFormName = state => state.support.activeFormName
export const getAllAttachments = state => state.support.attachments
export const getDisplayDropzone = state => state.support.displayDropzone
export const getAttachmentLimitExceeded = state => state.support.attachmentLimitExceeded
export const getAttachmentTitle = (state, attachmentIds) => {
  const validAttachments = getAttachmentsForForm(state, attachmentIds)
  const numAttachments = validAttachments.length
  const title =
    numAttachments > 0
      ? i18n.t('embeddable_framework.submitTicket.attachments.title_withCount', {
          count: numAttachments
        })
      : i18n.t('embeddable_framework.submitTicket.attachments.title')
  return title
}

export const getIsFormLoading = (state, formId) => {
  if (formId === routes.defaultFormId) {
    return state.support.isTicketFieldsLoading
  }

  return Boolean(state.support.isFormLoading[formId])
}

export const getIsAnyTicketFormLoading = state => state.support.ticketFormsRequest.isLoading

export const getHasFetchedTicketForms = (state, fetchKey) => {
  return state.support.ticketFormsRequest.fetchKey === fetchKey
}

export const getContactFormTitle = createSelector(
  [getSettingsContactFormTitle, getFormTitleKey, getLocale],
  (contactFormTitle, formTitleKey, _locale) =>
    i18n.getSettingTranslation(contactFormTitle) ||
    i18n.t(`embeddable_framework.submitTicket.form.title.${formTitleKey}`)
)

export const getAttachmentsEnabled = state =>
  Boolean(getConfigAttachmentsEnabled(state) && getSettingsContactFormAttachments(state))

export const getAttachmentsForForm = (state, attachmentIds) => {
  const attachments = getAllAttachments(state)
  if (!attachmentIds) return attachments
  return attachments.filter(attachment => attachmentIds.includes(attachment.id))
}

export const getReadOnlyState = state => state.support.readOnly

const getInitialValues = (state, formId) => {
  const fields = getFormTicketFields(state, formId)

  const defaultValues = {}

  fields.forEach(field => {
    switch (field.type) {
      case 'tagger':
        if (!field.custom_field_options) {
          return
        }

        field.custom_field_options.forEach(item => {
          if (item.default) {
            defaultValues[field.keyID] = item.value
          }
        })
    }
  })

  return defaultValues
}

export const getFormState = (state, name) =>
  state.support.formStates[name] || getInitialValues(state, name)

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
  getAllAttachments,
  attachments => attachments.map(attachment => attachment.fileType)
)

export const getFormIdsToDisplay = state => {
  const filteredFormIds = state.support.filteredFormsToDisplay
  const allFormIds = getTicketFormIds(state)

  const idsToDisplay = filteredFormIds.length > 0 ? filteredFormIds : allFormIds

  return Array.from(new Set(idsToDisplay))
}

export const getFormsToDisplay = createSelector(
  getFormIdsToDisplay,
  state => state.support.forms,
  (formIds, forms) => {
    return formIds
      ?.map(id => forms[id])
      .filter(form => form?.active)
      .sort((a, b) => a.position - b.position)
  }
)

export const getForm = (state, formId) => {
  return state.support.forms[formId]
}

export const getCanDisplayForm = (state, formId) => {
  return Boolean(getFormsToDisplay(state).find(form => `${form.id}` === `${formId}`))
}

export const getField = (state, fieldId) => state.support.fields[fieldId]
export const getContactFormFields = state => state.support.contactFormFields

export const getTicketFormFields = createSelector(
  [
    getContactFormFields,
    getSettingsContactFormSubject,
    getConfigNameFieldEnabled,
    getConfigNameFieldRequired,
    getAttachmentsEnabled,

    // getLocale is just here so the translations get updated when locale changes
    getLocale
  ],
  (ticketFields, subjectEnabled, nameEnabled, nameRequired, attachmentsEnabled) => {
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
        validation: 'name',
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
      ...checkBoxFields,
      attachmentsEnabled && {
        id: 'attachments',
        visible_in_portal: true,
        type: 'attachments',
        keyID: 'key:attachments',
        validation: 'attachments'
      }
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

  const attachmentsEnabled = getAttachmentsEnabled(state)
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
      validation: 'name',
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
    ...fields,
    attachmentsEnabled && {
      id: 'attachments',
      visible_in_portal: true,
      type: 'attachments',
      keyID: 'key:attachments',
      validation: 'attachments'
    }
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
