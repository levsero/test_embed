import reducer from '../filteredFormsToDisplay'
import { testReducer } from 'utility/testHelpers'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = []

testReducer(reducer, [
  {
    initialState: [],
    action: { type: undefined },
    expected: initialState
  },
  {
    extraDesc: 'it collects the IDs of the forms to display specified via the API',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: 123 }, { id: 666 }]
          }
        }
      }
    },
    expected: [123, 666]
  },
  {
    extraDesc: 'it coerces IDs to integers if given a single ID that is a string',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: '123' }]
          }
        }
      }
    },
    expected: [123]
  },
  {
    extraDesc: 'it coerces all IDs to integers if given a mix of integers and strings',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: '123' }, { id: 666 }, { id: '2749314' }]
          }
        }
      }
    },
    expected: [123, 666, 2749314]
  }
])
