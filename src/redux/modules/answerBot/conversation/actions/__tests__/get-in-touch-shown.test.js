import { GET_IN_TOUCH_SHOWN } from '../../action-types'
import * as actions from '../get-in-touch-shown'

test('getInTouchClicked dispatches expected payload', () => {
  expect(actions.getInTouchShown()).toEqual({ type: GET_IN_TOUCH_SHOWN })
})
