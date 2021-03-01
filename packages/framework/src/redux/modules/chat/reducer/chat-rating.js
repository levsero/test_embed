import _ from 'lodash'
import {
  CHAT_RATING_REQUEST_SUCCESS,
  CHAT_RATING_COMMENT_REQUEST_SUCCESS,
  END_CHAT_REQUEST_SUCCESS,
  CHAT_RECONNECT,
  UPDATE_PREVIEWER_SCREEN,
  SDK_CHAT_MEMBER_LEAVE,
  SDK_CHAT_RATING,
  SDK_CHAT_COMMENT,
  SDK_CHAT_MEMBER_JOIN,
} from '../chat-action-types'
import { isAgent } from 'src/util/chat'
import { ratings } from 'src/embeds/chat/components/RatingGroup'
import { store } from 'src/framework/services/persistence'

const initialState = {
  value: ratings.NOT_SET,
  disableEndScreen: false,
  comment: null,
}

const rating = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case CHAT_RATING_REQUEST_SUCCESS:
      return {
        ...state,
        value: payload,
        comment: null,
      }
    case SDK_CHAT_RATING:
      return {
        ...state,
        value: payload.detail.new_rating,
        comment: null,
      }
    case CHAT_RATING_COMMENT_REQUEST_SUCCESS:
      return {
        ...state,
        comment: payload,
      }
    case SDK_CHAT_COMMENT:
      return {
        ...state,
        comment: payload.detail.new_comment,
      }
    case UPDATE_PREVIEWER_SCREEN:
      return {
        ...state,
        disableEndScreen: true,
      }
    case SDK_CHAT_MEMBER_LEAVE: {
      // Add arturo gate `webWidgetEnableLastChatRating` to reset state using CHAT_LAST_CHAT_RATING_REQUEST_COMPLETE
      // instead of SDK_CHAT_MEMBER_LEAVE when the agent ends the chat. We still need to use
      // rating state to determine if we want to display the rating button after SDK_CHAT_MEMBER_LEAVE
      // is triggered.
      const isLastChatRatingEnabled = _.get(store.get('arturos'), 'webWidgetEnableLastChatRating')
      if (!isLastChatRatingEnabled && !isAgent(payload.detail.nick)) return initialState
      return state
    }
    case SDK_CHAT_MEMBER_JOIN: {
      const isLastChatRatingEnabled = _.get(store.get('arturos'), 'webWidgetEnableLastChatRating')
      if (isLastChatRatingEnabled && !isAgent(payload.detail.nick)) return initialState
      return state
    }
    case END_CHAT_REQUEST_SUCCESS:
    case CHAT_RECONNECT:
      return initialState
    default:
      return state
  }
}

export default rating
