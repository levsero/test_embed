import { UPDATE_ACTIVE_EMBED } from '../base-action-types'
import { ZOPIM_SHOW } from 'src/redux/modules/zopimChat/zopimChat-action-types'

const initialState = ''

const activeEmbed = (state = initialState, action) => {
  const { type, payload } = action

  switch (type) {
    case UPDATE_ACTIVE_EMBED:
      return payload
    case ZOPIM_SHOW:
      return 'zopimChat'
    default:
      return state
  }
}

export default activeEmbed
