import createKeyID from 'classicSrc/embeds/support/utils/createKeyID'
import { handlePrefillReceived } from 'classicSrc/redux/modules/base'
import { testReducer } from 'classicSrc/util/testHelpers'
import readOnly from '../readOnly'

const initialState = {}

testReducer(readOnly, [
  {
    initialState: undefined,
    action: { type: undefined },
    expected: {},
  },
  {
    initialState,
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com',
      },
      name: {
        value: 'Some name',
        readOnly: true,
      },
    }),
    expected: {
      [createKeyID('name')]: true,
      name: true,
    },
  },
  {
    initialState: {
      [createKeyID('name')]: true,
    },
    action: handlePrefillReceived({
      email: {
        value: 'email@example.com',
        readOnly: true,
      },
      name: {
        value: 'Some name',
        readOnly: false,
      },
    }),
    expected: {
      [createKeyID('email')]: true,
      email: true,
      [createKeyID('name')]: false,
      name: false,
    },
  },
])
