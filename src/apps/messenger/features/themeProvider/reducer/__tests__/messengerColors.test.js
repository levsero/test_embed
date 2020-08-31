import { testReducer } from 'src/util/testHelpers'
import messengerColors, { getMessengerColors } from '../messengerColors'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { configReceived } from 'src/apps/messenger/store/actions'

testReducer(messengerColors, [
  {
    action: {
      type: 'some_nonsense_action'
    },
    expected: {
      brandColor: '#17494D',
      brandTextColor: DEFAULT_THEME.palette.grey['200'],
      conversationColor: '#00363D',
      conversationTextColor: DEFAULT_THEME.palette.grey['200'],
      actionColor: '#17494D',
      actionTextColor: DEFAULT_THEME.palette.grey['200'],
      brandMessageColor: '#f4f6f8',
      brandMessageTextColor: DEFAULT_THEME.palette.grey['800'],
      messageBorder: DEFAULT_THEME.palette.grey['200']
    }
  },
  {
    action: {
      type: configReceived.type,
      payload: {
        brandColor: 'red',
        messageColor: 'blue',
        actionColor: 'green'
      }
    },
    expected: {
      brandColor: 'red',
      brandTextColor: DEFAULT_THEME.palette.grey['200'],
      conversationColor: 'blue',
      conversationTextColor: DEFAULT_THEME.palette.grey['200'],
      actionColor: 'green',
      actionTextColor: DEFAULT_THEME.palette.grey['200'],
      brandMessageColor: '#f4f6f8',
      brandMessageTextColor: DEFAULT_THEME.palette.grey['800'],
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
