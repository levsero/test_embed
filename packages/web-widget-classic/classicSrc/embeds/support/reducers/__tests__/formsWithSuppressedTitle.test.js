import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import reducer from '../formsWithSuppressedTitle'

const initialState = []

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
              { id: 123, title: false },
              { xid: 456, title: false },
              { id: 789, title: null },
              { id: 666, title: false },
              { id: 234, title: undefined },
              { id: 567, title: 123 },
            ],
          },
        },
      },
    },
    expected: [123, 666],
  },
])
