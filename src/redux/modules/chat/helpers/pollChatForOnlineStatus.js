import _ from 'lodash'

import { http } from 'src/service/transport/http'
import { CHAT_POLL_INTERVAL } from 'src/constants/chat'

const pollChatForOnlineStatus = callback => {
  const isOnline = response => _.get(response, 'body.status') === 'online'

  const handleResponse = (err, res) => {
    if (err || !isOnline(res)) {
      setTimeout(() => http.getChatOnlineStatus(handleResponse), CHAT_POLL_INTERVAL)
    } else {
      callback && callback() // if we want this (probably not)?

      // call an action to do something about Chat being online
      // stuff response.body.departments into redux?
    }
  }

  http.getChatOnlineStatus(handleResponse)
}

export default pollChatForOnlineStatus
