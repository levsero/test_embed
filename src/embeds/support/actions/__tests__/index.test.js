import * as actions from '../index'
import * as actionTypes from '../action-types'

describe('submitForm', () => {
  it('returns the expected value', () => {
    const expected = {
      type: actionTypes.SUBMITTED_FORM,
      payload: { state: 'blap' }
    }

    expect(actions.submitForm('blap')).toEqual(expected)
  })
})

describe('setActiveFormName', () => {
  it('returns the expected value', () => {
    const expected = {
      type: actionTypes.SET_ACTIVE_FORM_NAME,
      payload: { name: 'blap' }
    }

    expect(actions.setActiveFormName('blap')).toEqual(expected)
  })
})

describe('setFormState', () => {
  it('returns the expected value', () => {
    const expected = {
      type: actionTypes.SET_FORM_STATE,
      payload: { name: 'hello', newFormState: { fieldA: 'friend' } }
    }

    expect(actions.setFormState('hello', { fieldA: 'friend' })).toEqual(expected)
  })
})

describe('clearFormState', () => {
  it('return the expected type', () => {
    expect(actions.clearFormState('boop')).toEqual({
      type: actionTypes.CLEARED_FORM_STATE,
      payload: { name: 'boop' }
    })
  })
})

describe('clearFormStates', () => {
  it('return the expected type', () => {
    expect(actions.clearFormStates()).toEqual({ type: actionTypes.CLEARED_FORM_STATES })
  })
})
