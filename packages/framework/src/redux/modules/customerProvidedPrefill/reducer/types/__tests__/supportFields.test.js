import { testReducer } from 'utility/testHelpers'
import supportFields from '../supportFields'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'

const initialState = {
  values: {},
  timestamp: 0,
}

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(12345)
})

testReducer(supportFields, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            fields: [
              {
                id: 'name',
                prefill: {
                  '*': 'Fallback name',
                },
              },
              {
                id: 'description',
                prefill: {
                  '*': 'Fallback description',
                  fr: 'French description',
                },
              },
            ],
          },
        },
      },
    },
    expected: {
      timestamp: 12345,
      values: {
        '*': {
          name: 'Fallback name',
          description: 'Fallback description',
        },
        fr: {
          description: 'French description',
        },
      },
    },
  },
])
