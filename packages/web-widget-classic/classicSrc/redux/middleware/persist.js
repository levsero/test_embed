import {
  UPDATE_ACTIVE_EMBED,
  UPDATE_WIDGET_SHOWN,
} from 'classicSrc/redux/modules/base/base-action-types'
import {
  END_CHAT_REQUEST_SUCCESS,
  CHAT_STARTED,
} from 'classicSrc/redux/modules/chat/chat-action-types'
import _ from 'lodash'
import { persistence as store } from '@zendesk/widget-shared-services'

const keysToStore = {
  activeEmbed: 'base',
  widgetShown: 'base',
  is_chatting: 'chat', // eslint-disable-line camelcase
}
const actionsToStoreOn = [
  UPDATE_WIDGET_SHOWN,
  UPDATE_ACTIVE_EMBED,
  CHAT_STARTED,
  END_CHAT_REQUEST_SUCCESS,
]

export default function persist({ getState }) {
  return (next) => (action) => {
    const result = next(action)

    const { type } = action
    const state = getState()

    if (_.includes(actionsToStoreOn, type)) {
      const stateToStore = _.reduce(
        keysToStore,
        (res, val, key) => {
          res[key] = state[val][key]
          return res
        },
        {}
      )

      store.set('store', stateToStore)
    }

    return result
  }
}
