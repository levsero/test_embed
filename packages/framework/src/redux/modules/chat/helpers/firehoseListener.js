import { CONNECTION_CLOSED_REASON, SDK_ACTION_TYPE_PREFIX } from 'src/constants/chat'
import {
  CHAT_DEPARTMENT_STATUS_EVENT,
  CHAT_STATUS_EVENT,
  CHAT_ENDED_EVENT,
} from 'src/constants/event'
import isFeatureEnabled from 'src/embeds/webWidget/selectors/feature-flags'
import { chatBanned } from 'src/redux/modules/chat'
import {
  SDK_ACCOUNT_STATUS,
  SDK_DEPARTMENT_UPDATE,
  SDK_CHAT_MEMBER_LEAVE,
} from 'src/redux/modules/chat/chat-action-types'
import { getHasBackfillCompleted } from 'src/redux/modules/chat/chat-selectors/selectors'
import * as callbacks from 'src/service/api/callbacks'
import { isVisitor } from 'src/util/chat'

const fireWidgetChatEvent = (action, getReduxState) => {
  switch (action.type) {
    case SDK_DEPARTMENT_UPDATE:
      callbacks.fireFor(CHAT_DEPARTMENT_STATUS_EVENT, [action.payload.detail])
      break
    case SDK_ACCOUNT_STATUS:
      callbacks.fireFor(CHAT_STATUS_EVENT)
      break
    case SDK_CHAT_MEMBER_LEAVE:
      if (isVisitor(action.payload.detail.nick) && getHasBackfillCompleted(getReduxState())) {
        callbacks.fireFor(CHAT_ENDED_EVENT)
      }
      break
  }
}

const fireChatBannedEvent = (zChat, dispatch, data) => {
  if (data.type === 'connection_update' && data.detail === 'closed') {
    if (zChat.getConnectionClosedReason() === CONNECTION_CLOSED_REASON.BANNED) {
      dispatch(chatBanned())
    }
  }
}

const firehoseListener = (zChat, dispatch, getReduxState) => (data) => {
  let actionType

  if (data.type === 'history') {
    actionType = `${SDK_ACTION_TYPE_PREFIX}/history/${data.detail.type}`
  } else {
    actionType = data.detail.type
      ? `${SDK_ACTION_TYPE_PREFIX}/${data.detail.type}`
      : `${SDK_ACTION_TYPE_PREFIX}/${data.type}`
  }

  if (data.type === 'chat' && data.detail && !data.detail.timestamp) {
    data.detail.timestamp = Date.now()
  } else {
    data.timestamp = Date.now()
  }

  data.isLastChatRatingEnabled = isFeatureEnabled(
    getReduxState(),
    'web_widget_enable_last_chat_rating'
  )

  const chatAction = {
    type: actionType,
    payload: data,
  }

  dispatch(chatAction)
  fireWidgetChatEvent(chatAction, getReduxState)
  fireChatBannedEvent(zChat, dispatch, data)
}

export default firehoseListener
