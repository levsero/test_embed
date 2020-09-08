import { testReducer } from 'src/apps/messenger/utils/testHelpers'
import store, { getMessengerColors } from '../store'
import { DEFAULT_THEME } from '@zendeskgarden/react-theming'
import { messengerConfigReceived } from 'src/apps/messenger/store/actions'

testReducer(store, [
  {
    action: {
      type: 'some_nonsense_action'
    },
    expected: {
      colors: {
        primary: '#17494D',
        primaryText: DEFAULT_THEME.palette.grey['200'],
        message: '#00363D',
        messageText: DEFAULT_THEME.palette.grey['200'],
        action: '#17494D',
        actionText: DEFAULT_THEME.palette.grey['200'],
        primaryMessage: '#f4f6f8',
        primaryMessageText: DEFAULT_THEME.palette.grey['800'],
        messageBorder: DEFAULT_THEME.palette.grey['200']
      },
      position: 'right'
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
      colors: {
        primary: 'red',
        primaryText: DEFAULT_THEME.palette.grey['200'],
        message: 'blue',
        messageText: DEFAULT_THEME.palette.grey['200'],
        action: 'green',
        actionText: DEFAULT_THEME.palette.grey['200'],
        primaryMessage: '#f4f6f8',
        primaryMessageText: DEFAULT_THEME.palette.grey['800'],
        messageBorder: DEFAULT_THEME.palette.grey['200']
      },
      position: 'right'
    }
  },
  {
    extraDesc: 'partial color override from config',
    initialState: {
      colors: {
        action: 'purple',
        actionText: DEFAULT_THEME.palette.grey['200'],
        primary: '#17494D',
        primaryMessage: '#f4f6f8',
        primaryMessageText: DEFAULT_THEME.palette.grey['800'],
        primaryText: DEFAULT_THEME.palette.grey['200'],
        message: '#00363D',
        messageText: DEFAULT_THEME.palette.grey['200'],
        messageBorder: DEFAULT_THEME.palette.grey['200']
      },
      position: 'right'
    },
    action: {
      type: messengerConfigReceived.type,
      payload: {
        color: {
          primary: 'red',
          message: 'blue'
        }
      }
    },
    expected: {
      colors: {
        action: 'purple',
        actionText: DEFAULT_THEME.palette.grey['200'],
        primary: 'red',
        primaryMessage: '#f4f6f8',
        primaryMessageText: DEFAULT_THEME.palette.grey['800'],
        primaryText: DEFAULT_THEME.palette.grey['200'],
        message: 'blue',
        messageText: DEFAULT_THEME.palette.grey['200'],
        messageBorder: DEFAULT_THEME.palette.grey['200']
      },
      position: 'right'
    }
  }
])

describe('getMessengerColors', () => {
  it('returns the messengerColors value of state', () => {
    expect(
      getMessengerColors({
        theme: {
          colors: {
            some: 'color'
          },
          someOtherState: 'some other object'
        }
      })
    ).toEqual({ some: 'color' })
  })
})
