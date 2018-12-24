import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  chatLabel: null,
  label: null
};

const launcherSettings = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        chatLabel: _.get(payload, 'webWidget.launcher.chatLabel', state.chatLabel),
        label: _.get(payload, 'webWidget.launcher.label', state.label)
      };
    default:
      return state;
  }
};

export default launcherSettings;
