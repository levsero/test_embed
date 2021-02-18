import { testReducer } from 'src/util/testHelpers'
import contactFormFields from '../contactFormFields'
import { TICKET_FIELDS_REQUEST_SUCCESS } from 'embeds/support/actions/action-types'

const initialState = []

testReducer(contactFormFields, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState,
    action: {
      type: TICKET_FIELDS_REQUEST_SUCCESS,
      payload: [
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
    expected: [
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
  {
    initialState: [
      {
        id: 1,
        name: 'One',
      },
      {
        id: 2,
        name: 'Two',
      },
    ],

    action: {
      type: TICKET_FIELDS_REQUEST_SUCCESS,
      payload: [
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
    expected: [
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
])
