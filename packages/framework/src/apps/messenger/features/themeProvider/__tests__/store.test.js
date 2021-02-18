import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import store, { getMessengerColors } from '../store'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

testReducer(store, [
  {
    action: {
      type: 'some_nonsense_action',
    },
    expected: {
      colors: {},
      position: 'right',
      zIndex: 999999,
    },
  },
  {
    action: {
      type: messengerConfigReceived.type,
      payload: {
        color: {
          primary: 'red',
          message: 'blue',
          action: 'green',
        },
      },
    },
    expected: {
      colors: {
        primary: 'red',
        message: 'blue',
        action: 'green',
      },
      position: 'right',
      zIndex: 999999,
    },
  },
  {
    extraDesc: 'partial color override from config',
    initialState: store(undefined, {}),
    action: {
      type: messengerConfigReceived.type,
      payload: {
        color: {
          primary: 'red',
          message: 'blue',
        },
      },
    },
    expected: {
      colors: {
        primary: 'red',
        message: 'blue',
      },
      position: 'right',
      zIndex: 999999,
    },
  },
])

describe('getMessengerColors', () => {
  it('returns the messengerColors value of state', () => {
    expect(
      getMessengerColors({
        theme: {
          colors: {
            some: 'color',
          },
          someOtherState: 'some other object',
        },
      })
    ).toEqual({ some: 'color' })
  })
})
