import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'utility/testHelpers'
import reducer from '../fieldDescriptionOverrides'

const initialState = {}

testReducer(reducer, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    extraDesc: 'only collects proper IDs where the title has been suppressed properly',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [
              {
                id: 123,
                fields: [{ id: 111, hint: { '*': 'Bonjour' } }],
              },
              {
                id: 456,
                fields: [{ hint: { '*': 'Buongiorno' } }],
              },
              {
                id: 789,
                fields: [{ id: 222, hint: 'Buen día' }],
              },
              {
                id: 234,
                fields: [{ id: 333, hint: 1337 }],
              },
              {
                id: 666,
                fields: [{ id: 444, hint: {} }],
              },
            ],
          },
        },
      },
    },
    expected: { 123: { 111: { '*': 'Bonjour' } } },
  },
])
