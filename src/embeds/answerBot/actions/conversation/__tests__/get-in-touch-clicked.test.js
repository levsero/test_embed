import { GET_IN_TOUCH_CLICKED } from '../action-types'
import * as actions from '../get-in-touch-clicked'

test('getInTouchClicked dispatches expected payload', () => {
  expect(actions.getInTouchClicked()).toEqual({ type: GET_IN_TOUCH_CLICKED })
})
