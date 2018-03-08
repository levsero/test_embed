describe('onStateChange middleware', () => {
  let stateChangeFn;
  const getAccountSettingsSpy = jasmine.createSpy('updateAccountSettings');
  const newAgentMessageReceivedSpy = jasmine.createSpy('newAgentMessageReceived');
  const audioPlaySpy = jasmine.createSpy('audioPlay');
  const broadcastSpy = jasmine.createSpy('broadcast');
  const dispatchSpy = jasmine.createSpy('dispatch').and.callThrough();

  beforeAll(() => {
    mockery.enable();

    const path = buildSrcPath('redux/middleware/onStateChange');

    initMockRegistry({
      'src/redux/modules/chat': {
        getAccountSettings: getAccountSettingsSpy,
        newAgentMessageReceived: newAgentMessageReceivedSpy
      },
      'service/audio': {
        audio: {
          play: audioPlaySpy
        }
      },
      'service/mediator': {
        mediator: {
          channel: {
            broadcast: broadcastSpy
          }
        }
      },
      'src/redux/modules/chat/chat-selectors': {
        getUserSoundSettings: (obj) => obj.getUserSoundSettings,
        getConnection: (obj) => obj.getConnection,
        getChatMessagesByAgent: (obj) => obj.getChatMessagesByAgent,
        getChatStatus: (obj) => obj.getChatStatus
      },
      'src/redux/modules/helpCenter/helpCenter-selectors': {
        getArticleDisplayed: (obj) => obj.getArticleDisplayed
      },
      'src/redux/modules/base/base-selectors': {
        getActiveEmbed: (obj) => obj.getActiveEmbed,
        getWidgetShown: (obj) => obj.getWidgetShown
      }
    });

    stateChangeFn = requireUncached(path).default;
  });

  afterEach(() => {
    getAccountSettingsSpy.calls.reset();
    newAgentMessageReceivedSpy.calls.reset();
    audioPlaySpy.calls.reset();
    broadcastSpy.calls.reset();
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  const getMockSelectorState = (object) => {
    const stateTemplate = {
      getChatMessagesByAgent: [{ nick: 'agent' }],
      getChatStatus: 'offline',
      getConnection: 'connecting',
      getUserSoundSettings: false,
      getWidgetShown: false,
      getActiveEmbed: '',
      getArticleDisplayed: false
    };

    return _.extend({}, stateTemplate, object);
  };

  describe('onStateChange', () => {
    describe('when chat status is different from its previous state', () => {
      describe('when the widget is not shown and chat is online', () => {
        beforeEach(() => {
          const prevState = getMockSelectorState({
            getChatStatus: 'offline',
            getWidgetShown: false
          });
          const nextState = {
            ...prevState,
            getChatStatus: 'online'
          };

          stateChangeFn(prevState, nextState, {}, dispatchSpy);
        });

        it('calls mediator with newChat.show', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('newChat.show');
        });

        it('does not call mediator with .hide', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalledWith('.hide');
        });
      });

      describe('when the widget is shown and chat is offline', () => {
        beforeEach(() => {
          const prevState = getMockSelectorState({
            getChatStatus: 'online',
            getWidgetShown: true
          });
          const nextState = {
            ...prevState,
            getChatStatus: 'offline'
          };

          stateChangeFn(prevState, nextState, {}, dispatchSpy);
        });

        it('calls mediator with .hide', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.hide');
        });

        it('does not call mediator with newChat.show', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalledWith('newChat.show');
        });
      });
    });

    describe('onChatConnected', () => {
      describe('when chat has not connected', () => {
        beforeEach(() => {
          const prevState = getMockSelectorState({ getConnection: 'connecting' });

          stateChangeFn(prevState, prevState, {}, dispatchSpy);
        });

        it('does not dispatch the getAccountSettings action', () => {
          expect(getAccountSettingsSpy)
            .not.toHaveBeenCalled();
        });

        it('does not call mediator with newChat.show', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalledWith('newChat.show');
        });
      });

      describe('when chat has connected', () => {
        beforeEach(() => {
          const prevState = getMockSelectorState({ getConnection: 'connecting' });
          const nextState = {
            ...prevState,
            getConnection: 'connected'
          };

          stateChangeFn(prevState, nextState, {}, dispatchSpy);
        });

        it('dispatches the getAccountSettings action', () => {
          expect(getAccountSettingsSpy)
            .toHaveBeenCalled();
        });

        describe('when chat status is online', () => {
          beforeEach(() => {
            const prevState = getMockSelectorState({
              getConnection: 'connecting',
              getChatStatus: 'offline'
            });
            const nextState = {
              ...prevState,
              getChatStatus: 'online'
            };

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('calls mediator with newChat.show', () => {
            expect(broadcastSpy)
              .toHaveBeenCalledWith('newChat.show');
          });
        });
      });
    });

    describe('onNewChatMessage', () => {
      describe('when there are no new messages', () => {
        describe('when audio settings are on', () => {
          beforeEach(() => {
            const prevState = getMockSelectorState({
              getChatMessagesByAgent: [{ nick: 'agent' }],
              getUserSoundSettings: true
            });

            stateChangeFn(prevState, prevState);
          });

          it('does not call sound', () => {
            expect(audioPlaySpy)
              .not.toHaveBeenCalled();
          });

          it('does not dispatch newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .not.toHaveBeenCalled();
          });
        });
      });

      describe('when there are new messages', () => {
        describe('when audio settings are off', () => {
          beforeEach(() => {
            const prevState = getMockSelectorState({
              getChatMessagesByAgent: [{ nick: 'agent' }],
              getUserSoundSettings: false
            });
            const nextState = {
              ...prevState,
              getChatMessagesByAgent: [{ nick: 'agent' }, { nick: 'agent' }]
            };

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('does not call sound', () => {
            expect(audioPlaySpy)
              .not.toHaveBeenCalled();
          });
        });

        describe('when audio settings are on', () => {
          beforeEach(() => {
            const prevState = getMockSelectorState({
              getChatMessagesByAgent: [{ nick: 'agent' }],
              getUserSoundSettings: true
            });
            const nextState = {
              ...prevState,
              getChatMessagesByAgent: [{ nick: 'agent' }, { nick: 'agent' }]
            };

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('calls sound', () => {
            expect(audioPlaySpy)
              .toHaveBeenCalled();
          });
        });

        describe('when the embed is not shown', () => {
          beforeEach(() => {
            const prevState = getMockSelectorState({
              getChatMessagesByAgent: [{ nick: 'agent' }],
              getWidgetShown: false
            });
            const nextState = {
              ...prevState,
              getChatMessagesByAgent: [{ nick: 'agent' }, { nick: 'agent' }]
            };

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('dispatches newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .toHaveBeenCalled();
          });
        });

        describe('when the embed is shown and the active embed is not chat', () => {
          beforeEach(() => {
            const prevState = getMockSelectorState({
              getChatMessagesByAgent: [{ nick: 'agent' }],
              getWidgetShown: true,
              getActiveEmbed: 'helpCenterForm'
            });
            const nextState = {
              ...prevState,
              getChatMessagesByAgent: [{ nick: 'agent' }, { nick: 'agent' }]
            };

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('dispatches newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .toHaveBeenCalled();
          });
        });

        describe('when the embed is shown and the active embed is chat', () => {
          beforeEach(() => {
            const prevState = getMockSelectorState({
              getChatMessagesByAgent: [{ nick: 'agent' }],
              getWidgetShown: true,
              getActiveEmbed: 'chat'
            });
            const nextState = {
              ...prevState,
              getChatMessagesByAgent: [{ nick: 'agent' }, { nick: 'agent' }]
            };

            stateChangeFn(prevState, nextState, {}, dispatchSpy);
          });

          it('does not dispatch newAgentMessageReceived', () => {
            expect(newAgentMessageReceivedSpy)
              .not.toHaveBeenCalled();
          });
        });
      });
    });

    describe('onArticleDisplayed', () => {
      describe('articleDisplayed goes from false to true', () => {
        beforeEach(() => {
          const prevState = getMockSelectorState({ getArticleDisplayed: false });
          const nextState = {
            ...prevState,
            getArticleDisplayed: true
          };

          stateChangeFn(prevState, nextState);
        });

        it('calls mediator', () => {
          expect(broadcastSpy)
            .toHaveBeenCalledWith('.hide', true);

          expect(broadcastSpy)
            .toHaveBeenCalledWith('ipm.webWidget.show');
        });
      });

      describe('articleDisplayed goes from true to true', () => {
        beforeEach(() => {
          const prevState = getMockSelectorState({ getArticleDisplayed: true });

          stateChangeFn(prevState, prevState);
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });

      describe('articleDisplayed goes from true to false', () => {
        beforeEach(() => {
          const prevState = getMockSelectorState({ getArticleDisplayed: true });
          const nextState = {
            ...prevState,
            getArticleDisplayed: false
          };

          stateChangeFn(prevState, nextState);
        });

        it('does not call mediator', () => {
          expect(broadcastSpy)
            .not.toHaveBeenCalled();
        });
      });
    });
  });
});
