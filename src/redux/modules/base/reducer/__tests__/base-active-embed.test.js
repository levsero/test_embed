import baseActiveEmbed from '../base-active-embed'
import { UPDATE_ACTIVE_EMBED } from '../../base-action-types'
import { ZOPIM_SHOW } from 'src/redux/modules/zopimChat/zopimChat-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(baseActiveEmbed, [
  {
    action: { type: undefined },
    expected: ''
  },
  {
    action: { type: 'DERP DERP' },
    initialState: 'ab',
    expected: 'ab'
  },
  {
    action: { type: ZOPIM_SHOW },
    expected: 'zopimChat'
  },
  {
    action: { type: UPDATE_ACTIVE_EMBED, payload: 'ticketSubmissionForm' },
    expected: 'ticketSubmissionForm'
  }
])
