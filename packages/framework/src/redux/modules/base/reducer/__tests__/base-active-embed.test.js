import baseActiveEmbed from '../base-active-embed'
import { UPDATE_ACTIVE_EMBED } from '../../base-action-types'
import { testReducer } from 'src/util/testHelpers'

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
