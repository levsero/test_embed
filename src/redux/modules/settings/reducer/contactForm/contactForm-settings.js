import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  attachments: true,
  subject: false,
  suppress: false,
  tags: [],
  title: {},
  selectTicketForm: {}
};

const contactFormSettings = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        selectTicketForm: _.get(payload, 'webWidget.contactForm.selectTicketForm', state.selectTicketForm),
        attachments: _.get(payload, 'webWidget.contactForm.attachments', state.attachments),
        subject: _.get(payload, 'webWidget.contactForm.subject', state.subject),
        suppress: _.get(payload, 'webWidget.contactForm.suppress', state.suppress),
        tags: _.get(payload, 'webWidget.contactForm.tags', state.tags),
        title: _.get(payload, 'webWidget.contactForm.title', state.title)
      };
    default:
      return state;
  }
};

export default contactFormSettings;
