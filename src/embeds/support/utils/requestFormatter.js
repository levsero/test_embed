import _ from 'lodash'
import {
  getSettingsContactFormTags,
  getSettingsContactFormSubject
} from 'src/redux/modules/settings/settings-selectors'
import { getTicketFields } from 'src/redux/modules/submitTicket/submitTicket-selectors'
import { i18n } from 'service/i18n'
import { location, getReferrerPolicy } from 'utility/globals'

const findFieldId = (name, ticketFields) => {
  const field = _.find(ticketFields, field => {
    return field.type === name && !field.removable
  })

  return _.get(field, 'id', null)
}

const formatNameFromEmail = email => {
  const localPart = email.split('@', 2)[0]
  const newName = localPart.split(/[._\-]/) // eslint-disable-line no-useless-escape

  return _.map(newName, _.capitalize).join(' ')
}

const formatDescriptionField = description => {
  const submittedFrom = i18n.t('embeddable_framework.submitTicket.form.submittedFrom.label', {
    url: location.href
  })
  const descriptionUrlStr = `\n\n------------------\n${submittedFrom}`

  return getReferrerPolicy() ? description : `${description}${descriptionUrlStr}`
}

const formatSubjetFromDescription = descriptionData =>
  descriptionData.length <= 50 ? descriptionData : `${descriptionData.slice(0, 50)}...`

const formatTicketFieldData = (formState, subjectFieldId, descriptionFieldId) => {
  let params = { fields: {} }

  _.forEach(formState, function(value, name) {
    // Custom field names are numbers so we check if name is NaN
    const nameInt = parseInt(name, 10)

    if (!isNaN(nameInt) && nameInt !== subjectFieldId && nameInt !== descriptionFieldId) {
      params.fields[name] = value
    }
  })

  return params
}

const getTicketFormValues = (formState, state) => {
  const ticketFields = getTicketFields(state)
  const descriptionField = findFieldId('description', ticketFields)
  const description = formState[descriptionField]
  const subjectField = findFieldId('subject', ticketFields)
  const subjectData = formState[subjectField]
  const subject = !_.isEmpty(subjectData) ? subjectData : formatSubjetFromDescription(description)

  return {
    description,
    subject,
    descriptionField,
    subjectField
  }
}

const getContactFormValues = (formState, state) => {
  const description = formState.description
  const subjectData = formState.subject
  const subject =
    getSettingsContactFormSubject(state) && !_.isEmpty(subjectData)
      ? subjectData
      : formatSubjetFromDescription(description)

  return {
    description,
    subject
  }
}

export default (state, formState, attachments, formTitle) => {
  const isTicketForm = formTitle !== 'contact-form'
  const params = !isTicketForm
    ? getContactFormValues(formState, state)
    : getTicketFormValues(formState, state)

  return {
    request: {
      subject: params.subject,
      tags: ['web_widget'].concat(getSettingsContactFormTags(state)),
      via_id: 48,
      comment: {
        body: formatDescriptionField(params.description),
        uploads: attachments ? attachments : []
      },
      requester: {
        name: formState.name || formatNameFromEmail(formState.email),
        email: formState.email,
        locale_id: i18n.getLocaleId()
      },
      ticket_form_id: isTicketForm ? parseInt(formTitle) : null,
      ...formatTicketFieldData(formState, params.subjectField, params.descriptionField)
    }
  }
}
