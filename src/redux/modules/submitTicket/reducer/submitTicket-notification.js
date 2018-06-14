import { TICKET_SUBMISSION_REQUEST_SUCCESS } from '../submitTicket-action-types';
import { WIDGET_HIDE_ANIMATION_COMPLETE, UPDATE_ACTIVE_EMBED } from '../../base/base-action-types';

const initialState = {
  show: false
};

const notification = (state = initialState, action) => {
  const { type } = action;

  switch (type) {
    case TICKET_SUBMISSION_REQUEST_SUCCESS:
      return { show: true };
    case UPDATE_ACTIVE_EMBED:
    case WIDGET_HIDE_ANIMATION_COMPLETE:
      return { show: false };
    default:
      return state;
  }
};

export default notification;
