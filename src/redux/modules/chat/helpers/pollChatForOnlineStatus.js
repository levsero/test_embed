import _ from 'lodash'

import { http } from 'src/service/transport/http'
import { CHAT_POLL_INTERVAL } from 'src/constants/chat'
import logger from 'utility/logger'
import { updateDeferredChatData } from 'embeds/chat/actions/connectOnPageLoad'
import { getDeferredChatApi } from 'src/redux/modules/chat/chat-selectors/selectors'

const validStatus = {
  online: true,
  away: true,
  offline: true
}

let currentSession

const getDepartments = res => {
  const departments = _.get(res, 'body.departments')
  if (departments === undefined || departments === null) {
    return []
  }

  return departments
}

const beginPolling = (dispatch, getState) => {
  if (currentSession) {
    return
  }
  const session = {
    isPolling: true
  }
  currentSession = session

  const handleResponse = (err, res) => {
    if (!session.isPolling) {
      return
    }

    if (err) {
      logger.error('Failed getting deferred chat data', err)
    } else {
      const status = _.get(res, 'body.status')
      const departments = getDepartments(res)

      if (!validStatus[status]) {
        logger.error(`Got invalid account status from deferred chat endpoint, "${status}"`)
      } else if (!Array.isArray(departments)) {
        logger.error(
          `Got invalid departments from deferred chat endpoint, expected array got "${typeof departments}"`
        )
      } else {
        const departmentsById = departments.reduce(
          (prev, next) => ({
            ...prev,
            [next.id]: next
          }),
          {}
        )
        dispatch(updateDeferredChatData(status, departmentsById))
      }
    }

    setTimeout(
      () => http.getChatOnlineStatus(getDeferredChatApi(getState()), handleResponse),
      CHAT_POLL_INTERVAL
    )
  }

  http.getChatOnlineStatus(getDeferredChatApi(getState()), handleResponse)
}

const stopPolling = () => {
  if (currentSession) {
    currentSession.isPolling = false
  } else {
    currentSession = { isPolling: false }
  }
}

export default { beginPolling, stopPolling }

export const __forTestingOnlyResetPoll = () => {
  currentSession = undefined
}
