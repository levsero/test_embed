import { UPDATE_SETTINGS } from 'classicSrc/redux/modules/settings/settings-action-types'
import { testReducer } from 'classicSrc/util/testHelpers'
import reducer from '../formsWithSuppressedSubject'

const initialState = []

testReducer(reducer, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: initialState,
  },
  {
    extraDesc: 'only collects proper IDs where the subject has been suppressed properly',
    initialState,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [
              { id: 123, subject: false },
              { xid: 456, subject: false },
              { id: 789, subject: null },
              { id: 789, subject: null },
              { id: 666, subject: false },
              { id: 234, subject: undefined },
              { id: 567, subject: 123 },
            ],
          },
        },
      },
    },
    expected: [123, 666],
  },
])
