describe('resetActiveEmbed middleware', () => {
  let resetActiveEmbed,
    mockActiveEmbed = 'ticketSubmissionForm',
    mockZopimIsChatting = false,
    mockZopimChatOnline = false,
    mockChatStandalone = false,
    mockZopimChatEmbed = false,
    mockChatAvailable = false,
    mockTalkAvailable = false,
    mockChannelChoiceAvailable = false,
    mockHelpCenterAvailable = false,
    mockShowTicketFormsBackButton = false,
    mockIpmHelpCenterAllowed = false,
    mockArticleViewActive = false,
    mockWidgetVisible = true;
  const AUTHENTICATION_SUCCESS = 'AUTHENTICATION_SUCCESS';
  const WIDGET_INITIALISED = 'WIDGET_INITIALISED';
  const ACTIVATE_RECIEVED = 'ACTIVATE_RECIEVED';
  const UPDATE_TALK_AGENT_AVAILABILITY = 'UPDATE_TALK_AGENT_AVAILABILITY';
  const SDK_CONNECTION_UPDATE = 'SDK_CONNECTION_UPDATE';
  const SDK_ACCOUNT_STATUS = 'SDK_ACCOUNT_STATUS';
  const ZOPIM_CHAT_ON_STATUS_UPDATE = 'ZOPIM_CHAT_ON_STATUS_UPDATE';
  const ZOPIM_END_CHAT = 'ZOPIM_END_CHAT';
  const ZOPIM_HIDE = 'ZOPIM_HIDE';
  const updateActiveEmbedSpy = jasmine.createSpy('updateActiveEmbed');
  const updateBackButtonVisibilitySpy = jasmine.createSpy('updateBackButtonVisibility');
  const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'src/redux/modules/base/base-selectors': {
        getChatStandalone: () => mockChatStandalone,
        getZopimChatEmbed: () => mockZopimChatEmbed,
        getActiveEmbed: () => mockActiveEmbed
      },
      'src/redux/modules/selectors': {
        getChatAvailable: () => mockChatAvailable,
        getTalkAvailable: () => mockTalkAvailable,
        getChannelChoiceAvailable: () => mockChannelChoiceAvailable,
        getHelpCenterAvailable: () => mockHelpCenterAvailable,
        getShowTicketFormsBackButton: () => mockShowTicketFormsBackButton,
        getIpmHelpCenterAllowed: () => mockIpmHelpCenterAllowed,
        getWebWidgetVisible: () => mockWidgetVisible
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getArticleViewActive: () => mockArticleViewActive
      },
      'src/redux/modules/zopimChat/zopimChat-selectors': {
        getZopimChatOnline: () => mockZopimChatOnline,
        getZopimIsChatting: () => mockZopimIsChatting
      },
      'src/redux/modules/base': {
        updateActiveEmbed: updateActiveEmbedSpy,
        updateBackButtonVisibility: updateBackButtonVisibilitySpy
      },
      'src/redux/modules/base/base-action-types': {
        WIDGET_INITIALISED, ACTIVATE_RECIEVED, AUTHENTICATION_SUCCESS
      },
      'src/redux/modules/chat/chat-action-types': {
        SDK_CONNECTION_UPDATE, SDK_ACCOUNT_STATUS
      },
      'src/redux/modules/talk/talk-action-types': {
        UPDATE_TALK_AGENT_AVAILABILITY
      },
      'src/redux/modules/zopimChat/zopimChat-action-types': {
        ZOPIM_CHAT_ON_STATUS_UPDATE, ZOPIM_END_CHAT, ZOPIM_HIDE
      }
    });

    const path = buildSrcPath('redux/middleware/resetActiveEmbed');

    resetActiveEmbed = requireUncached(path).default;
  });

  afterEach(() => {
    updateActiveEmbedSpy.calls.reset();
    updateBackButtonVisibilitySpy.calls.reset();
    dispatchSpy.calls.reset();
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('resetActiveEmbed', () => {
    const alwaysUpdateActions = [
      UPDATE_TALK_AGENT_AVAILABILITY,
      WIDGET_INITIALISED,
      ZOPIM_HIDE,
      ACTIVATE_RECIEVED,
      AUTHENTICATION_SUCCESS
    ];
    const chatActions = [
      SDK_CONNECTION_UPDATE,
      SDK_ACCOUNT_STATUS
    ];
    const zopimChatActions = [
      ZOPIM_CHAT_ON_STATUS_UPDATE,
      ZOPIM_END_CHAT
    ];
    let prevState,
      nextState,
      action;

    beforeEach(() => {
      resetActiveEmbed(prevState, nextState, action, dispatchSpy);
    });

    describe('when the widget is shown', () => {
      beforeAll(() => {
        mockWidgetVisible = true;
      });

      _.forEach(alwaysUpdateActions, (actionToTest) => {
        describe(`when action type is ${actionToTest}`, () => {
          beforeAll(() => {
            action = { type: actionToTest };
          });

          it('does not call updateActiveEmbed', () => {
            expect(updateActiveEmbedSpy)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('when the widget is not shown', () => {
      beforeAll(() => {
        mockWidgetVisible = false;
      });

      _.forEach(alwaysUpdateActions, (actionToTest) => {
        describe(`when action type is ${actionToTest}`, () => {
          beforeAll(() => {
            action = { type: actionToTest };
          });

          it('calls updateActiveEmbed', () => {
            expect(updateActiveEmbedSpy)
              .toHaveBeenCalled();
          });
        });
      });

      _.forEach(chatActions, (actionToTest) => {
        describe(`when action type is ${actionToTest}`, () => {
          beforeAll(() => {
            action = { type: actionToTest };
          });

          describe('when the active embed is chat', () => {
            beforeAll(() => {
              mockActiveEmbed = 'chat';
            });

            it('calls updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy)
                .toHaveBeenCalled();
            });
          });

          describe('when the active embed is channelChoice', () => {
            beforeAll(() => {
              mockActiveEmbed = 'channelChoice';
            });

            it('calls updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy)
                .toHaveBeenCalled();
            });
          });

          describe('when the active embed is not chat or channelChoice', () => {
            beforeAll(() => {
              mockActiveEmbed = 'helpCenterForm';
            });

            it('does not call updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy)
                .not.toHaveBeenCalled();
            });
          });
        });
      });

      _.forEach(zopimChatActions, (actionToTest) => {
        describe(`when action type is ${actionToTest}`, () => {
          beforeAll(() => {
            action = { type: actionToTest };
          });

          _.forEach(['zopimChat', 'channelChoice'], (activeEmbed) => {
            describe(`when the active embed is ${activeEmbed}`, () => {
              beforeAll(() => {
                mockActiveEmbed = activeEmbed;
              });

              describe('when online', () => {
                beforeAll(() => {
                  mockZopimChatOnline = true;
                });

                it('does not call updateActiveEmbed', () => {
                  expect(updateActiveEmbedSpy)
                    .not.toHaveBeenCalled();
                });
              });

              describe('when offline', () => {
                beforeAll(() => {
                  mockZopimChatOnline = false;
                });

                describe('when chatting', () => {
                  beforeAll(() => {
                    mockZopimIsChatting = true;
                  });

                  it('does not call updateActiveEmbed', () => {
                    expect(updateActiveEmbedSpy)
                      .not.toHaveBeenCalled();
                  });
                });

                describe('when not chatting', () => {
                  beforeAll(() => {
                    mockZopimIsChatting = false;
                  });

                  it('calls updateActiveEmbed', () => {
                    expect(updateActiveEmbedSpy)
                      .toHaveBeenCalled();
                  });
                });
              });
            });
          });

          describe('when the active embed is not zopimChat or channelChoice', () => {
            beforeAll(() => {
              mockActiveEmbed = 'helpCenterForm';
            });

            it('does not call updateActiveEmbed', () => {
              expect(updateActiveEmbedSpy)
                .not.toHaveBeenCalled();
            });
          });
        });
      });
    });
  });

  describe('setNewActiveEmbed', () => {
    beforeEach(() => {
      mockWidgetVisible = false;

      resetActiveEmbed({}, {}, { type: WIDGET_INITIALISED }, dispatchSpy);
    });

    describe('when Talk is available', () => {
      beforeAll(() => {
        mockTalkAvailable = true;
      });

      afterAll(() => {
        mockTalkAvailable = false;
      });

      describe('when HelpCenter is available', () => {
        beforeAll(() => {
          mockHelpCenterAvailable = true;
        });

        afterAll(() => {
          mockHelpCenterAvailable = false;
        });

        it('calls updateActiveEmbed with helpCenterForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('helpCenterForm');
        });

        describe('when the article view is active', () => {
          beforeAll(() => {
            mockArticleViewActive = true;
          });

          it('calls updateBackButtonVisibility with true', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(true);
          });
        });

        describe('when the article view is not active', () => {
          beforeAll(() => {
            mockArticleViewActive = false;
          });

          it('calls updateBackButtonVisibility with false', () => {
            expect(updateBackButtonVisibilitySpy)
              .toHaveBeenCalledWith(false);
          });
        });
      });

      describe('when ChannelChoice is available', () => {
        beforeAll(() => {
          mockChannelChoiceAvailable = true;
        });

        afterAll(() => {
          mockChannelChoiceAvailable = false;
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when neither HelpCenter or ChannelChoice is available', () => {
        it('calls updateActiveEmbed with talk', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('talk');
        });
      });
    });

    describe('when Talk is not available', () => {
      describe('when Chat is available', () => {
        beforeAll(() => {
          mockChatAvailable = true;
        });

        afterAll(() => {
          mockChatAvailable = false;
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });
      });

      describe('when Chat is standalone', () => {
        beforeAll(() => {
          mockChatStandalone = true;
        });

        afterAll(() => {
          mockChatStandalone = false;
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });
      });

      describe('when there are no other embeds available', () => {
        it('calls updateActiveEmbed with ticketSubmissionForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('ticketSubmissionForm');
        });
      });
    });

    describe('when help center is not available', () => {
      beforeAll(() => {
        mockHelpCenterAvailable = false;
      });

      describe('when widget is activated by ipm and in article view', () => {
        beforeAll(() => {
          mockIpmHelpCenterAllowed = true;
          mockArticleViewActive = true;
        });

        afterAll(() => {
          mockIpmHelpCenterAllowed = false;
          mockArticleViewActive = false;
        });

        it('calls updateActiveEmbed with helpCenterForm', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('helpCenterForm');
        });
      });

      describe('when channelChoice is available', () => {
        beforeAll(() => {
          mockChannelChoiceAvailable = true;
        });

        afterAll(() => {
          mockChannelChoiceAvailable = false;
        });

        it('calls updateActiveEmbed with channelChoice', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('channelChoice');
        });
      });

      describe('when chat is available', () => {
        beforeAll(() => {
          mockChatAvailable = true;
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });
      });

      describe('when chat is standalone', () => {
        beforeAll(() => {
          mockChatStandalone = true;
        });

        afterAll(() => {
          mockChatStandalone = false;
        });

        it('calls updateActiveEmbed with chat', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('chat');
        });
      });

      describe('when chat is not available', () => {
        beforeAll(() => {
          mockChatAvailable = false;
        });

        it('calls updateActiveEmbed with submit ticket', () => {
          expect(updateActiveEmbedSpy)
            .toHaveBeenCalledWith('ticketSubmissionForm');
        });
      });
    });
  });
});
