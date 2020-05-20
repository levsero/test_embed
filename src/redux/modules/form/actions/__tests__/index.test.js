import { clearFormState, clearAllForms, setFormState } from '../index'
import {
  CLEARED_FORM_STATE,
  ALL_FORMS_CLEARED,
  SET_FORM_STATE
} from 'src/redux/modules/form/action-types'

describe('form actions', () => {
  describe('clearFormState', () => {
    it('returns an action to clear a specific form state', () => {
      expect(clearFormState('form id')).toEqual({
        type: CLEARED_FORM_STATE,
        payload: {
          formId: 'form id'
        }
      })
    })
  })

  describe('clearFormStates', () => {
    it('returns an action to clear all form states', () => {
      expect(clearAllForms()).toEqual({
        type: ALL_FORMS_CLEARED
      })
    })
  })

  describe('setFormState', () => {
    it('returns an action to set the values for the specific form', () => {
      expect(setFormState('form id', { name: 'some name' })).toEqual({
        type: SET_FORM_STATE,
        payload: {
          formId: 'form id',
          newFormState: {
            name: 'some name'
          }
        }
      })
    })
  })
})
