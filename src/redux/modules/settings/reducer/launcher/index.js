import { combineReducers } from 'redux'

import launcherSettings from './launcher-settings'
import badge from './launcher-badge-settings'
import mobile from './launcher-mobile-settings'

export default combineReducers({
  badge,
  settings: launcherSettings,
  mobile
})
