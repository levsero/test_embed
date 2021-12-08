import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'

const initialState = false

const ticketFormsSetViaAPI = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      const ticketForms = action.payload?.webWidget?.contactForm?.ticketForms

      if (ticketForms !== undefined && Array.isArray(ticketForms) && ticketForms.length > 0) {
        return true
      }

      return false
    }
    default:
      return state
  }
}

export default ticketFormsSetViaAPI
