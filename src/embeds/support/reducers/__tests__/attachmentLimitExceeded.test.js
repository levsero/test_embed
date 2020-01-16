import attachmentLimitExceeded from '../attachmentLimitExceeded'
import {
  ATTACHMENT_REMOVED,
  ATTACHMENTS_CLEARED,
  ATTACHMENT_LIMIT_EXCEEDED,
  CLEAR_LIMIT_EXCEEDED_ERROR
} from 'src/embeds/support/actions/action-types'
import { testReducer } from 'src/util/testHelpers'

const initialState = undefined

testReducer(attachmentLimitExceeded, [
  {
    action: { type: undefined },
    expected: false,
    initialState
  },
  {
    action: { type: ATTACHMENT_REMOVED },
    expected: false,
    initialState: true
  },
  {
    action: { type: ATTACHMENTS_CLEARED },
    expected: false,
    initialState: true
  },
  {
    action: { type: CLEAR_LIMIT_EXCEEDED_ERROR },
    expected: false,
    initialState: true
  },
  {
    action: { type: ATTACHMENT_LIMIT_EXCEEDED },
    expected: true,
    initialState: false
  }
])
