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
export const getFilteredFormIds = state => state.support.filteredFormsToDisplay
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

export const getCustomerProvidedDefaultValues = (state, formId) => {
  const fields = getFormTicketFields(state, formId)

  const defaultValues = {}

  fields.forEach(field => {
    switch (field.type) {
      case 'tagger':
        if (!field.options) {
          return
        }

        field.options.forEach(item => {
          if (item.default) {
            defaultValues[field.id] = item.value
          }
        })
    }
  })

  return defaultValues
}

export const getFormState = (state, name) =>
  state.support.formStates[name] || getCustomerProvidedDefaultValues(state, name)

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

export const getFormIdsToDisplay = createSelector(
  [getTicketFormIds, getFilteredFormIds],
  (allFormIds, filteredFormIds) => {
    const idsToDisplay = filteredFormIds.length > 0 ? filteredFormIds : allFormIds || []

    return Array.from(new Set(idsToDisplay))
  }
)

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
    const fields = ticketFields
      .map(convertTicketFieldToFormField)
      .map(field => ({ ...field, visible: true }))

    const checkBoxFields = getCheckboxFields(fields)
    const nonCheckBoxFields = getNonCheckboxFields(fields)

    return [
      nameEnabled && {
        id: 'name',
        title: i18n.t('embeddable_framework.submitTicket.field.name.label'),
        required: nameRequired,
        visible: true,
        type: 'text',
        validation: 'name'
      },
      {
        id: 'email',
        title: i18n.t('embeddable_framework.form.field.email.label'),
        required: true,
        visible: true,
        type: 'text',
        validation: 'email'
      },
      ...nonCheckBoxFields.filter(field => field.type !== 'description'),
      subjectEnabled && {
        id: 'subject',
        title: i18n.t('embeddable_framework.submitTicket.field.subject.label'),
        required: false,
        visible: true,
        type: 'text'
      },
      {
        id: 'description',
        title: i18n.t('embeddable_framework.submitTicket.field.description.label'),
        required: true,
        visible: true,
        type: 'textarea'
      },
      ...checkBoxFields,
      attachmentsEnabled && {
        id: 'attachments',
        visible: true,
        type: 'attachments',
        validation: 'attachments'
      }
    ].filter(Boolean)
  }
)

const convertTicketFieldToFormField = ticketField => {
  const formField = {
    originalId: ticketField.id,
    id: createKeyID(ticketField.id),
    title: ticketField.title_in_portal,
    required: ticketField.required_in_portal,
    visible: ticketField.visible_in_portal,
    type: ticketField.type,
    description: ticketField.description
  }

  if (ticketField.custom_field_options) {
    formField.options = ticketField.custom_field_options
  }

  return formField
}

export const getCustomTicketFields = (state, formId) => {
  const fallbackForm = {
    ticket_field_ids: []
  }

  const attachmentsEnabled = getAttachmentsEnabled(state)
  const ticketForm = getForm(state, formId) || fallbackForm
  const nameEnabled = getConfigNameFieldEnabled(state)
  const nameRequired = getConfigNameFieldRequired(state)
  const fields = ticketForm.ticket_field_ids
    .map(id => getField(state, id))
    .filter(Boolean)
    .map(convertTicketFieldToFormField)

  return [
    nameEnabled && {
      id: 'name',
      title: i18n.t('embeddable_framework.submitTicket.field.name.label'),
      required: nameRequired,
      visible: true,
      type: 'text',
      validation: 'name'
    },
    {
      id: 'email',
      title: i18n.t('embeddable_framework.form.field.email.label'),
      required: true,
      visible: true,
      type: 'text',
      validation: 'email'
    },
    ...fields,
    attachmentsEnabled && {
      id: 'attachments',
      visible: true,
      type: 'attachments',
      validation: 'attachments'
    }
  ]
    .filter(Boolean)
    .map(field => {
      if (field.type === 'description') {
        return {
          ...field,
          id: 'description'
        }
      }

      if (field.type === 'subject') {
        return {
          ...field,
          id: 'subject'
        }
      }

      return field
    })
}

export const getFormTicketFields = (state, formId) => {
  if (formId === routes.defaultFormId) {
    return getTicketFormFields(state)
  }

  return getCustomTicketFields(state, formId)
}

const getFormsWithSuppressedTitle = state => state.support.formsWithSuppressedTitle

export const getTicketFormTitle = (state, formId) => {
  const suppressed = getFormsWithSuppressedTitle(state).find(id => `${id}` === `${formId}`)
  if (suppressed) {
    return undefined
  }
  const form = getForm(state, formId)
  return form ? form.display_name : undefined
}
