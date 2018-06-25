describe('chat root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/index');

    initMockRegistry({
      'component/chat/rating/RatingGroup': {
        ratings: { NOT_SET: null }
      },
      'constants/chat': {
        OFFLINE_FORM_SCREENS: {}
      },
      'src/util/chat': {
        isAgent: {}
      }
    });

    reducer = requireUncached(reducerPath).default;
  });

  afterAll(() => {
    mockery.disable();
    mockery.deregisterAll();
  });

  describe('initial state', () => {
    let state;

    beforeEach(() => {
      state = reducer({}, { type: '' });
    });

    const subStateList = [
      'account_status',
      'accountSettings',
      'agentJoined',
      'agents',
      'chatHistory',
      'chats',
      'connection',
      'currentMessage',
      'currentSessionStartTime',
      'departments',
      'editContactDetails',
      'emailTranscript',
      'formState',
      'inactive',
      'inactiveAgents',
      'is_chatting',
      'lastAgentMessageSeenTimestamp',
      'menu',
      'menuVisible',
      'notification',
      'offlineMessage',
      'operatingHours',
      'queuePosition',
      'rating',
      'screen',
      'sessionTimestamp',
      'socialLogin',
      'standaloneMobileNotificationVisible',
      'userSettings',
      'visitor',
      'isAuthenticated',
      'vendor'
    ];

    it('has the expected sub states', () => {
      _.keys(state).forEach((subState) => {
        if (!subStateList.includes(subState)) {
          fail(`${subState} sub state is missing`);
        }
      });
    });
  });
});
