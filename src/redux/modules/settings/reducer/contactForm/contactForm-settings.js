import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  attachments: true,
  subject: false,
  suppress: false,
  tags: []
};

const contactFormSettings = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        attachments: _.get(payload, 'webWidget.contactForm.attachments', state.attachments),
        subject: _.get(payload, 'webWidget.contactForm.subject', state.subject),
        suppress: _.get(payload, 'webWidget.contactForm.suppress', state.suppress),
        tags: _.get(payload, 'webWidget.contactForm.tags', state.tags)
      };
    default:
      return state;
  }
};

export default contactFormSettings;
