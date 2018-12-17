import { combineReducers } from 'redux';

import launcherSettings from './launcher-settings';
import badge from './launcher-badge-settings';

export default combineReducers({
  settings: launcherSettings,
  badge
});
