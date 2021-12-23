import { TICKET_FIELDS_REQUEST_SUCCESS } from 'classicSrc/embeds/support/actions/action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import contactFormFields from '../contactFormFields'

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
