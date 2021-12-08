import {
  CLEARED_FORM_STATE,
  ALL_FORMS_CLEARED,
  SET_FORM_STATE,
} from 'classicSrc/redux/modules/form/action-types'

export const setFormState = (formId, newFormState) => ({
  type: SET_FORM_STATE,
  payload: { formId, newFormState },
})

export const clearAllForms = () => ({ type: ALL_FORMS_CLEARED })

export const clearFormState = (formId) => ({
  type: CLEARED_FORM_STATE,
  payload: { formId },
})
