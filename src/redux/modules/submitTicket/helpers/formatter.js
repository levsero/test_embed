import _ from 'lodash';
import { i18n } from 'service/i18n';
import { store } from 'service/persistence';
import { settings } from 'service/settings';
import { location } from 'utility/globals';

const findFieldId = (name, ticketFields) => {
  const field = _.find(ticketFields, (field) => {
    return field.type === name && !field.removable;
  });

  return _.get(field, 'id', null);
};

const formatNameFromEmail = (email) => {
  const localPart = email.split('@', 2)[0];
  const newName = localPart.split(/[._\-]/);

  return _.map(newName, _.capitalize).join(' ');
};

const formatDescriptionField = (description) => {
  const submittedFrom = i18n.t(
    'embeddable_framework.submitTicket.form.submittedFrom.label',
    { url: location.href }
  );
  const referrerPolicy = store.get('referrerPolicy', 'session');
  const descriptionUrlStr = `\n\n------------------\n${submittedFrom}`;

  return referrerPolicy ? description : `${description}${descriptionUrlStr}`;
};

const formatTicketFieldData = (formState, subjectFieldId, descriptionFieldId) => {
  let params = { fields: {} };

  _.forEach(formState, function(value, name) {
    // Custom field names are numbers so we check if name is NaN
    const nameInt = parseInt(name, 10);

    if (!isNaN(nameInt) && nameInt !== subjectFieldId && nameInt !== descriptionFieldId) {
      params.fields[name] = value;
    }
  });

  return params;
};

export const formatRequestData = (formState, ticketFormsAvailable, ticketFields, activeTicketForm, attachments) => {
  const descriptionField = findFieldId('description', ticketFields);
  const descriptionData = ticketFormsAvailable ? formState[descriptionField] : formState.description;
  const subjectField = findFieldId('subject', ticketFields);
  const subjectData = ticketFormsAvailable && subjectField ? formState[subjectField] : formState.subject;
  const subjectAllowed = settings.get('contactForm.subject') || ticketFormsAvailable;
  const subject = subjectAllowed && !_.isEmpty(subjectData)
                ? subjectData
                : (descriptionData.length <= 50) ? descriptionData : `${descriptionData.slice(0,50)}...`;

  return {
    'request': {
      'subject': subject,
      'tags': ['web_widget'].concat(settings.get('contactForm.tags')),
      'via_id': 48,
      'comment': {
        'body': formatDescriptionField(descriptionData),
        'uploads': attachments
      },
      'requester': {
        'name': formState.name || formatNameFromEmail(formState.email),
        'email': formState.email,
        'locale_id': i18n.getLocaleId()
      },
      'ticket_form_id': ticketFormsAvailable ? activeTicketForm.id : null,
      ...formatTicketFieldData(formState, subjectField, descriptionField)
    }
  };
};
