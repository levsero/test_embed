import _ from 'lodash'
import { i18n } from 'src/apps/webWidget/services/i18n'
import routes from 'src/embeds/support/routes'
import {
  getSettingsContactFormTags,
  getSettingsContactFormSubject,
} from 'src/redux/modules/settings/settings-selectors'
import { location, getReferrerPolicy } from 'src/util/globals'

const findOriginalId = (systemFieldName, ticketFields) => {
  const field = _.find(ticketFields, (field) => {
    return field.id === systemFieldName
  })

  return _.get(field, 'originalId', null)
}

const formatNameFromEmail = (email) => {
  const localPart = email.split('@', 2)[0]
  const newName = localPart.split(/[._\-]/) // eslint-disable-line no-useless-escape

  return _.map(newName, _.capitalize).join(' ')
}

const formatDescriptionField = (description) => {
  const submittedFrom = i18n.t('embeddable_framework.submitTicket.form.submittedFrom.label', {
    url: location.href,
  })
  const descriptionUrlStr = `\n\n------------------\n${submittedFrom}`

  return getReferrerPolicy() ? description : `${description}${descriptionUrlStr}`
}

const formatSubjectFromDescription = (descriptionData = '') =>
  descriptionData.length <= 50 ? descriptionData : `${descriptionData.slice(0, 50)}...`

const formatTicketFieldData = (formState, fields, subjectFieldId, descriptionFieldId) => {
  const values = { ...formState }
  let params = { fields: {} }

  if (fields) {
    fields.forEach((field) => {
      if (!field.required && values[field.originalId || field.id] === undefined) {
        switch (field.type) {
          case 'checkbox':
            values[field.originalId || field.id] = 0
            break
          case 'integer':
          case 'decimal':
          case 'text':
          case 'tagger':
          case 'textarea':
            values[field.originalId || field.id] = ''
            break
        }
      }
    })
  }

  _.forEach(values, function (value, name) {
    // Custom field names are numbers so we check if name is NaN
    const nameInt = parseInt(name, 10)

    if (!isNaN(nameInt) && nameInt !== subjectFieldId && nameInt !== descriptionFieldId) {
      params.fields[name] = value
    }
  })

  return params
}

const getTicketFormValues = (formState, ticketFields) => {
  const descriptionField = findOriginalId('description', ticketFields)
  const description = formState[descriptionField]
  const subjectField = findOriginalId('subject', ticketFields)
  const subjectData = formState[subjectField]
  const subject = !_.isEmpty(subjectData) ? subjectData : formatSubjectFromDescription(description)

  return {
    description,
    subject,
    descriptionField,
    subjectField,
  }
}

const getContactFormValues = (formState, state) => {
  const description = formState.description
  const subjectData = formState.subject
  const subject =
    getSettingsContactFormSubject(state) && !_.isEmpty(subjectData)
      ? subjectData
      : formatSubjectFromDescription(description)

  return {
    description,
    subject,
  }
}

export default (state, formState, attachments, formTitle, fields) => {
  const isTicketForm = formTitle !== routes.defaultFormId
  const params = !isTicketForm
    ? getContactFormValues(formState, state)
    : getTicketFormValues(formState, fields)

  return {
    request: {
      subject: params.subject,
      tags: ['web_widget'].concat(getSettingsContactFormTags(state)),
      via_id: 48,
      comment: {
        body: formatDescriptionField(params.description),
        uploads: attachments ? attachments : [],
      },
      requester: {
        name: formState.name || formatNameFromEmail(formState.email),
        email: formState.email,
        locale_id: i18n.getLocaleId(),
      },
      ticket_form_id: isTicketForm ? parseInt(formTitle) : null,
      ...formatTicketFieldData(formState, fields, params.subjectField, params.descriptionField),
    },
  }
}
