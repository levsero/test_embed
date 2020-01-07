describe('resetActiveEmbed middleware', () => {
  let resetActiveEmbed,
    mockActiveEmbed = 'ticketSubmissionForm',
    mockChatStandalone = false,
    mockChatAvailable = false,
    mockTalkOnline = false,
    mockChannelChoiceAvailable = false,
    mockHelpCenterAvailable = false,
    mockShowTicketFormsBackButton = false,
    mockIpmHelpCenterAllowed = false,
    mockArticleViewActive = false,
    mockSubmitTicketAvailable = true,
    mockIsChatting,
    mockWidgetVisible = true,
    mockAnswerBotAvailable = false,
    mockIsPopout = true,
    mockChatBanned = false,
    mockNewSupportEmbedEnabled = false

  const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS'
  const WIDGET_INITIALISED = 'WIDGET_INITIALISED'
  const ACTIVATE_RECEIVED = 'ACTIVATE_RECEIVED'
  const TALK_AGENT_AVAILABILITY_SOCKET_EVENT = 'TALK_AGENT_AVAILABILITY_SOCKET_EVENT'
  const TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT = 'TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT'
  const SDK_CONNECTION_UPDATE = 'SDK_CONNECTION_UPDATE'
  const SDK_ACCOUNT_STATUS = 'SDK_ACCOUNT_STATUS'
  const API_RESET_WIDGET = 'API_RESET_WIDGET'
  const GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS = 'GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS'
  const UPDATE_SETTINGS = 'UPDATE_SETTINGS'
  const NIL_EMBED = 'nilEmbed'
  const updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed')
  const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility')
  const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough()
  const history = jasmine.createSpyObj('history', ['replace'])

  beforeEach(() => {
    mockery.enable()

    initMockRegistry({
      'src/redux/modules/base/base-selectors': {
        getChatStandalone: () => mockChatStandalone,
        getActiveEmbed: () => mockActiveEmbed
      },
      'src/redux/modules/selectors': {
        getChatAvailable: () => mockChatAvailable,
        getTalkOnline: () => mockTalkOnline,
        getChannelChoiceAvailable: () => mockChannelChoiceAvailable,
        getHelpCenterAvailable: () => mockHelpCenterAvailable,
        getShowTicketFormsBackButton: () => mockShowTicketFormsBackButton,
        getIpmHelpCenterAllowed: () => mockIpmHelpCenterAllowed,
        getWebWidgetVisible: () => mockWidgetVisible,
        getSubmitTicketAvailable: () => mockSubmitTicketAvailable,
        getAnswerBotAvailable: () => mockAnswerBotAvailable
      },
      'embeds/support/selectors': {
        getNewSupportEmbedEnabled: () => mockNewSupportEmbedEnabled
      },
      'embeds/helpCenter/selectors': {
        getArticleViewActive: () => mockArticleViewActive
      },
      'src/redux/modules/chat/chat-selectors': {
        getIsChatting: () => mockIsChatting,
        getChatBanned: () => mockChatBanned
      },
      'src/redux/modules/base': {
        updateActiveEmbed: updateActiveEmbedSpy,
        updateBackButtonVisibility: updateBackButtonVisibilitySpy
      },
      'src/redux/modules/base/base-action-types': {
        WIDGET_INITIALISED,
        ACTIVATE_RECEIVED,
        AUTHENTICATION_SUCCESS,
        API_RESET_WIDGET
      },
      'src/redux/modules/chat/chat-action-types': {
        SDK_CONNECTION_UPDATE,
        SDK_ACCOUNT_STATUS,
        GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS
      },
      'src/redux/modules/settings/settings-action-types': {
        UPDATE_SETTINGS
      },
      'src/redux/modules/talk/talk-action-types': {
        TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
        TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT
      },
      'service/history': history,
      'embeds/helpCenter/routes': {
        home: () => 'helpCenter/home'
      },
      'embeds/support/routes': {
        home: () => 'support/home'
      },
      'utility/globals': {
        isPopout: () => mockIsPopout
      },
      'utility/chat': {},
      'constants/chat': {},
      'constants/shared': {
        EMBED_MAP: {
          helpCenterForm: 'helpCenter',
          submitTicketForm: 'contactForm'
        },
        NIL_EMBED
      },
      'embeds/chat/actions/action-types': {}
    })

    const path = buildSrcPath('redux/middleware/resetActiveEmbed')

    resetActiveEmbed = requireUncached(path).default
  })

  afterEach(() => {
    updateActiveEmbedSpy.calls.reset()
    updateBackButtonVisibilitySpy.calls.reset()
    dispatchSpy.calls.reset()
    history.replace.calls.reset()
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('resetActiveEmbed', () => {
    const updateActions = [
      TALK_AGENT_AVAILABILITY_SOCKET_EVENT,
      TALK_EMBEDDABLE_CONFIG_SOCKET_EVENT,
      WIDGET_INITIALISED,
      ACTIVATE_RECEIVED,
      AUTHENTICATION_SUCCESS,
      API_RESET_WIDGET,
      GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS
    ]
    const chatActions = [SDK_CONNECTION_UPDATE, SDK_ACCOUNT_STATUS]
    let prevState, nextState, action

    beforeEach(() => {
      resetActiveEmbed(prevState, nextState, action, dispatchSpy)
    })

    describe('when the widget is shown', () => {
      beforeAll(() => {
        mockWidgetVisible = true
      })

      _.forEach(updateActions, actionToTest => {
        describe(`when action type is ${actionToTest}`, () => {
          beforeAll(() => {
            action = { type: actionToTest }
          })

          it('does not call updateActiveEmbed', () => {
            expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe('when the widget is not shown', () => {
      beforeAll(() => {
        mockWidgetVisible = false
      })

      describe('when action type is UPDATE_SETTINGS', () => {
        const suppressActions = {
          'contactForm.suppress': {
            webWidget: { contactForm: { suppress: true } }
          },
          'helpCenter.suppress': {
            webWidget: { helpCenter: { suppress: true } }
          },
          'chat.hideWhenOffline': {
            webWidget: { chat: { hideWhenOffline: true } }
          }
        }
        const otherSettingsActions = {
          'contactForm.blah': { webWidget: { contactForm: { blah: 111 } } },
          'helpCenter.blah': { webWidget: { helpCenter: { blah: 222 } } },
          'chat.blah': { webWidget: { chat: { blah: 333 } } }
        }

        describe('when action payload contains suppress settings', () => {
          _.forEach(suppressActions, (actionPayload, name) => {
            describe(`with suppress setting: ${name}`, () => {
              beforeAll(() => {
                action = { type: UPDATE_SETTINGS, payload: actionPayload }
              })

              it('calls updateActiveEmbed', () => {
                expect(updateActiveEmbedSpy).toHaveBeenCalled()
              })
            })
          })
        })

        describe('when action payload does not contain any suppress settings', () => {
          _.forEach(otherSettingsActions, (actionPayload, name) => {
            describe(`without a suppress setting: ${name}`, () => {
              beforeAll(() => {
                action = { type: UPDATE_SETTINGS, payload: actionPayload }
              })

              it('does not call updateActiveEmbed', () => {
                expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
              })
            })
          })
        })
      })

      _.forEach(updateActions, actionToTest => {
        describe(`when action type is ${actionToTest}`, () => {
          beforeAll(() => {
            action = { type: actionToTest }
          })

          describe('when activeEmbed is chat and isChatting is true', () => {
            beforeAll(() => {
              mockActiveEmbed = 'chat'
              mockIsChatting = true
            })

            afterAll(() => {
              mockActiveEmbed = 'ticketSubmissionForm'
              mockIsChatting = false
            })

            it('does not call updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
            })
          })

          describe('when chat is not chatting', () => {
            it('calls updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy).toHaveBeenCalled()
            })
          })
        })
      })

      _.forEach(chatActions, actionToTest => {
        describe(`when action type is ${actionToTest}`, () => {
          beforeAll(() => {
            action = { type: actionToTest }
          })

          describe('when the active embed is chat', () => {
            beforeAll(() => {
              mockActiveEmbed = 'chat'
            })

            it('calls updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy).toHaveBeenCalled()
            })
          })

          describe('when the active embed is channelChoice', () => {
            beforeAll(() => {
              mockActiveEmbed = 'channelChoice'
            })

            it('calls updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy).toHaveBeenCalled()
            })
          })

          describe('when no embed is active (eg all embeds are suppressed)', () => {
            beforeAll(() => {
              mockActiveEmbed = 'nilEmbed'
            })

            it('calls updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy).toHaveBeenCalled()
            })
          })

          describe('when the active embed is not chat or channelChoice', () => {
            beforeAll(() => {
              mockActiveEmbed = 'helpCenterForm'
            })

            it('does not call updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy).not.toHaveBeenCalled()
            })
          })
        })
      })
    })
  })

  describe('setNewActiveEmbed', () => {
    beforeEach(() => {
      mockWidgetVisible = false

      resetActiveEmbed({}, {}, { type: WIDGET_INITIALISED }, dispatchSpy)
    })

    describe('when in Popout mode', () => {
      beforeAll(() => {
        mockIsPopout = true
        resetActiveEmbed({}, {}, {})
      })

      afterAll(() => {
        mockIsPopout = false
      })

      it('calls "chat"', () => {
        expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
      })
    })

    describe('when not in Popout mode', () => {
      beforeAll(() => {
        mockIsPopout = false
        resetActiveEmbed({}, {}, {})
      })

      it('does not call "chat"', () => {
        expect(updateActiveEmbedSpy).not.toHaveBeenCalledWith('chat')
      })
    })

    describe('when answer bot is available', () => {
      beforeAll(() => {
        mockAnswerBotAvailable = true
        mockIsPopout = false
      })

      afterAll(() => {
        mockAnswerBotAvailable = false
      })

      it('calls "answerBot"', () => {
        expect(updateActiveEmbedSpy).toHaveBeenCalledWith('answerBot')
      })

      it('dispatches updateBackButtonVisibility with false', () => {
        expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(false)
      })

      describe('when the article view is active', () => {
        beforeAll(() => {
          mockArticleViewActive = true
        })

        afterAll(() => {
          mockArticleViewActive = false
        })

        it('calls updateBackButtonVisibility with true', () => {
          expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(true)
        })

        it('calls "helpCenterForm"', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('helpCenterForm')
        })
      })

      describe('when there is a chat session on going', () => {
        beforeAll(() => {
          mockIsChatting = true
        })

        afterAll(() => {
          mockIsChatting = false
        })

        it('calls "chat"', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
        })
      })
    })

    describe('when Talk is available', () => {
      beforeAll(() => {
        mockTalkOnline = true
      })

      afterAll(() => {
        mockTalkOnline = false
      })

      describe('when HelpCenter is available', () => {
        beforeAll(() => {
          mockHelpCenterAvailable = true
        })

        afterAll(() => {
          mockHelpCenterAvailable = false
        })

        it('calls updateActiveEmbed with helpCenterForm', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('helpCenterForm')
        })

        it('updates history', () => {
          expect(history.replace).toHaveBeenCalledWith('helpCenter/home')
        })

        describe('when the article view is active', () => {
          beforeAll(() => {
            mockArticleViewActive = true
          })

          it('calls updateBackButtonVisibility with true', () => {
            expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(true)
          })
        })

        describe('when the article view is not active', () => {
          beforeAll(() => {
            mockArticleViewActive = false
          })

          it('calls updateBackButtonVisibility with false', () => {
            expect(updateBackButtonVisibilitySpy).toHaveBeenCalledWith(false)
          })
        })
      })

      describe('when ChannelChoice is available', () => {
        beforeAll(() => {
          mockChannelChoiceAvailable = true
        })

        afterAll(() => {
          mockChannelChoiceAvailable = false
        })

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('channelChoice')
        })
      })

      describe('when neither HelpCenter or ChannelChoice is available', () => {
        it('calls updateActiveEmbed with talk', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('talk')
        })
      })
    })

    describe('when Talk is not available', () => {
      describe('when Chat is available', () => {
        beforeAll(() => {
          mockChatAvailable = true
        })

        afterAll(() => {
          mockChatAvailable = false
        })

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
        })
      })

      describe('when Chat is standalone and not banned', () => {
        beforeAll(() => {
          mockChatStandalone = true
          mockChatBanned = false
        })

        afterAll(() => {
          mockChatStandalone = false
        })

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
        })
      })

      describe('when Chat is Banned and standalone', () => {
        beforeAll(() => {
          mockSubmitTicketAvailable = false
          mockChatBanned = true
          mockChatStandalone = true
        })

        afterAll(() => {
          mockChatBanned = false
          mockChatStandalone = false
          mockSubmitTicketAvailable = true
        })

        it('dispatches with nilEmbed', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith(NIL_EMBED)
        })
      })

      describe('when there are no other embeds available', () => {
        it('calls updateActiveEmbed with ticketSubmissionForm', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('ticketSubmissionForm')
        })

        describe('when new support embed is not enabled', () => {
          it('does not update history', () => {
            expect(history.replace).not.toHaveBeenCalled()
          })
        })

        describe('when new support embed is enabled', () => {
          beforeAll(() => {
            mockNewSupportEmbedEnabled = true
          })

          afterAll(() => {
            mockNewSupportEmbedEnabled = false
          })

          it('updates history', () => {
            expect(history.replace).toHaveBeenCalledWith('support/home')
          })
        })
      })
    })

    describe('when help center is not available', () => {
      beforeAll(() => {
        mockHelpCenterAvailable = false
      })

      describe('when widget is activated by ipm and in article view', () => {
        beforeAll(() => {
          mockIpmHelpCenterAllowed = true
          mockArticleViewActive = true
        })

        afterAll(() => {
          mockIpmHelpCenterAllowed = false
          mockArticleViewActive = false
        })

        it('calls updateActiveEmbed with helpCenterForm', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('helpCenterForm')
        })
      })

      describe('when channelChoice is available', () => {
        beforeAll(() => {
          mockChannelChoiceAvailable = true
        })

        afterAll(() => {
          mockChannelChoiceAvailable = false
        })

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('channelChoice')
        })
      })

      describe('when chat is available', () => {
        beforeAll(() => {
          mockChatAvailable = true
        })

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
        })
      })

      describe('when chat is standalone', () => {
        beforeAll(() => {
          mockChatStandalone = true
        })

        afterAll(() => {
          mockChatStandalone = false
        })

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('chat')
        })
      })

      describe('when chat is not available', () => {
        beforeAll(() => {
          mockChatAvailable = false
        })

        it('calls updateActiveEmbed with submit ticket', () => {
          expect(updateActiveEmbedSpy).toHaveBeenCalledWith('ticketSubmissionForm')
        })
      })
    })
  })
})
