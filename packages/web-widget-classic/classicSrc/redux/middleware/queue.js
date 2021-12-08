import { performContextualSearch } from 'classicSrc/embeds/helpCenter/actions'
import { removeFromQueue } from 'classicSrc/redux/modules/base'
import { AUTHENTICATION_SUCCESS } from 'classicSrc/redux/modules/base/base-action-types'
import { getQueue } from 'classicSrc/redux/modules/base/base-selectors'

const onAuthenticationSuccess = (nextState, action, dispatch) => {
  if (action.type === AUTHENTICATION_SUCCESS) {
    const queue = getQueue(nextState)

    if (queue.performContextualSearch) {
      dispatch(performContextualSearch(...queue.performContextualSearch))
      dispatch(removeFromQueue('performContextualSearch'))
    }
  }
}

export default function queueCalls(prevState, nextState, action, dispatch = () => {}) {
  onAuthenticationSuccess(nextState, action, dispatch)
}
