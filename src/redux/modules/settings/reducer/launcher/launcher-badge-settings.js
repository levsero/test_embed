import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  layout: null,
  image: null,
  label: null
};

const launcherBadgeSettings = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        layout: _.get(payload, 'webWidget.launcher.badge.layout', state.layout),
        image: _.get(payload, 'webWidget.launcher.badge.image', state.image),
        label: _.get(payload, 'webWidget.launcher.badge.label', state.label)
      };
    default:
      return state;
  }
};

export default launcherBadgeSettings;
