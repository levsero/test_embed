import _ from 'lodash'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = {
  title: {},
  suppress: false,
  nickname: null,
}

const talkSettings = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_SETTINGS:
      return {
        nickname: _.get(payload, 'webWidget.talk.nickname', state.nickname),
        suppress: _.get(payload, 'webWidget.talk.suppress', state.suppress),
        title: _.get(payload, 'webWidget.talk.title', state.title),
      }
    default:
      return state
  }
}

export default talkSettings
