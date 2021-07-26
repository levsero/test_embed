import { combineReducers } from 'redux'
import chatLabel from 'src/embeds/launcher/settings/reducers/chatLabel'
import label from 'src/embeds/launcher/settings/reducers/label'
import talkLabel from 'src/embeds/launcher/settings/reducers/talkLabel'

export default combineReducers({
  label,
  chatLabel,
  talkLabel,
})
