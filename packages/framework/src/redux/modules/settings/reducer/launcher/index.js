import { combineReducers } from 'redux'

import launcherSettings from 'src/embeds/launcher/settings/reducers'
import badge from './launcher-badge-settings'
import mobile from './launcher-mobile-settings'

export default combineReducers({
  badge,
  settings: launcherSettings,
  mobile,
})
