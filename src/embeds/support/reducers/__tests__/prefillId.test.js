import { testReducer } from 'src/util/testHelpers'
import { handlePrefillReceived } from 'src/redux/modules/base'
import prefillId from '../prefillId'
import { updateSettings } from 'src/redux/modules/settings'
import { UPDATE_SETTINGS } from 'src/redux/modules/settings/settings-action-types'
import { LOCALE_SET } from 'src/redux/modules/base/base-action-types'

const mockDateNow = 1479427200000
const mockDateSpy = jest.spyOn(Date, 'now').mockImplementation(() => mockDateNow)

const initialState = 0

testReducer(prefillId, [
  {
    initialState: 0,
    action: { type: undefined },
    expected: initialState
  },
  {
    initialState: 1,
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com'
      }
    }),
    expected: 2
  },
  {
    initialState: 1,
    action: {
      type: LOCALE_SET
    },
    expected: 2
  },
  {
    extraDesc: 'Update settings includes changes to ticket forms',
    initialState: 1,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            ticketForms: [{}]
          }
        }
      }
    },
    expected: 2
  },
  {
    extraDesc: 'Update settings includes changes to ticket fields',
    initialState: 1,
    action: {
      type: UPDATE_SETTINGS,
      payload: {
        webWidget: {
          contactForm: {
            fields: [{}]
          }
        }
      }
    },
    expected: 2
  },
  {
    extraDesc: 'Update settings does not include changes to ticket forms or ticket fields',
    initialState: 1,
    action: updateSettings({
      webWidget: {
        contactForm: {}
      }
    }),
    expected: 1
  }
])

mockDateSpy.mockRestore()
