import { combineReducers } from 'redux'

import label from 'src/embeds/launcher/settings/reducers/label'
import talkLabel from 'src/embeds/launcher/settings/reducers/talkLabel'
import chatLabel from 'src/embeds/launcher/settings/reducers/chatLabel'

export default combineReducers({
  label,
  chatLabel,
  talkLabel
})
