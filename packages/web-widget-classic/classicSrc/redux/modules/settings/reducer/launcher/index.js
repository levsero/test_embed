import launcherSettings from 'classicSrc/embeds/launcher/settings/reducers'
import { combineReducers } from 'redux'
import badge from './launcher-badge-settings'
import mobile from './launcher-mobile-settings'

export default combineReducers({
  badge,
  settings: launcherSettings,
  mobile,
})
