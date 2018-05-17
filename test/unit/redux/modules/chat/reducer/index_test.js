describe('chat root reducer', () => {
  let reducer;

  beforeAll(() => {
    mockery.enable();

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/index');

    initMockRegistry({
      'component/chat/ChatRatingGroup': {
        ChatRatings: { NOT_SET: null }
      },
      'constants/chat': {
        OFFLINE_FORM_SCREENS: {}
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

    it('has the accountSettings sub state', () => {
      expect(state.accountSettings)
        .toBeDefined();
    });

    it('has the account_status sub state', () => {
      expect(state.account_status)
        .toBeDefined();
    });

    it('has the agents sub state', () => {
      expect(state.agents)
        .toBeDefined();
    });

    it('has the chats sub state', () => {
      expect(state.chats)
        .toBeDefined();
    });

    it('has the visitor sub state', () => {
      expect(state.connection)
        .toBeDefined();
    });

    it('has the currentMessage sub state', () => {
      expect(state.currentMessage)
        .toBeDefined();
    });

    it('has the departments sub state', () => {
      expect(state.departments)
        .toBeDefined();
    });

    it('has the is_chatting sub state', () => {
      expect(state.is_chatting)
        .toBeDefined();
    });

    it('has the visitor sub state', () => {
      expect(state.visitor)
        .toBeDefined();
    });

    it('has the rating sub state', () => {
      expect(state.rating)
        .toBeDefined();
    });

    it('has the notification sub state', () => {
      expect(state.notification)
        .toBeDefined();
    });

    it('has the screen sub state', () => {
      expect(state.screen)
        .toBeDefined();
    });

    it('has the userSettings sub state', () => {
      expect(state.userSettings)
        .toBeDefined();
    });

    it('has the emailTranscript sub state', () => {
      expect(state.emailTranscript)
        .toBeDefined();
    });

    it('has the formState sub state', () => {
      expect(state.formState)
        .toBeDefined();
    });

    it('has the operatingHours sub state', () => {
      expect(state.operatingHours)
        .toBeDefined();
    });

    it('has the editContactDetails sub state', () => {
      expect(state.editContactDetails)
        .toBeDefined();
    });

    it('has the menu visible sub state', () => {
      expect(state.menuVisible)
        .toBeDefined();
    });

    it('has the inactive agents sub state', () => {
      expect(state.inactiveAgents)
        .toBeDefined();
    });

    it('has the currentSessionStartTime sub state', () => {
      expect(state.currentSessionStartTime)
        .toBeDefined();
    });

    it('has the chatHistory sub state', () => {
      expect(state.chatHistory)
        .toBeDefined();
    });
  });
});
