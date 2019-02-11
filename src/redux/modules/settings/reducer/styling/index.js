import { UPDATE_SETTINGS } from '../../settings-action-types';
import _ from 'lodash';

const initialState = {
  zIndex: 999999,
  positionVertical: 'bottom',
  positionHorizontal: null, // relies on embed for the default value
  offsetHorizontal: 0,
  offsetVertical: 0,
  offsetMobileHorizontal: 0,
  offsetMobileVertical: 0
};

const setHideWhenChatOffline = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        positionHorizontal: _.get(payload, 'webWidget.position.horizontal', state.positionHorizontal),
        positionVertical: _.get(payload, 'webWidget.position.vertical', state.positionVertical),
        offsetHorizontal: _.get(payload, 'webWidget.offset.horizontal', state.offsetHorizontal),
        offsetMobileHorizontal: _.get(payload, 'webWidget.offset.mobile.horizontal', state.offsetMobileHorizontal),
        offsetMobileVertical: _.get(payload, 'webWidget.offset.mobile.vertical', state.offsetMobileVertical),
        offsetVertical: _.get(payload, 'webWidget.offset.vertical', state.offsetVertical),
        zIndex: _.get(payload, 'webWidget.zIndex', state.zIndex),
      };
    default:
      return state;
  }
};

export default setHideWhenChatOffline;
