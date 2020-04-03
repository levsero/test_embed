import { QUESTION_VALUE_CHANGED } from './action-types'

export const questionValueChanged = message => {
  return {
    type: QUESTION_VALUE_CHANGED,
    payload: message
  }
}
