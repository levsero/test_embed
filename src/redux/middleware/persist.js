import _ from 'lodash';

import { UPDATE_ACTIVE_EMBED, UPDATE_WIDGET_SHOWN } from 'src/redux/modules/base/base-action-types';
import { store } from 'service/persistence';

const keysToStore = {
  activeEmbed: 'base',
  widgetShown: 'base'
};
const actionsToStoreOn = [
  UPDATE_WIDGET_SHOWN,
  UPDATE_ACTIVE_EMBED
];

export default function persist({ getState }) {
  return (next) => (action) => {
    const result = next(action);

    const { type } = action;
    const state = getState();

    if (_.includes(actionsToStoreOn, type)) {
      const stateToStore = _.reduce(keysToStore, (res, val, key) => {
        res[key] = state[val][key];
        return res;
      }, {});

      store.set('store', stateToStore);
    }

    return result;
  };
}
