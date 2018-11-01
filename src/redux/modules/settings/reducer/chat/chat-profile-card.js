import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  avatar: true,
  title: true,
  rating: true
};

const profileCard = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        avatar: _.get(payload, 'webWidget.chat.profileCard.avatar', state.avatar),
        title: _.get(payload, 'webWidget.chat.profileCard.title', state.title),
        rating: _.get(payload, 'webWidget.chat.profileCard.rating', state.rating)
      };
    default:
      return state;
  }
};

export default profileCard;
