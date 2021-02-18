import { testReducer } from 'src/util/testHelpers'
import fields from '../fields'
import { TICKET_FORMS_REQUEST_SUCCESS } from 'embeds/support/actions/action-types'

const initialState = {}

testReducer(fields, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState,
    action: {
      type: TICKET_FORMS_REQUEST_SUCCESS,
      payload: {
        ticket_fields: [
          {
            id: 1,
            name: 'One',
          },
          {
            id: 2,
            name: 'Two',
          },
        ],
      },
    },
    expected: {
      1: {
        id: 1,
        name: 'One',
      },
      2: {
        id: 2,
        name: 'Two',
      },
    },
  },
  {
    initialState: {
      1: {
        id: 1,
        name: 'One',
      },
      2: {
        id: 2,
        name: 'Two',
      },
    },
    action: {
      type: TICKET_FORMS_REQUEST_SUCCESS,
      payload: {
        ticket_fields: [
          {
            id: 3,
            name: 'Three',
          },
          {
            id: 4,
            name: 'Four',
          },
        ],
      },
    },
    expected: {
      1: {
        id: 1,
        name: 'One',
      },
      2: {
        id: 2,
        name: 'Two',
      },
      3: {
        id: 3,
        name: 'Three',
      },
      4: {
        id: 4,
        name: 'Four',
      },
    },
  },
])
