import { testReducer } from 'classicSrc/util/testHelpers'
import { UPDATE_QUEUE, REMOVE_FROM_QUEUE } from '../../base-action-types'
import queue from '../base-queue'

testReducer(queue, [
  {
    action: { type: undefined },
    expected: {},
  },
  {
    action: { type: 'DERP DERP' },
    initialState: { x: 1 },
    expected: { x: 1 },
  },
  {
    action: { type: UPDATE_QUEUE, payload: { x: ['a', 'b'] } },
    expected: { x: ['a', 'b'] },
  },
  {
    action: { type: UPDATE_QUEUE, payload: { x: ['a', 'b'] } },
    initialState: { y: ['o'] },
    expected: { x: ['a', 'b'], y: ['o'] },
  },
  {
    action: { type: REMOVE_FROM_QUEUE, payload: 'y' },
    initialState: { y: ['o'], z: ['o'] },
    expected: { z: ['o'] },
  },
])
