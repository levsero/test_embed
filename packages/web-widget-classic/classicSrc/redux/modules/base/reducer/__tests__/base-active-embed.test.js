import { testReducer } from 'classicSrc/util/testHelpers'
import { UPDATE_ACTIVE_EMBED } from '../../base-action-types'
import baseActiveEmbed from '../base-active-embed'

testReducer(baseActiveEmbed, [
  {
    action: { type: undefined },
    expected: '',
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 'ab',
    expected: 'ab',
  },
  {
    action: { type: UPDATE_ACTIVE_EMBED, payload: 'ticketSubmissionForm' },
    expected: 'ticketSubmissionForm',
  },
])
