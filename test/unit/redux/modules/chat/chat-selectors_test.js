import Map from 'core-js/library/es6/map';

describe('chat selectors', () => {
  let getActiveAgents,
    getAttachmentsEnabled,
    getCurrentConcierges,
    getConnection,
    getCurrentMessage,
    getChatEvents,
    getChatMessages,
    getChatMessagesByAgent,
    getChatNotification,
    getChatOnline,
    getChatRating,
    getChatScreen,
    getChatStatus,
    getChatVisitor,
    getGroupedChatLog,
    getIsChatting,
    getNotificationCount,
    getPostchatFormSettings,
    getPrechatFormSettings,
    getPrechatFormFields,
    getRatingSettings,
    getUserSoundSettings,
    getEmailTranscript,
    getShowRatingScreen,
    getThemeShowAvatar,
    getLastAgentLeaveEvent,
    getOfflineFormFields,
    getOfflineFormSettings,
    getChatOfflineForm,
    getShowOfflineChat,
    getPreChatFormState,
    getQueuePosition,
    getEditContactDetails,
    getOfflineMessage,
    getMenuVisible,
    getShowMenu,
    getOperatingHours,
    getGroupedOperatingHours,
    getLoginSettings,
    getDepartments,
    getDepartmentsList,
    getIsProactiveSession,
    getStandaloneMobileNotificationVisible,
    getAgentsTyping,
    getAllAgents,
    getFirstMessageTimestamp,
    getCurrentSessionStartTime,
    getSocialLogin,
    getAuthUrls,
    getIsAuthenticated,
    CHATTING_SCREEN,
    CHAT_MESSAGE_EVENTS,
    CHAT_SYSTEM_EVENTS,
    EDIT_CONTACT_DETAILS_SCREEN,
    DEPARTMENT_STATUSES,
    WHITELISTED_SOCIAL_LOGINS,
    AGENT_BOT;

  beforeEach(() => {
    mockery.enable();

    const chatConstantsPath = basePath('src/constants/chat');

    CHAT_SYSTEM_EVENTS = requireUncached(chatConstantsPath).CHAT_SYSTEM_EVENTS;
    EDIT_CONTACT_DETAILS_SCREEN = requireUncached(chatConstantsPath).EDIT_CONTACT_DETAILS_SCREEN;
    CHAT_MESSAGE_EVENTS = requireUncached(chatConstantsPath).CHAT_MESSAGE_EVENTS;
    AGENT_BOT = requireUncached(chatConstantsPath).AGENT_BOT;
    DEPARTMENT_STATUSES = requireUncached(chatConstantsPath).DEPARTMENT_STATUSES;
    WHITELISTED_SOCIAL_LOGINS = requireUncached(chatConstantsPath).WHITELISTED_SOCIAL_LOGINS;
    CHATTING_SCREEN = 'chatlog';

    initMockRegistry({
      'constants/chat': {
        CHAT_MESSAGE_EVENTS,
        CHAT_SYSTEM_EVENTS,
        EDIT_CONTACT_DETAILS_SCREEN,
        AGENT_BOT,
        DEPARTMENT_STATUSES,
        WHITELISTED_SOCIAL_LOGINS
      },
      './chat-screen-types': {
        CHATTING_SCREEN
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: (state) => state.base.embed
      },
      'src/redux/modules/settings/settings-selectors': {
        getSettingsChatDepartmentsEnabled: (state) => _.get(state, 'settings.chat.departments.enabled', []),
        getSettingsChatDepartment: (state) => _.get(state, 'settings.chat.department', '')
      },
      'service/i18n': {
        i18n: { t: _.identity }
      },
      'chat-web-sdk': {
        getAuthLoginUrl: (socialMedia) => `www.foo.com/${socialMedia}/bar-baz`
      }
    });

    const chatSelectorsPath = buildSrcPath('redux/modules/chat/chat-selectors');

    mockery.registerAllowable(chatSelectorsPath);
    const selectors = requireUncached(chatSelectorsPath);

    getActiveAgents = selectors.getActiveAgents;
    getAttachmentsEnabled = selectors.getAttachmentsEnabled;
    getCurrentConcierges = selectors.getCurrentConcierges;
    getConnection = selectors.getConnection;
    getCurrentMessage = selectors.getCurrentMessage;
    getChatEvents = selectors.getChatEvents;
    getChatMessages = selectors.getChatMessages;
    getChatMessagesByAgent = selectors.getChatMessagesByAgent;
    getChatNotification = selectors.getChatNotification;
    getChatOnline = selectors.getChatOnline;
    getChatRating = selectors.getChatRating;
    getChatScreen = selectors.getChatScreen;
    getChatStatus = selectors.getChatStatus;
    getChatVisitor = selectors.getChatVisitor;
    getGroupedChatLog = selectors.getGroupedChatLog;
    getIsChatting = selectors.getIsChatting;
    getNotificationCount = selectors.getNotificationCount;
    getPostchatFormSettings = selectors.getPostchatFormSettings;
    getPrechatFormFields = selectors.getPrechatFormFields;
    getPrechatFormSettings = selectors.getPrechatFormSettings;
    getRatingSettings = selectors.getRatingSettings;
    getUserSoundSettings = selectors.getUserSoundSettings;
    getEmailTranscript = selectors.getEmailTranscript;
    getShowRatingScreen = selectors.getShowRatingScreen;
    getLastAgentLeaveEvent = selectors.getLastAgentLeaveEvent;
    getThemeShowAvatar = selectors.getThemeShowAvatar;
    getOfflineFormFields = selectors.getOfflineFormFields;
    getOfflineFormSettings = selectors.getOfflineFormSettings;
    getChatOfflineForm = selectors.getChatOfflineForm;
    getShowOfflineChat = selectors.getShowOfflineChat;
    getPreChatFormState = selectors.getPreChatFormState;
    getQueuePosition = selectors.getQueuePosition;
    getEditContactDetails = selectors.getEditContactDetails;
    getOperatingHours = selectors.getOperatingHours;
    getGroupedOperatingHours = selectors.getGroupedOperatingHours;
    getOfflineMessage = selectors.getOfflineMessage;
    getMenuVisible = selectors.getMenuVisible;
    getShowMenu = selectors.getShowMenu;
    getLoginSettings = selectors.getLoginSettings;
    getDepartments = selectors.getDepartments;
    getDepartmentsList = selectors.getDepartmentsList;
    getIsProactiveSession = selectors.getIsProactiveSession;
    getStandaloneMobileNotificationVisible = selectors.getStandaloneMobileNotificationVisible;
    getAgentsTyping = selectors.getAgentsTyping;
    getAllAgents = selectors.getAllAgents;
    getFirstMessageTimestamp = selectors.getFirstMessageTimestamp;
    getCurrentSessionStartTime = selectors.getCurrentSessionStartTime;
    getSocialLogin = selectors.getSocialLogin;
    getAuthUrls = selectors.getAuthUrls;
    getIsAuthenticated = selectors.getIsAuthenticated;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('getCurrentSessionStartTime', () => {
    let mockCurrentSessionStartTime,
      result;

    beforeEach(() => {
      mockCurrentSessionStartTime = 123;
      result = getCurrentSessionStartTime({
        chat: {
          currentSessionStartTime: mockCurrentSessionStartTime
        }
      });
    });

    it('returns the current session start time', () => {
      expect(result)
        .toEqual(123);
    });
  });

  describe('getDepartments', () => {
    let mockDepartments,
      result;

    beforeEach(() => {
      mockDepartments = {
        someDepartment: {
          status: 'online'
        }
      };

      result = getDepartments({
        chat: {
          departments: mockDepartments
        }
      });
    });

    it('returns the departments', () => {
      expect(result)
        .toEqual(mockDepartments);
    });
  });

  describe('getDepartmentsList', () => {
    let mockDepartments,
      result;

    beforeEach(() => {
      mockDepartments = [
        { status: 'online' }
      ];

      result = getDepartmentsList({
        chat: {
          departments: mockDepartments
        }
      });
    });

    it('returns the departments', () => {
      expect(result)
        .toEqual(mockDepartments);
    });
  });

  describe('getIsAuthenticated', () => {
    let result;

    beforeEach(() => {
      result = getIsAuthenticated({
        chat: {
          isAuthenticated: true
        }
      });
    });

    it('returns if user is authenticated', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatNotification', () => {
    let result,
      mockAgents,
      mockChats,
      mockConciergeSettings;
    const mockNotification = {
      nick: 'agent:007',
      display_name: 'bond',
      msg: 'how are you',
      show: true,
      playSound: true,
      proactive: true
    };

    describe('returns an object', () => {
      beforeEach(() => {
        mockAgents = new Map([['agent:007', { avatar_path: '/path/' }]]);
        mockChats = [{ nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }];
        mockConciergeSettings = { avatar_path: '' };

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { values: () => mockChats },
            accountSettings: { concierge: mockConciergeSettings }
          }
        });
      });

      it('with the reduced notification object', () => {
        expect(result)
          .toEqual(jasmine.objectContaining({
            nick: 'agent:007',
            display_name: 'bond',
            msg: 'how are you',
            show: true,
            playSound: true,
            proactive: true
          }));
      });

      it('with the agent properties', () => {
        expect(result)
          .toEqual(jasmine.objectContaining({
            nick: 'agent:007',
            display_name: 'bond',
            msg: 'how are you',
            avatar_path: '/path/'
          }));
      });
    });

    describe('when current agent has a personal avatar path', () => {
      beforeEach(() => {
        mockAgents = new Map([['agent:007', { avatar_path: 'www.terence.com/avatar.jpeg' }]]);
        mockChats = [{ nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }];
        mockConciergeSettings = { avatar_path: 'www.zen.desk/avatar.jpeg' };

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { values: () => mockChats },
            accountSettings: { concierge: mockConciergeSettings }
          }
        });
      });

      it('returns an object with the agents personal avatar path', () => {
        expect(result.avatar_path)
          .toEqual('www.terence.com/avatar.jpeg');
      });
    });

    describe('when current agent does not have their own avatar', () => {
      beforeEach(() => {
        mockAgents = new Map([['agent:007', { avatar_path: '' }]]);
        mockChats = [{ nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }];
        mockConciergeSettings = { avatar_path: 'www.zen.desk/avatar.jpeg' };

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { values: () => mockChats },
            accountSettings: { concierge: mockConciergeSettings }
          }
        });
      });

      it('returns an object with the company\'s avatar path', () => {
        expect(result.avatar_path)
          .toEqual('www.zen.desk/avatar.jpeg');
      });
    });
  });

  describe('getPrechatFormFields', () => {
    let result;
    let mockAccountSettings = {
      prechatForm: {
        form: {
          0: { name: 'name', required: true },
          1: { name: 'email', required: true },
          2: { name: 'phone', label: 'Phone Number', required: false },
          3: { name: 'department', label: 'Department', required: true }
        }
      },
      offlineForm: {
        enabled: false
      }
    };
    let mockDepartments = [
      {
        name: 'Design',
        status: 'online',
        id: 12345
      },
      {
        name: 'Engineering',
        status: 'offline',
        id: 56789
      },
      {
        name: 'Medicine',
        status: 'online',
        id: 86734
      }
    ];
    let state;

    beforeEach(() => {
      result = getPrechatFormFields(state);
    });

    describe('enabled departments', () => {
      describe('is empty', () => {
        beforeAll(() => {
          state = {
            chat: {
              accountSettings: mockAccountSettings,
              departments: mockDepartments
            },
            settings: {
              chat: {
                departments: {
                  enabled: []
                }
              }
            }
          };
        });

        it('does not filter departments', () => {
          expect(result.departments.length)
            .toEqual(3);
        });
      });

      describe('is not empty', () => {
        describe('using ids', () => {
          beforeAll(() => {
            state = {
              chat: {
                accountSettings: mockAccountSettings,
                departments: mockDepartments
              },
              settings: {
                chat: {
                  departments: {
                    enabled:  [12345, 86734]
                  }
                }
              }
            };
          });

          it('filters departments correctly', () => {
            expect(result.departments.length)
              .toEqual(2);
            result.departments.forEach((department) => {
              expect([12345, 86734].includes(department.id))
                .toEqual(true);
            });
          });
        });

        describe('using names', () => {
          beforeAll(() => {
            state = {
              chat: {
                accountSettings: mockAccountSettings,
                departments: mockDepartments
              },
              settings: {
                chat: {
                  departments: {
                    enabled:  ['Design', 'Medicine']
                  }
                }
              }
            };
          });

          it('filters departments correctly', () => {
            expect(result.departments.length)
              .toEqual(2);
            result.departments.forEach((department) => {
              expect([12345, 86734].includes(department.id))
                .toEqual(true);
            });
          });
        });
      });
    });

    describe('standard form fields', () => {
      it('returns name field', () => {
        expect(result.name)
          .toEqual({ name: 'name', required: true });
      });

      it('returns email field', () => {
        expect(result.email)
          .toEqual({ name: 'email', required: true });
      });

      it('returns phone field', () => {
        expect(result.phone)
          .toEqual({ name: 'phone', label: 'Phone Number', required: false });
      });
    });

    describe('department dropdown field', () => {
      beforeAll(() => {
        state = {
          chat: {
            accountSettings: mockAccountSettings,
            departments: mockDepartments
          },
          settings: {
            chat: {
              departments: {
                enabled:  []
              },
              department: ''
            }
          }
        };
      });

      describe('department is offline', () => {
        it('returns department that is disabled and has correct label', () => {
          expect(result.departments[1].name)
            .toEqual('embeddable_framework.chat.department.offline.label');
          expect(result.departments[1].disabled)
            .toEqual(true);
        });

        describe('when there is an offline form', () => {
          beforeAll(() => {
            mockAccountSettings.offlineForm.enabled = true;
          });

          afterEach(() => {
            mockAccountSettings.offlineForm.enabled = false;
          });

          it('returns department that is not disabled', () => {
            expect(result.departments[1].disabled)
              .toBeUndefined();
          });
        });
      });

      describe('department is online', () => {
        describe('first department', () => {
          it('returns department with default set to true', () => {
            expect(result.departments[0].default)
              .toEqual(true);
          });
        });

        describe('not first department', () => {
          it('returns department with no default', () => {
            expect(result.departments[2].default)
              .toBeUndefined();
          });
        });

        describe('when department is not required', () => {
          beforeAll(() => {
            mockAccountSettings.prechatForm.form[3].required = false;
          });

          afterEach(() => {
            mockAccountSettings.prechatForm.form[3].required = true;
          });

          it('returns all departments with no default', () => {
            for (let i = 0; i < mockDepartments.length; i++) {
              expect(result.departments[i].default)
                .toBeUndefined();
            }
          });
        });

        describe('when a department is selected in settings', () => {
          beforeAll(() => {
            state = {
              chat: {
                accountSettings: mockAccountSettings,
                departments: mockDepartments
              },
              settings: {
                chat: {
                  department: 'Medicine'
                }
              }
            };
          });

          it('sets that department instead of the first one to enabled', () => {
            expect(result.departments[0].default)
              .toBeFalsy();

            expect(result.departments[2].default)
              .toBeTruthy();
          });
        });
      });
    });

    describe('selected department setting', () => {
      describe('is an empty string', () => {
        beforeAll(() => {
          mockAccountSettings.prechatForm.form[3].required = false;
          state = {
            chat: {
              accountSettings: mockAccountSettings,
              departments: mockDepartments
            },
            settings: {
              chat: {
                department: ''
              }
            }
          };
        });

        it('does not set a selected department', () => {
          result.departments.forEach((department) => {
            expect(department.default)
              .toBeFalsy();
          });
        });
      });

      describe('is set to a department', () => {
        beforeAll(() => {
          mockAccountSettings.prechatForm.form[3].required = false;
          state = {
            chat: {
              accountSettings: mockAccountSettings,
              departments: mockDepartments
            },
            settings: {
              chat: {
                department: 'Design'
              }
            }
          };
        });

        describe('and the department is online', () => {
          it('sets the expected department to enabled', () => {
            result.departments.forEach((department) => {
              if (department.name === 'Design') {
                expect(department.default)
                  .toEqual(true);
              } else {
                expect(department.default)
                  .toBeFalsy();
              }
            });
          });
        });

        describe('and the department is offline', () => {
          beforeAll(() => {
            state.settings.chat.department = 'Engineering';
          });

          it('does not set a selected department', () => {
            result.departments.forEach((department) => {
              expect(department.default)
                .toBeFalsy();
            });
          });
        });
      });
    });
  });

  describe('getOfflineFormFields', () => {
    let result;
    const mockAccountSettings = {
      offlineForm: {
        form: {
          0: { name: 'name', required: true },
          1: { name: 'email', required: true },
          2: { name: 'phone', label: 'Phone Number', required: true },
          3: { name: 'message', label: 'Message', required: false }
        }
      }
    };

    beforeEach(() => {
      result = getOfflineFormFields({
        chat: {
          accountSettings: mockAccountSettings
        }
      });
    });

    it('returns offline fields grouped by their name', () => {
      const expectedResult = {
        name: { name: 'name', required: true },
        email: { name: 'email', required: true },
        phone: { name: 'phone', label: 'Phone Number', required: true },
        message: { name: 'message', label: 'Message', required: false }
      };

      expect(result)
        .toEqual(expectedResult);
    });
  });

  describe('getRatingSettings', () => {
    let result;
    const ratingSettings = { enabled: true };
    const mockChatSettings = {
      chat: {
        accountSettings: {
          rating: ratingSettings
        }
      }
    };

    beforeEach(() => {
      result = getRatingSettings(mockChatSettings);
    });

    it('returns the value of accountSettings.rating', () => {
      expect(result)
        .toEqual(ratingSettings);
    });
  });

  describe('getQueuePosition', () => {
    let result;
    const queuePosition = 3;
    const mockChatSettings = {
      chat: {
        queuePosition
      }
    };

    beforeEach(() => {
      result = getQueuePosition(mockChatSettings);
    });

    it('returns the value of chat.queuePosition', () => {
      expect(result)
        .toEqual(queuePosition);
    });
  });

  describe('getPrechatFormSettings', () => {
    let result;
    const mockChatSettings = {
      chat: {
        accountSettings: {
          prechatForm: 'foo'
        }
      }
    };

    beforeEach(() => {
      result = getPrechatFormSettings(mockChatSettings);
    });

    it('returns the value of accountSettings.prechatForm', () => {
      expect(result)
        .toEqual('foo');
    });
  });

  describe('getOfflineFormSettings', () => {
    let result;
    const mockChatSettings = {
      chat: {
        accountSettings: {
          offlineForm: 'bar'
        }
      }
    };

    beforeEach(() => {
      result = getOfflineFormSettings(mockChatSettings);
    });

    it('returns the value of accountSettings.offlineForm', () => {
      expect(result)
        .toEqual('bar');
    });
  });

  describe('getIsChatting', () => {
    let result;
    const mockChatSettings = {
      chat: {
        is_chatting: true
      }
    };

    beforeEach(() => {
      result = getIsChatting(mockChatSettings);
    });

    it('returns the current state of is_chatting', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getEmailTranscript', () => {
    let result;
    const mockChatSettings = {
      chat: {
        emailTranscript: {
          status: 'some_status',
          email: 'someemail@email.com'
        }
      }
    };

    beforeEach(() => {
      result = getEmailTranscript(mockChatSettings);
    });

    it('returns the current state of emailTranscript', () => {
      expect(result)
        .toEqual({
          status: 'some_status',
          email: 'someemail@email.com'
        });
    });
  });

  describe('getChatVisitor', () => {
    let result;
    const visitor = 'Batman';
    const mockChatSettings = {
      chat: {
        visitor
      }
    };

    beforeEach(() => {
      result = getChatVisitor(mockChatSettings);
    });

    it('returns the current state of chat.visitor', () => {
      expect(result)
        .toEqual(visitor);
    });
  });

  describe('getPostchatFormSettings', () => {
    let result;
    const mockHeader = 'Nice chatting with you!';
    const mockMessage = 'How would you rate the chat experience you just had?';
    const mockAccountSettings = {
      postchatForm: {
        header: mockHeader,
        message: mockMessage
      }
    };

    beforeEach(() => {
      result = getPostchatFormSettings({
        chat: { accountSettings: mockAccountSettings }
      });
    });

    it('returns the current state of header', () => {
      expect(result.header)
        .toEqual(mockHeader);
    });

    it('returns the current state of message', () => {
      expect(result.message)
        .toEqual(mockMessage);
    });
  });

  describe('getConnection', () => {
    let result;
    const mockChatSettings = {
      chat: {
        connection: 'connected'
      }
    };

    beforeEach(() => {
      result = getConnection(mockChatSettings);
    });

    it('returns the current state of connection', () => {
      expect(result)
        .toEqual('connected');
    });
  });

  describe('getChatStatus', () => {
    let result;
    const mockChatSettings = {
      chat: {
        account_status: 'online'
      }
    };

    beforeEach(() => {
      result = getChatStatus(mockChatSettings);
    });

    it('returns the current state of account_status', () => {
      expect(result)
        .toEqual('online');
    });
  });

  describe('getUserSoundSettings', () => {
    let result;
    const mockChatSettings = {
      chat: {
        userSettings: { sound: true }
      }
    };

    beforeEach(() => {
      result = getUserSoundSettings(mockChatSettings);
    });

    it('returns the current state of is_chatting', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatMessagesByAgent', () => {
    let result;
    const mockChats = [
      { nick: 'agent:123', type: 'chat.msg' },
      { nick: 'user', type: 'chat.msg' }
    ];
    const mockChatSettings = {
      chat: {
        chats: { values: () => mockChats }
      }
    };

    beforeEach(() => {
      result = getChatMessagesByAgent(mockChatSettings);
    });

    it('returns the chats from only agents', () => {
      expect(result.length)
        .toEqual(1);

      expect(result[0].nick)
        .toEqual('agent:123');
    });
  });

  describe('getChatMessages', () => {
    let result;
    const mockChats = [
      { nick: 'visitor', type: 'chat.memberjoined' },
      { nick: 'visitor', type: 'chat.msg' },
      { nick: 'visitor', type: 'chat.file' },
      { nick: 'visitor', type: 'chat.rating' },
      { nick: 'visitor', type: 'chat.memberleave' }
    ];
    const mockChatSettings = {
      chat: {
        chats: { values: () => mockChats }
      }
    };

    beforeEach(() => {
      result = getChatMessages(mockChatSettings);
    });

    it('returns only whitelisted message types chats', () => {
      expect(result.length)
        .toEqual(2);

      expect(result[0].type)
        .toEqual('chat.msg');

      expect(result[1].type)
        .toEqual('chat.file');
    });
  });

  describe('getChatEvents', () => {
    let result;
    const mockChats = [
      { nick: 'visitor', type: 'chat.memberjoin' },
      { nick: 'visitor', type: 'chat.msg' },
      { nick: 'visitor', type: 'chat.file' },
      { nick: 'visitor', type: 'chat.rating' },
      { nick: 'visitor', type: 'chat.memberleave' }
    ];
    const mockChatSettings = {
      chat: {
        chats: { values: () => mockChats }
      }
    };

    beforeEach(() => {
      result = getChatEvents(mockChatSettings);
    });

    it('returns only whitelisted event type chats', () => {
      expect(result.length)
        .toEqual(3);

      expect(result[0].type)
        .toEqual('chat.memberjoin');

      expect(result[1].type)
        .toEqual('chat.rating');

      expect(result[2].type)
        .toEqual('chat.memberleave');
    });
  });

  describe('getGroupedChatLog', () => {
    let result,
      mockChats,
      mockChatSettings,
      expectedResult;

    const setIsFirstVisitorMessage = (array, value) => (
      Object.defineProperty(array, 'isFirstVisitorMessage', { value, enumerable: true })
    );

    describe('when passed a chat log containing valid messages and events', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Help please', timestamp: 3 },
          { nick: 'agent:123', type: 'chat.memberjoin', timestamp: 4 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Hi', timestamp: 5 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'How can I help you?', timestamp: 6 },
          { nick: 'visitor', type: 'chat.msg', msg: 'My laptop is broken', timestamp: 7 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Try turning it on and off again', timestamp: 8 },
          { nick: 'visitor', type: 'chat.msg', msg: 'That fixed it!', timestamp: 9 },
          { nick: 'visitor', type: 'chat.rating', new_rating: 'good', timestamp: 10 },
          { nick: 'visitor', type: 'chat.memberleave', timestamp: 11 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats },
            currentSessionStartTime: 1
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: setIsFirstVisitorMessage([mockChats[1], mockChats[2]], true),
          4: [mockChats[3]],
          5: [mockChats[4], mockChats[5]],
          7: [mockChats[6]],
          8: [mockChats[7]],
          9: [mockChats[8]],
          10: [{ ...mockChats[9], isLastRating: true }],
          11: [mockChats[10]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('adds sets the isFirstVisitorMessage property to true on the first group of messages made by the visitor', () => {
        const firstVisitorMsgGroup = _.find(
          result,
          (group) => group[0].type === 'chat.msg' && group[0].nick === 'visitor'
        );

        expect(firstVisitorMsgGroup.isFirstVisitorMessage)
          .toEqual(true);
      });

      it('returns chats with messages from a single user grouped under the first timestamp, and with events ungrouped', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log with many consecutive messages from either visitor or agent', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hey', timestamp: 2 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Yo', timestamp: 3 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Oi', timestamp: 4 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'What', timestamp: 5 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Calm down', timestamp: 6 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'What do you want', timestamp: 7 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          1: setIsFirstVisitorMessage([mockChats[0], mockChats[1], mockChats[2], mockChats[3]], true),
          5: [mockChats[4], mockChats[5], mockChats[6]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('parses the chat log successfully', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log which begins with an event', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: setIsFirstVisitorMessage([mockChats[1]], true)
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('parses the chat log successfully', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log which begins with a message', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 1 },
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 2 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          1: setIsFirstVisitorMessage([mockChats[0]], true),
          2: [mockChats[1]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('parses the chat log successfully', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log with non-whitelisted events or messages', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.membercartwheeled', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'visitor', type: 'chat.package', package: 'suspicious.exe', timestamp: 3 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Hey', timestamp: 4 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          2: setIsFirstVisitorMessage([mockChats[1]], true),
          4: [mockChats[3]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('filters out the invalid chats', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log with several ratings', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Hey', timestamp: 3 },
          { nick: 'visitor', type: 'chat.rating', new_rating: 'good', timestamp: 4 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Boo', timestamp: 5 },
          { nick: 'visitor', type: 'chat.rating', new_rating: 'bad', timestamp: 6 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats },
            currentSessionStartTime: 1
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: setIsFirstVisitorMessage([mockChats[1]], true),
          3: [mockChats[2]],
          4: [{ ...mockChats[3], isLastRating: false }],
          5: [mockChats[4]],
          6: [{ ...mockChats[5], isLastRating: true }]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('adds an isLastRating property to the last rating event', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log with several rating requests', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Hey', timestamp: 3 },
          { nick: 'agent:123', type: 'chat.request.rating', timestamp: 4 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Wait', timestamp: 5 },
          { nick: 'agent:123', type: 'chat.request.rating', timestamp: 6 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: setIsFirstVisitorMessage([mockChats[1]], true),
          3: [mockChats[2]],
          5: [mockChats[4]],
          6: [mockChats[5]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('filters out all except the final rating request', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });

    describe('when passed a chat log with prior sessions with rating requests', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 1 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'agent:123', type: 'chat.msg', msg: 'Hey', timestamp: 3 },
          { nick: 'visitor', type: 'chat.rating', new_rating: 'bad', timestamp: 4 },
          { nick: 'visitor', type: 'chat.memberleave', timestamp: 5 },
          { nick: 'visitor', type: 'chat.memberjoin', timestamp: 6 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats },
            currentSessionStartTime: 5
          }
        };

        expectedResult = {
          1: [mockChats[0]],
          2: setIsFirstVisitorMessage([mockChats[1]], true),
          3: [mockChats[2]],
          4: [{ ...mockChats[3], isLastRating: false }],
          5: [mockChats[4]],
          6: [mockChats[5]]
        };

        result = getGroupedChatLog(mockChatSettings);
      });

      it('invalidates isLastRating value on the previous chat session', () => {
        expect(result)
          .toEqual(expectedResult);
      });
    });
  });

  describe('getChatOnline', () => {
    let result;

    describe('when the agent is online', () => {
      beforeEach(() => {
        const mockState = {
          chat: { account_status: 'online' }
        };

        result = getChatOnline(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when the agent is away', () => {
      beforeEach(() => {
        const mockState = {
          chat: { account_status: 'away' }
        };

        result = getChatOnline(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when the agent is offline', () => {
      beforeEach(() => {
        const mockState = {
          chat: { account_status: 'offline' }
        };

        result = getChatOnline(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getChatRating', () => {
    let result;
    const mockChatSettings = {
      chat: {
        rating: 'good'
      }
    };

    beforeEach(() => {
      result = getChatRating(mockChatSettings);
    });

    it('returns the current state of rating', () => {
      expect(result)
        .toEqual('good');
    });
  });

  describe('getCurrentConcierges', () => {
    let result,
      mockChatSettings;

    beforeEach(() => {
      result = getCurrentConcierges(mockChatSettings);
    });

    describe('when there is no agent', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            agents: new Map(),
            accountSettings: { concierge: 'foo.bar' }
          }
        };
      });

      it('returns account concierge in an array', () => {
        expect(result)
          .toEqual(['foo.bar']);
      });
    });

    describe('when agent does not have custom avatar', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            agents: new Map([
              ['1', { display_name: 'hello', title: 'hello' }]
            ]),
            accountSettings: { concierge: { avatar_path: 'https://company.com/avatar.gif' } }
          }
        };
      });

      it('returns agent concierges with account avatar in an array', () => {
        expect(result)
          .toEqual([
            {
              display_name: 'hello',
              title: 'hello',
              avatar_path: 'https://company.com/avatar.gif'
            }
          ]);
      });
    });

    describe('when there are multiple agents', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            agents: new Map([
              ['1', { display_name: 'hello', title: 'hello', avatar_path: 'https://hello.com/hello.gif' }],
              ['2', { avatar_path: 'https://yolo.com/yolo.gif' }]
            ]),
            accountSettings: { concierge: { avatar_path: 'https://company.com/avatar.gif' } }
          }
        };
      });

      it('returns all agents in an array', () => {
        expect(result)
          .toEqual([
            {
              display_name: 'hello',
              title: 'hello',
              avatar_path: 'https://hello.com/hello.gif'
            },
            {
              avatar_path: 'https://yolo.com/yolo.gif'
            }
          ]);
      });
    });
  });

  describe('getActiveAgents', () => {
    let result;
    const mockChatSettings = {
      chat: {
        agents: new Map([
          ['agent:123', { nick: 'agent:123'} ],
          ['agent:trigger', { nick: 'agent:trigger'} ]
        ])
      }
    };

    beforeEach(() => {
      result = getActiveAgents(mockChatSettings);
    });

    it('returns the current state of agents with triggers filtered out', () => {
      expect(result)
        .toEqual({
          'agent:123': { nick: 'agent:123' }
        });
    });
  });

  describe('getChatScreen', () => {
    let result;
    const mockChatSettings = {
      chat: {
        screen: 'chatting'
      }
    };

    beforeEach(() => {
      result = getChatScreen(mockChatSettings);
    });

    it('returns the current state of screen', () => {
      expect(result)
        .toEqual('chatting');
    });
  });

  describe('getCurrentMessage', () => {
    let result;
    const mockChatSettings = {
      chat: {
        currentMessage: 'printer is on fire'
      }
    };

    beforeEach(() => {
      result = getCurrentMessage(mockChatSettings);
    });

    it('returns the current state of currentMessage', () => {
      expect(result)
        .toEqual('printer is on fire');
    });
  });

  describe('getAttachmentsEnabled', () => {
    let result;
    const mockEnabled = true;
    const mockChatSettings = {
      chat: {
        accountSettings: {
          attachments: {
            enabled: mockEnabled
          }
        }
      }
    };

    beforeEach(() => {
      result = getAttachmentsEnabled(mockChatSettings);
    });

    it('returns the current state of attachmentsEnabled', () => {
      expect(result)
        .toEqual(mockEnabled);
    });
  });

  describe('getNotificationCount', () => {
    let result;
    const mockChatSettings = {
      chat: {
        notification: {
          count: 123
        }
      }
    };

    beforeEach(() => {
      result = getNotificationCount(mockChatSettings);
    });

    it('returns the current state of the notification\'s count', () => {
      expect(result)
        .toEqual(123);
    });
  });

  describe('getShowRatingScreen', () => {
    let result, mockState;

    beforeEach(() => {
      mockState = {
        chat: {
          rating: {
            value: null,
            comment: null
          },
          accountSettings: {
            rating: {
              enabled: true
            }
          },
          agents: ['agent_1']
        }
      };
    });

    describe('when a rating has been submitted', () => {
      beforeEach(() => {
        mockState.chat.rating.value = 'good';
        result = getShowRatingScreen(mockState);
      });

      it('returns false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when ratings are disabled', () => {
      beforeEach(() => {
        mockState.chat.accountSettings.rating.enabled = false;
        result = getShowRatingScreen(mockState);
      });

      it('returns false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when there are no agents in the chat', () => {
      beforeEach(() => {
        mockState.chat.agents = [];
        result = getShowRatingScreen(mockState);
      });

      it('returns false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when ratings.disableEndScreen is true', () => {
      beforeEach(() => {
        mockState.chat.rating.disableEndScreen = true;
        result = getShowRatingScreen(mockState);
      });

      it('returns false', () => {
        expect(result).toBe(false);
      });
    });

    describe('when a rating has not been submitted, ratings are enabled and there are agents in the chat', () => {
      beforeEach(() => {
        result = getShowRatingScreen(mockState);
      });

      it('returns true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('getThemeShowAvatar', () => {
    let result;
    const assertState = (messageType, expectation) => {
      const mockChatSettings = {
        chat: {
          accountSettings: {
            theme: {
              message_type: messageType
            }
          }
        }
      };

      beforeEach(() => {
        result = getThemeShowAvatar(mockChatSettings);
      });

      it(`returns the ${expectation} from the current state of message_type`, () => {
        expect(result)
          .toEqual(expectation);
      });
    };

    describe('when the message_type is bubble_avatar', () => {
      const expectation = true;

      assertState('bubble_avatar', expectation);
    });

    describe('when the message_type is basic_avatar', () => {
      const expectation = true;

      assertState('basic_avatar', expectation);
    });

    describe('when the message_type is anything else', () => {
      const expectation = false;

      assertState('bubble', expectation);
    });
  });

  describe('getChatOfflineForm', () => {
    let result,
      mockChatSettings;

    beforeEach(() => {
      mockChatSettings = {
        chat: {
          formState: {
            offlineForm: {
              name: 'Sizuki',
              phone: '123456789',
              email: 'foo@bar.com',
              message: 'baz'
            }
          }
        }
      };
      result = getChatOfflineForm(mockChatSettings);
    });

    it('returns the current state of the notification\'s count', () => {
      expect(result)
        .toEqual(mockChatSettings.chat.formState.offlineForm);
    });
  });

  describe('getLastAgentLeaveEvent', () => {
    let result, mockChats, mockChatSettings;

    describe('when the chat log is empty', () => {
      beforeEach(() => {
        mockChatSettings = {
          chat: {
            chats: { values: () => [] }
          }
        };

        result = getLastAgentLeaveEvent(mockChatSettings);
      });

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when there are no leave events', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.msg', msg: 'Hello', timestamp: 2 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Help please', timestamp: 3 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        result = getLastAgentLeaveEvent(mockChatSettings);
      });

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe("when there are agent leave events but they're not the last one", () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'agent:smith', type: 'chat.memberleave', timestamp: 11 },
          { nick: 'visitor', type: 'chat.msg', msg: 'Help please', timestamp: 30 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        result = getLastAgentLeaveEvent(mockChatSettings);
      });

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe('when there are leave events by visitors', () => {
      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.msg', msg: 'Help please', timestamp: 11 },
          { nick: 'visitor', type: 'chat.memberleave', timestamp: 30 }
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        result = getLastAgentLeaveEvent(mockChatSettings);
      });

      it('returns undefined', () => {
        expect(result).toBeUndefined();
      });
    });

    describe("when there is an agent leave event as the chat's last event", () => {
      let validLeaveEvent = { nick: 'agent:smith', type: 'chat.memberleave', timestamp: 30 };

      beforeEach(() => {
        mockChats = [
          { nick: 'visitor', type: 'chat.msg', msg: 'Help please', timestamp: 11 },
          validLeaveEvent
        ];

        mockChatSettings = {
          chat: {
            chats: { values: () => mockChats }
          }
        };

        result = getLastAgentLeaveEvent(mockChatSettings);
      });

      it('returns the event', () => {
        expect(result).toEqual(validLeaveEvent);
      });
    });
  });

  describe('getShowOfflineChat', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        chat: {
          rating: {
            value: 'good',
            comment: null
          },
          accountSettings: {
            rating: {
              enabled: true
            }
          },
          is_chatting: false,
          account_status: 'offline',
          chats: { values: () => [{}, {}] },
          agents: ['agent_1']
        }
      };
    });

    describe('when chat is online', () => {
      beforeEach(() => {
        mockState.chat.account_status = 'online';
        result = getShowOfflineChat(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when isChatting is true', () => {
      beforeEach(() => {
        mockState.chat.is_chatting = true;
        result = getShowOfflineChat(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when a rating has not been left', () => {
      beforeEach(() => {
        mockState.chat.rating.value = null;
        result = getShowOfflineChat(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when chat is offline, isChatting is true and a rating has been left', () => {
      beforeEach(() => {
        result = getShowOfflineChat(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toBe(true);
      });
    });
  });

  describe('getPreChatFormState', () => {
    let result;
    const formState = 'form state';
    const mockChatSettings = {
      chat: {
        formState: {
          preChatForm: formState
        }
      }
    };

    beforeEach(() => {
      result = getPreChatFormState(mockChatSettings);
    });

    it('returns the current state of the pre chat form', () => {
      expect(result)
        .toEqual(formState);
    });
  });

  describe('getEditContactDetails', () => {
    let result,
      mockChatSettings;

    beforeEach(() => {
      mockChatSettings = {
        chat: {
          editContactDetails: {
            status: EDIT_CONTACT_DETAILS_SCREEN,
            show: true
          }
        }
      };
      result = getEditContactDetails(mockChatSettings);
    });

    it('returns the current state of the edit contact details', () => {
      expect(result)
        .toEqual(jasmine.objectContaining(mockChatSettings.chat.editContactDetails));
    });
  });

  describe('getOperatingHours', () => {
    let result;
    const operatingHoursPayload = { account_schedule: [[456]] };
    const mockOperatingHours = {
      chat: {
        operatingHours: operatingHoursPayload
      }
    };

    beforeEach(() => {
      result = getOperatingHours(mockOperatingHours);
    });

    it('returns the current state of operatingHours', () => {
      expect(result)
        .toEqual(operatingHoursPayload);
    });
  });

  describe('getGroupedOperatingHours', () => {
    let result;
    const operatingHoursPayload = {
      department_schedule: {
        123: [[456]]
      }
    };
    const mockState = {
      chat: {
        operatingHours: operatingHoursPayload,
        departments: [
          {
            name: 'Design',
            id: 123
          }
        ]
      }
    };

    beforeEach(() => {
      result = getGroupedOperatingHours(mockState);
    });

    it('returns the current state of operatingHours', () => {
      const expected = {
        department_schedule: [
          {
            name: 'Design',
            id: 123,
            0: [456]
          }
        ]
      };

      expect(result)
        .toEqual(expected);
    });
  });

  describe('getOfflineMessage', () => {
    let result,
      mockChatSettings;

    beforeEach(() => {
      mockChatSettings = {
        chat: {
          offlineMessage: {
            message: {},
            screen: 'main'
          }
        }
      };
      result = getOfflineMessage(mockChatSettings);
    });

    it('returns the current state of the offlineMessage', () => {
      expect(result)
        .toEqual(mockChatSettings.chat.offlineMessage);
    });
  });

  describe('getMenuVisible', () => {
    let result;
    const mockState = {
      chat: {
        menuVisible: true
      }
    };

    beforeEach(() => {
      result = getMenuVisible(mockState);
    });

    it('returns the current state of menuVisible', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getShowMenu', () => {
    let result;

    describe('when current chat screen is CHATTING_SCREEN', () => {
      beforeEach(() => {
        const mockState = {
          chat: {
            screen: CHATTING_SCREEN
          },
          base: {
            embed: 'chat'
          }
        };

        result = getShowMenu(mockState);
      });

      it('returns true', () => {
        expect(result)
          .toBe(true);
      });
    });

    describe('when current chat screen is not CHATTING_SCREEN', () => {
      beforeEach(() => {
        const mockState = {
          chat: {
            screen: 'not_chatting_screen'
          },
          base: {
            embed: 'chat'
          }
        };

        result = getShowMenu(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when current screen is not chat', () => {
      beforeEach(() => {
        const mockState = {
          chat: {
            screen: CHATTING_SCREEN
          },
          base: {
            embed: 'not_chat'
          }
        };

        result = getShowMenu(mockState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });
  });

  describe('getLoginSettings', () => {
    let result;
    const login = 'login_value';
    const mockState = {
      chat: {
        accountSettings: {
          login
        }
      }
    };

    beforeEach(() => {
      result = getLoginSettings(mockState);
    });

    it('returns the current state of login', () => {
      expect(result)
        .toBe(login);
    });
  });

  describe('getStandaloneMobileNotificationVisible', () => {
    let result;
    const mockState = {
      chat: {
        standaloneMobileNotificationVisible: true
      }
    };

    beforeEach(() => {
      result = getStandaloneMobileNotificationVisible(mockState);
    });

    it('retuns the current state of standaloneMobileNotificationVisible', () => {
      expect(result)
        .toBe(true);
    });
  });

  describe('getIsProactiveSession', () => {
    let result;
    let createSession = (...chats) => {
      let mockState = { chat: { chats: new Map(chats) } };

      return getIsProactiveSession(mockState);
    };

    describe('no visitor interaction', () => {
      describe('only agent messages', () => {
        beforeEach(() => {
          result = createSession([1, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }]);
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('no agent messages', () => {
        beforeEach(() => {
          result = createSession();
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('has visitor interaction', () => {
      describe('message chat type', () => {
        beforeEach(() => {
          result = createSession([1, { nick: 'visitor:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }]);
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('includes member join', () => {
        describe('followed by visitor message', () => {
          beforeEach(() => {
            result = createSession(
              [1, { nick: 'visitor:007', type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN }],
              [2, { nick: 'visitor:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
            );
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });

        describe('followed by agent message', () => {
          beforeEach(() => {
            result = createSession(
              [1, { nick: 'visitor:007', type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN }],
              [2, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
            );
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });
      });

      describe('multiple sessions', () => {
        describe('agent messages after visitor leaves', () => {
          beforeEach(() => {
            result = createSession(
              [1, { nick: 'visitor:007', type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN }],
              [2, { nick: 'visitor:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [3, { nick: 'visitor:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [4, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [5, { nick: 'visitor:007', type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE }],
              [6, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
            );
          });

          it('returns true', () => {
            expect(result)
              .toEqual(true);
          });
        });

        describe('no message after visitor leaves', () => {
          beforeEach(() => {
            result = createSession(
              [1, { nick: 'visitor:007', type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERJOIN }],
              [2, { nick: 'visitor:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [3, { nick: 'visitor:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [4, { nick: 'agent:007', type: CHAT_MESSAGE_EVENTS.CHAT_EVENT_MSG }],
              [5, { nick: 'visitor:007', type: CHAT_SYSTEM_EVENTS.CHAT_EVENT_MEMBERLEAVE }]
            );
          });

          it('returns false', () => {
            expect(result)
              .toEqual(false);
          });
        });
      });
    });
  });

  describe('getAgentsTyping', () => {
    let result,
      mockState;

    beforeEach(() => {
      result = getAgentsTyping(mockState);
    });

    describe('when the state does not contain any entries', () => {
      beforeAll(() => {
        mockState = {
          chat: {
            agents: new Map()
          }
        };
      });

      it('returns an empty array', () => {
        expect(result)
          .toEqual([]);
      });
    });

    describe('when the state contains agents that are typing', () => {
      beforeAll(() => {
        mockState = {
          chat: {
            agents: new Map([
              ['agent:123', { nick: 'agent:123', typing: true }],
              ['agent:456', { nick: 'agent:456', typing: true }],
              ['agent:789', { nick: 'agent:789', typing: false }]
            ])
          }
        };
      });

      it('returns a collection of the typing agents', () => {
        const expected = [
          { nick: 'agent:123', typing: true },
          { nick: 'agent:456', typing: true }
        ];

        expect(result)
          .toEqual(expected);
      });
    });

    describe('when the state contains a message entry from a bot', () => {
      beforeAll(() => {
        mockState = {
          chat: {
            agents: new Map([
              ['agent:456', { nick: 'agent:456', typing: true }],
              ['agent:trigger', { nick: 'agent:trigger', typing: true }]
            ])
          }
        };
      });

      it('returns a collection containing only human agents', () => {
        const expected = [{ nick: 'agent:456', typing: true }];

        expect(result)
          .toEqual(expected);
      });
    });
  });

  describe('getAllAgents', () => {
    let result,
      inactiveAgents;
    const agents = new Map([
      ['agent:terence', { display_name: 'Terence Liew' }],
      ['agent:apoorv', { display_name: 'Apoorv' }]
    ]);

    inactiveAgents = {
      'agent:sonic': { display_name: 'A. D. Ciotto' },
      'agent:bcoppard': { display_name: 'B. C.' }
    };

    const mockChatSettings = {
      chat: { agents, inactiveAgents }
    };

    beforeEach(() => {
      result = getAllAgents(mockChatSettings);
    });

    it('returns all agents in the current state', () => {
      const expected = {
        'agent:terence': { display_name: 'Terence Liew' },
        'agent:apoorv':  { display_name: 'Apoorv' },
        ...inactiveAgents
      };

      expect(result)
        .toEqual(expected);
    });
  });

  describe('getFirstMessageTimestamp', () => {
    let result,
      mockChatSettings = {
        chat: {
          chats: new Map([
            [1, { timestamp: 1 }],
            [2, { timestamp: 2 }]
          ])
        }
      };

    beforeEach(() => {
      result = getFirstMessageTimestamp(mockChatSettings);
    });

    it('returns the first chat message timestamp', () => {
      expect(result)
        .toEqual(1);
    });

    describe('no chats', () => {
      beforeEach(() => {
        result = getFirstMessageTimestamp({ chat: {chats: new Map()}});
      });

      it('returns null', () => {
        expect(result)
          .toBeNull;
      });
    });
  });

  describe('getSocialLogin', () => {
    let result,
      mockChatSettings = {
        chat: {
          socialLogin: {
            authenticated: false,
            authUrls: {},
            screen: '',
            avatarPath: ''
          }
        }
      };

    beforeEach(() => {
      result = getSocialLogin(mockChatSettings);
    });

    it('returns the current state of socialLogin', () => {
      expect(result)
        .toEqual(mockChatSettings.chat.socialLogin);
    });
  });

  describe('getAuthUrls', () => {
    let result,
      mockChatSettings;

    beforeEach(() => {
      result = getAuthUrls(mockChatSettings);
    });

    describe('when there are no enabled social media', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            isAuthenticated: true,
            accountSettings: {
              login: {
                loginTypes: {
                  facebook: true,
                  google: true
                }
              }
            }
          }
        };
      });

      it('returns an empty object', () => {
        expect(result)
          .toEqual({});
      });
    });

    describe('when the user is authenticated', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            accountSettings: {
              login: {
                loginTypes: {}
              }
            }
          }
        };
      });

      it('returns an empty object', () => {
        expect(result)
          .toEqual({});
      });
    });

    describe('when there are enabled social medias', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            accountSettings: {
              login: {
                loginTypes: {
                  facebook: true,
                  google: true
                }
              }
            }
          }
        };
      });

      it('returns an object with authentication urls bound to each social media', () => {
        const expected = {
          facebook: 'www.foo.com/facebook/bar-baz',
          google: 'www.foo.com/google/bar-baz'
        };

        expect(result)
          .toEqual(expected);
      });
    });

    describe('when there are enabled and disabled social medias', () => {
      beforeAll(() => {
        mockChatSettings = {
          chat: {
            accountSettings: {
              login: {
                loginTypes: {
                  facebook: false,
                  google: true,
                  twitter: false
                }
              }
            }
          }
        };
      });

      it('returns an object with authentication urls for enabled social medias', () => {
        const expected = { google: 'www.foo.com/google/bar-baz' };

        expect(result)
          .toEqual(expected);
      });
    });
  });
});
