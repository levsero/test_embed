describe('chat root reducer', () => {
  let reducer;
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
    'lastReadTimestamp',
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
    'vendor',
    'isLoggingOut',
    'forcedStatus'
  ];

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
      },
      'src/util/nullZChat': noop
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

    it('has the expected sub states', () => {
      _.keys(state).forEach((subState) => {
        if (!subStateList.includes(subState)) {
          fail(`${subState} sub state is missing`);
        }
      });
    });
  });

  describe('when CHAT_USER_LOGGING_OUT action is dispatched', () => {
    let state,
      prevState = {
        vendor: 'yoloVendorLibrary',
        isLoggingOut: true
      };

    beforeEach(() => {
      state = reducer(prevState, { type: 'widget/chat/CHAT_USER_LOGGING_OUT' });
    });

    it('has the expected sub states', () => {
      _.keys(state).forEach((subState) => {
        if (!subStateList.includes(subState)) {
          fail(`${subState} sub state is missing`);
        }
      });
    });

    it('does not change the vendor state', () => {
      expect(state.vendor)
        .toEqual('yoloVendorLibrary');
    });

    it('does not change the isLoggingOut state', () => {
      expect(state.isLoggingOut)
        .toEqual(true);
    });
  });
});
