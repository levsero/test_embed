import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import messengerColors, { getMessengerColors } from '../messengerColors'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

testReducer(messengerColors, [
  {
    action: {
      type: 'some_nonsense_action'
    },
    expected: {
      primary: '#17494D',
      primaryText: DEFAULT_THEME.palette.grey['200'],
      message: '#00363D',
      messageText: DEFAULT_THEME.palette.grey['200'],
      action: '#17494D',
      actionText: DEFAULT_THEME.palette.grey['200'],
      primaryMessage: '#f4f6f8',
      primaryMessageText: DEFAULT_THEME.palette.grey['800'],
      messageBorder: DEFAULT_THEME.palette.grey['200']
    }
  },
  {
    action: {
      type: messengerConfigReceived.type,
      payload: {
        color: {
          primary: 'red',
          message: 'blue',
          action: 'green'
        }
      }
    },
    expected: {
      primary: 'red',
      primaryText: DEFAULT_THEME.palette.grey['200'],
      message: 'blue',
      messageText: DEFAULT_THEME.palette.grey['200'],
      action: 'green',
      actionText: DEFAULT_THEME.palette.grey['200'],
      primaryMessage: '#f4f6f8',
      primaryMessageText: DEFAULT_THEME.palette.grey['800'],
      messageBorder: DEFAULT_THEME.palette.grey['200']
    }
  }
])

describe('getMessengerColors', () => {
  it('returns the messengerColors value of state', () => {
    expect(
      getMessengerColors({
        messengerColors: 'some random object',
        someOtherState: 'some other object'
      })
    ).toEqual('some random object')
  })
})
