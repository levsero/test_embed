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
        layout: validateLayout(initialState, state, payload),
        image: _.get(payload, 'webWidget.launcher.badge.image', state.image),
        label: _.get(payload, 'webWidget.launcher.badge.label', state.label)
      };
    default:
      return state;
  }
};

const validateLayout = (initialState, state, payload) => {
  const { layout } = initialState;
  const VALID_LAYOUTS = [
    'image_only',
    'text_only',
    'image_right',
    'image_left'
  ];
  let newLayout = _.get(payload, 'webWidget.launcher.badge.layout', state.layout);

  if (_.isEmpty(newLayout)) return layout;

  newLayout = newLayout.toLowerCase();
  return _.includes(VALID_LAYOUTS, newLayout) ? newLayout : layout;
};

export default launcherBadgeSettings;
