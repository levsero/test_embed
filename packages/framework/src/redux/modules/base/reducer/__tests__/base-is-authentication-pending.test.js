import isAuthenticationPending from '../base-is-authentication-pending'
import {
  AUTHENTICATION_PENDING,
  AUTHENTICATION_SUCCESS,
  AUTHENTICATION_FAILURE,
  AUTHENTICATION_TOKEN_REVOKED,
  AUTHENTICATION_TOKEN_NOT_REVOKED
} from '../../base-action-types'
import { testReducer } from 'src/util/testHelpers'

testReducer(isAuthenticationPending, [
  {
    action: { type: undefined },
    expected: false
  },
  {
    action: { type: 'DERP DERP' },
    initialState: true,
    expected: true
  },
  {
    action: { type: AUTHENTICATION_PENDING },
    expected: true
  },
  {
    action: { type: AUTHENTICATION_TOKEN_REVOKED },
    initialState: true,
    expected: false
  },
  {
    action: { type: AUTHENTICATION_FAILURE },
    initialState: true,
    expected: false
  },
  {
    action: { type: AUTHENTICATION_SUCCESS },
    initialState: true,
    expected: false
  },
  {
    action: { type: AUTHENTICATION_TOKEN_REVOKED },
    initialState: true,
    expected: false
  },
  {
    action: { type: AUTHENTICATION_TOKEN_NOT_REVOKED },
    initialState: true,
    expected: false
  }
])
