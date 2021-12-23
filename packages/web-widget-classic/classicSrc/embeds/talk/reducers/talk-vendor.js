import { TALK_VENDOR_LOADED } from 'classicSrc/embeds/talk/action-types'

const initialState = {
  io: null,
}

const vendor = (state = initialState, action = {}) => {
  const { type, payload } = action

  switch (type) {
    case TALK_VENDOR_LOADED:
      return { ...state, ...payload }
    default:
      return state
  }
}

export default vendor
