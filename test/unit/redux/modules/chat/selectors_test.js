describe('chat selectors', () => {
  let getChatNotification;

  beforeEach(() => {
    mockery.enable();

    const chatSelectorsPath = buildSrcPath('redux/modules/chat/selectors');

    mockery.registerAllowable(chatSelectorsPath);
    getChatNotification = requireUncached(chatSelectorsPath).getChatNotification;
  });

  describe('getChatNotification', () => {
    let result,
      mockAgents,
      mockChats;
    const mockNotification = {
      nick: 'agent:007',
      display_name: 'bond',
      msg: 'how are you',
      show: true
    };

    describe('returns an object', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [{ nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { _c: { values: () => mockChats } }
          }
        });
      });

      it('with the reduced notification object', () => {
        expect(result)
          .toEqual(jasmine.objectContaining({
            nick: 'agent:007',
            display_name: 'bond',
            msg: 'how are you',
            show: true
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

    describe('when there are no existing agent messages', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [{ nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { _c: { values: () => mockChats } }
          }
        });
      });

      it('returns an object with proactive true', () => {
        expect(result.proactive)
          .toBe(true);
      });
    });

    describe('when there are existing agent messages', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [
          { nick: 'agent:007', type: 'chat.msg', msg: 'hi' },
          { nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }
        ];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { _c: { values: () => mockChats } }
          }
        });
      });

      it('returns an object with proactive false', () => {
        expect(result.proactive)
          .toBe(false);
      });
    });

    describe('when there are existing agent messages for a different agent', () => {
      beforeEach(() => {
        mockAgents = { 'agent:007': { avatar_path: '/path/' } };
        mockChats = [
          { nick: 'agent:other-agent', type: 'chat.msg', msg: 'other agent message' },
          { nick: 'agent:007', type: 'chat.msg', msg: 'how are you' }
        ];

        result = getChatNotification({
          chat: {
            notification: mockNotification,
            agents: mockAgents,
            chats: { _c: { values: () => mockChats } }
          }
        });
      });

      it('returns an object with proactive true', () => {
        expect(result.proactive)
          .toBe(true);
      });
    });
  });
});
