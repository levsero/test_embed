import { testReducer } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import prefillValues from '../prefillValues'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = {}

testReducer(prefillValues, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState
  },
  {
    extraDesc: 'Prefill values are used as fallback values',
    initialState,
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com'
      },
      name: {
        value: 'Some name',
        readOnly: true
      }
    }),
    expected: {
      '*': {
        email: 'email@example.com',
        name: 'Some name'
      }
    }
  },
  {
    extraDesc: 'Values are extracted out to be nested under locale rather than field',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            fields: [
              {
                id: 'email',
                prefill: {
                  '*': 'email@example.com',
                  fr: 'french-email@example.com'
                }
              },
              {
                id: 'name',
                prefill: {
                  '*': 'Name',
                  fr: 'French name'
                }
              }
            ]
          }
        }
      }
    },
    expected: {
      '*': {
        email: 'email@example.com',
        name: 'Name'
      },
      fr: {
        email: 'french-email@example.com',
        name: 'French name'
      }
    }
  }
])
