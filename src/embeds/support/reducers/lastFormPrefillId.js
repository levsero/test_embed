import { FORM_PREFILLED } from 'embeds/support/actions/action-types'

const lastFormPrefillId = (state = {}, action) => {
  switch (action.type) {
    case FORM_PREFILLED:
      return {
        ...state,
        [action.payload.formId]: action.payload.prefillId
      }
    default:
      return state
  }
}

export default lastFormPrefillId
