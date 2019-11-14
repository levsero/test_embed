import {
  SUBMITTED_FORM,
  SET_ACTIVE_FORM_NAME,
  SET_FORM_STATE,
  CLEARED_FORM_STATE,
  CLEARED_FORM_STATES,
  CLEARED_ACTIVE_FORM_NAME
} from 'src/embeds/support/actions/action-types'

export const submitForm = state => ({
  type: SUBMITTED_FORM,
  payload: { state }
})

export const setActiveFormName = name => ({
  type: SET_ACTIVE_FORM_NAME,
  payload: { name }
})

export const clearActiveFormName = () => ({
  type: CLEARED_ACTIVE_FORM_NAME
})

export const setFormState = (name, newFormState) => ({
  type: SET_FORM_STATE,
  payload: { name, newFormState }
})

export const clearFormStates = () => ({ type: CLEARED_FORM_STATES })

export const clearFormState = name => ({ type: CLEARED_FORM_STATE, payload: { name } })
