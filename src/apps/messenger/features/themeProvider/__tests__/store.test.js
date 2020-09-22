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
        primary: DEFAULT_THEME.palette.kale[600],
        primaryText: DEFAULT_THEME.palette.white,
        message: DEFAULT_THEME.palette.kale[700],
        messageText: DEFAULT_THEME.palette.white,
        action: DEFAULT_THEME.palette.mint[400],
        actionText: DEFAULT_THEME.palette.grey[800],
        otherParticipantMessage: '#f4f6f8',
        otherParticipantMessageText: DEFAULT_THEME.palette.grey[800],
        otherParticipantMessageBorder: DEFAULT_THEME.palette.grey[200]
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
        primaryText: DEFAULT_THEME.palette.grey[800],
        message: 'blue',
        messageText: DEFAULT_THEME.palette.white,
        action: 'green',
        actionText: DEFAULT_THEME.palette.white,
        otherParticipantMessage: '#f4f6f8',
        otherParticipantMessageText: DEFAULT_THEME.palette.grey[800],
        otherParticipantMessageBorder: DEFAULT_THEME.palette.grey[200]
      },
      position: 'right'
    }
  },
  {
    extraDesc: 'partial color override from config',
    initialState: store(undefined, {}),
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
        primary: 'red',
        primaryText: DEFAULT_THEME.palette.grey[800],
        message: 'blue',
        messageText: DEFAULT_THEME.palette.white,
        action: DEFAULT_THEME.palette.mint[400],
        actionText: DEFAULT_THEME.palette.grey[800],
        otherParticipantMessage: '#f4f6f8',
        otherParticipantMessageText: DEFAULT_THEME.palette.grey[800],
        otherParticipantMessageBorder: DEFAULT_THEME.palette.grey[200]
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
