import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = []

const formsWithSuppressedSubject = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS: {
      const ticketForms = action.payload?.webWidget?.contactForm?.ticketForms

      if (ticketForms !== undefined && Array.isArray(ticketForms)) {
        return ticketForms.reduce((ids, form) => {
          if (form?.id && form?.subject === false) {
            ids.push(form.id)
          }

          return ids
        }, [])
      }

      return state
    }
    default:
      return state
  }
}

export default formsWithSuppressedSubject
