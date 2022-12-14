import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'

const initialState = []

const filteredFormsToDisplay = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      const ticketForms = action.payload?.webWidget?.contactForm?.ticketForms

      if (ticketForms !== undefined && Array.isArray(ticketForms)) {
        return ticketForms
          .map((form) => {
            return parseInt(form?.id, 10)
          })
          .filter(Boolean)
      }

      return state
    }
    default:
      return state
  }
}

export default filteredFormsToDisplay
