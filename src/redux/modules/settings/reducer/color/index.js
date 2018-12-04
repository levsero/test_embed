import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  launcher: '',
  launcherText: '',
  theme: '',
  button: '',
  resultLists: '',
  header: '',
  articleLinks: ''
};

const colorSettings = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        launcher: _.get(payload, 'webWidget.color.launcher', state.launcher),
        launcherText: _.get(payload, 'webWidget.color.launcherText', state.launcherText),
        button: _.get(payload, 'webWidget.color.button', state.button),
        resultLists: _.get(payload, 'webWidget.color.resultLists', state.resultLists),
        header: _.get(payload, 'webWidget.color.header', state.header),
        articleLinks: _.get(payload, 'webWidget.color.articleLinks', state.articleLinks),
        theme: _.get(payload, 'webWidget.color.theme', state.theme)
      };
    default:
      return state;
  }
};

export default colorSettings;
