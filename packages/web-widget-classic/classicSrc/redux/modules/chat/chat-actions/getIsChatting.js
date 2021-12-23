import { getZChatVendor } from 'classicSrc/embeds/chat/selectors'
import { updateActiveEmbed } from 'classicSrc/redux/modules/base'
import { IS_CHATTING } from 'classicSrc/redux/modules/chat/chat-action-types'
import {
  chatWindowOpenOnNavigate,
  chatDropped,
} from 'classicSrc/redux/modules/chat/chat-actions/actions'
import _ from 'lodash'
import { persistence as store, isMobileBrowser } from '@zendesk/widget-shared-services'

const showOnLoad = _.get(store.get('store'), 'widgetShown')
const storedActiveEmbed = _.get(store.get('store'), 'activeEmbed')

export function getIsChatting() {
  return (dispatch, getState) => {
    const zChat = getZChatVendor(getState())
    const isChatting = zChat.isChatting()
    const storedIsChatting = _.get(store.get('store'), 'is_chatting')

    dispatch({
      type: IS_CHATTING,
      payload: isChatting,
    })

    if (isChatting) {
      let activeEmbed = storedActiveEmbed

      if (activeEmbed) {
        dispatch(updateActiveEmbed(activeEmbed))
      }

      if (showOnLoad && !isMobileBrowser()) {
        dispatch(chatWindowOpenOnNavigate())
      }
    } else if (storedIsChatting) {
      dispatch(chatDropped())
    }
  }
}
