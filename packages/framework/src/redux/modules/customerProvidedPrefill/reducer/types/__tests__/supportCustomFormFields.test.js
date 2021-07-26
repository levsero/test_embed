import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { testReducer } from 'src/util/testHelpers'
import supportCustomFormFields from '../supportCustomFormFields'

const initialState = {
  values: {},
  timestamp: 0,
}

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(12345)
})

testReducer(supportCustomFormFields, [
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
            ticketForms: [
              {
                id: 123,
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
            ],
          },
        },
      },
    },
    expected: {
      timestamp: 12345,
      values: {
        123: {
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
  },
])
