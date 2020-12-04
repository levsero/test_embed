import { testReducer } from 'utility/testHelpers'
import reducer from '../ticketFormsRequest'
import {
  TICKET_FORMS_REQUEST_FAILURE,
  TICKET_FORMS_REQUEST_SENT,
  TICKET_FORMS_REQUEST_SUCCESS
} from 'embeds/support/actions/action-types'

const initialState = {
  isLoading: false,
  fetchKey: null
}

testReducer(reducer, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState
  },
  {
    extraDesc: 'new forms requested',
    initialState,
    action: {
      type: TICKET_FORMS_REQUEST_SENT,
      payload: {
        fetchKey: 'en-US/123'
      }
    },
    expected: {
      isLoading: true,
      fetchKey: 'en-US/123'
    }
  },
  {
    extraDesc: 'request success',
    initialState: {
      isLoading: true,
      fetchKey: 'en-US/123'
    },
    action: {
      type: TICKET_FORMS_REQUEST_SUCCESS,
      payload: {
        fetchKey: 'en-US/123'
      }
    },
    expected: {
      isLoading: false,
      fetchKey: 'en-US/123'
    }
  },
  {
    extraDesc: 'request failed',
    initialState: {
      isLoading: true,
      fetchKey: 'en-US/123'
    },
    action: {
      type: TICKET_FORMS_REQUEST_FAILURE,
      payload: {
        fetchKey: 'en-US/123'
      }
    },
    expected: {
      isLoading: false,
      fetchKey: 'en-US/123'
    }
  },
  {
    extraDesc: 'old request status updates are ignored',
    initialState: {
      isLoading: true,
      fetchKey: 'en-US/456'
    },
    action: {
      type: TICKET_FORMS_REQUEST_FAILURE,
      payload: {
        fetchKey: 'en-US/123'
      }
    },
    expected: {
      isLoading: true,
      fetchKey: 'en-US/456'
    }
  }
])
