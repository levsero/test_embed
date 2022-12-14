import { CHATTING_SCREEN } from 'classicSrc/redux/modules/chat/chat-screen-types'
import _ from 'lodash'

const getModifiedState = (inputState) => {
  const defaultState = {
    base: {
      activeEmbed: 'chat',
      arturos: {
        chatPopout: true,
      },
      widgetShown: true,
    },
    chat: {
      accountSettings: {
        banner: {
          enabled: true,
          text: 'badgeText',
          image: 'heyLookA.img',
          layout: 'left, no right... The other left?',
        },
        chatWindow: {
          title: 'blorp',
        },
        concierge: {
          avatar_path: 'regularAvatarPath',
          display_name: 'regularName',
          title: {
            '*': 'regularTitle',
          },
        },
        login: {
          loginTypes: {
            facebook: true,
            google: true,
          },
        },
        offlineForm: {
          enabled: true,
          boop: 'boop2',
          message: 'huh...',
          form: {
            0: { name: 'name', required: true },
            2: { name: 'phone', label: 'Phone Number', required: true },
            3: { name: 'message', label: 'Message', required: false },
          },
        },
        prechatForm: {
          required: 'burp',
          greeting: 'accPrechatGreeting',
          departmentLabel: 'accPrechatDeptLabel',
          message: 'accPrechatMessage',
        },
        rating: {
          enabled: true,
        },
        theme: {
          message_type: 'basic_avatar',
        },
      },
      activeAgents: new Map([
        ['agent:mcbob', { avatar_path: 'bobPath' }],
        ['agent:trigger', {}],
      ]),
      config: {},
      departments: [
        { id: 111, name: 'burgers' },
        { id: 222, name: 'pizza' },
        { id: 333, name: 'thickshakes' },
      ],
      defaultDepartment: {
        id: 1234,
      },
      screen: CHATTING_SCREEN,
      forcedStatus: 'online',
      isAuthenticated: false,
      is_chatting: false,
      isLoggingOut: false,
      lastReadTimestamp: 0,
      notification: { nick: 'agent:mcbob' },
      rating: {
        disableEndScreen: false,
        value: null,
      },
      vendor: {
        zChat: {
          getAuthLoginUrl: (socialMedia) => `www.foo.com/${socialMedia}/bar-baz`,
        },
      },
    },
    settings: {
      chat: {
        concierge: {
          avatarPath: 'overrideAvatarPath',
          name: 'overrideName',
          title: { '*': 'overrideTitle' },
        },
        departments: {
          enabled: ['burgers', 222],
        },
        offlineForm: { greeting: { '*': 'hello fren' } },
        profileCard: {
          avatar: 'av',
          title: 'ti',
          rating: 'ra',
        },
        title: { '*': 'Hello World' },
      },
      navigation: {
        popoutButton: {
          enabled: true,
        },
      },
      launcher: {
        badge: { label: { '*': 'badgeLabel' } },
        bleep: 'blap',
      },
    },
  }

  return _.merge({}, defaultState, inputState)
}

export default getModifiedState
