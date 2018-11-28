import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  launcher: '',
  launcherText: ''
};

const colorSettings = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        launcher: _.get(payload, 'webWidget.color.launcher', state.launcher),
        launcherText: _.get(payload, 'webWidget.color.launcherText', state.launcherText),
      };
    default:
      return state;
  }
};

export default colorSettings;
