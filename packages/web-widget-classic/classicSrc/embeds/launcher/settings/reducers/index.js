import chatLabel from 'classicSrc/embeds/launcher/settings/reducers/chatLabel'
import label from 'classicSrc/embeds/launcher/settings/reducers/label'
import talkLabel from 'classicSrc/embeds/launcher/settings/reducers/talkLabel'
import { combineReducers } from 'redux'

export default combineReducers({
  label,
  chatLabel,
  talkLabel,
})
