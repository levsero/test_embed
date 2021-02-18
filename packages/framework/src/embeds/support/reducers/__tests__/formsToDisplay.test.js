import reducer from '../filteredFormsToDisplay'
import { testReducer } from 'utility/testHelpers'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = []

testReducer(reducer, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    extraDesc: 'add new forms',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: 123 }, { id: 456 }],
          },
        },
      },
    },
    expected: [123, 456],
  },
  {
    extraDesc: 'clear forms',
    initialState: [123],
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [],
          },
        },
      },
    },
    expected: [],
  },
  {
    extraDesc: 'ignore irrelevant update settings',
    initialState: [123],
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {},
      },
    },
    expected: [123],
  },
])
