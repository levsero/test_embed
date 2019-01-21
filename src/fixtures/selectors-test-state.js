import _ from 'lodash';

const defaultState = {
  base: {
    activeEmbed: 'ticketSubmissionForm',
    isChatBadgeMinimized: false,
    embeddableConfig: {
      embeds: {
        zopimChat: {
          props: {
            standalone: true
          }
        },
        helpCenterForm: {
          props: {
            contextualHelpEnabled: true
          }
        },
        submitTicket: {
          ticketSubmissionForm: {
            props: {}
          }
        }
      },
      color: 'testColor',
      textColor: 'testTextColor'
    },
    embeds: {
      ipmWidget: {

      },
      chat: {},
      ticketSubmissionForm: undefined
    }
  },
  chat: {
    forcedStatus: 'offline',
    accountSettings: {
      banner: {
        enabled: true
      },
      offlineForm: {
        enabled: true
      },
      theme: {
        color: {
          primary: 'primaryThemeColor'
        }
      }
    },
    rating: {
      value: 5
    },
    agents: new Map([]),
    chatting: false,
    enabled: true,
    status: 'offline'
  },
  helpCenter: {
    contextualSearch: true,
    manualContextualSuggestions: {
    }
  },
  settings: {
    styling: {
      zIndex: -10
    },
    helpCenter: {
      suppress: false
    },
    chat: {
      suppress: false,
      enabled: true
    }
  },
  zopimChat: {
    status: 'offline'
  }
};

export const getModifiedState = (modifier = {}) => _.merge({}, defaultState, modifier);
