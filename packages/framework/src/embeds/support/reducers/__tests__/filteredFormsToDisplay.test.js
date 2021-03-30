import reducer from '../filteredFormsToDisplay'
import { testReducer } from 'utility/testHelpers'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = []

testReducer(reducer, [
  {
    initialState: [],
    action: { type: undefined },
    expected: initialState,
  },
  {
    extraDesc: 'it collects the IDs of the forms to display specified via the API',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: 123 }, { id: 666 }],
          },
        },
      },
    },
    expected: [123, 666],
  },
  {
    extraDesc: 'it coerces IDs to integers if given a single ID that is a string',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: '123' }],
          },
        },
      },
    },
    expected: [123],
  },
  {
    extraDesc: 'it coerces all IDs to integers if given a mix of integers and strings',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: '123' }, { id: 666 }, { id: '2749314' }],
          },
        },
      },
    },
    expected: [123, 666, 2749314],
  },
  {
    extraDesc: 'it ignores IDs that cannot be coerced to integers',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: '123' }, { id: 666 }, { id: 'abc' }, { id: true }],
          },
        },
      },
    },
    expected: [123, 666],
  },
  {
    extraDesc: 'it ignores elements that have no ID key',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{ id: '123' }, { id: 666 }, { derp: 456 }],
          },
        },
      },
    },
    expected: [123, 666],
  },
  {
    extraDesc: 'it does not update when there are no ticket forms in the payload',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: [{ id: 123 }, { id: 666 }],
        },
      },
    },
    expected: initialState,
  },
  {
    extraDesc: 'it does not update when ticket forms are not in an array',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: { id: '123' },
          },
        },
      },
    },
    expected: initialState,
  },
])
