import { testReducer } from 'src/util/testHelpers'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import prefillSpecificFormValues from 'embeds/support/reducers/prefillSpecificFormValues'
import { API_RESET_WIDGET } from 'src/redux/modules/base/base-action-types'

const initialState = {}

testReducer(prefillSpecificFormValues, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState
  },
  {
    extraDesc: 'Values are extracted out to be nested under locale rather than field',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [
              {
                id: '123',
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
              },
              {
                id: '456',
                fields: [
                  {
                    id: 'name',
                    prefill: {
                      '*': 'Name',
                      'en-au': 'Australian name'
                    }
                  },
                  {
                    id: 'description',
                    prefill: {
                      '*': 'Description',
                      'en-au': 'Australian description'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    },
    expected: {
      123: {
        '*': {
          email: 'email@example.com',
          name: 'Name'
        },
        fr: {
          email: 'french-email@example.com',
          name: 'French name'
        }
      },
      456: {
        '*': {
          name: 'Name',
          description: 'Description'
        },
        'en-au': {
          name: 'Australian name',
          description: 'Australian description'
        }
      }
    }
  },
  {
    action: { type: API_RESET_WIDGET },
    expected: {},
    initialState
  }
])
