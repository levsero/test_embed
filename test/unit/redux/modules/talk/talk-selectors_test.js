describe('talk selectors', () => {
  let getEmbeddableConfig,
    getAgentAvailability,
    getFormState,
    getScreen,
    getCallback,
    getAverageWaitTime;
  const successNotificationScreen = 'widget/talk/SUCCESS_NOTIFICATION_SCREEN';

  beforeEach(() => {
    mockery.enable();

    const talkSelectorsPath = buildSrcPath('redux/modules/talk/talk-selectors');

    mockery.registerAllowable(talkSelectorsPath);

    const selectors = requireUncached(talkSelectorsPath);

    getEmbeddableConfig = selectors.getEmbeddableConfig;
    getAgentAvailability = selectors.getAgentAvailability;
    getFormState = selectors.getFormState;
    getScreen = selectors.getScreen;
    getCallback = selectors.getCallback;
    getAverageWaitTime = selectors.getAverageWaitTime;
  });

  describe('getEmbeddableConfig', () => {
    let result;
    const mockTalkState = {
      talk: {
        embeddableConfig: {
          capability: '0',
          enabled: 'false',
          phoneNumber: '+61412345678'
        }
      }
    };

    beforeEach(() => {
      result = getEmbeddableConfig(mockTalkState);
    });

    it('returns the current state of embeddableConfig', () => {
      expect(result)
        .toEqual({
          capability: '0',
          enabled: 'false',
          phoneNumber: '+61412345678'
        });
    });
  });

  describe('getAgentAvailability', () => {
    let result;
    const mockTalkState = {
      talk: {
        agentAvailability: true
      }
    };

    beforeEach(() => {
      result = getAgentAvailability(mockTalkState);
    });

    it('returns the current state of agentAvailbility', () => {
      expect(result)
        .toBe(true);
    });
  });

  describe('getFormState', () => {
    let result;
    const mockTalkState = {
      talk: {
        formState: { phone: '+61412345678' }
      }
    };

    beforeEach(() => {
      result = getFormState(mockTalkState);
    });

    it('returns the current state of formState', () => {
      expect(result)
        .toEqual({ phone: '+61412345678' });
    });
  });

  describe('getScreen', () => {
    let result;
    const mockTalkState = {
      talk: {
        screen: successNotificationScreen
      }
    };

    beforeEach(() => {
      result = getScreen(mockTalkState);
    });

    it('returns the current state of screen', () => {
      expect(result)
        .toBe(successNotificationScreen);
    });
  });

  describe('getCallback', () => {
    let result;
    const mockTalkState = {
      talk: {
        callback: {
          isSending: false,
          errors: [],
          phoneNumber: '+61412345678'
        }
      }
    };

    beforeEach(() => {
      result = getCallback(mockTalkState);
    });

    it('returns the current state of phoneNumber', () => {
      expect(result)
        .toEqual({
          isSending: false,
          errors: [],
          phoneNumber: '+61412345678'
        });
    });
  });

  describe('getAverageWaitTime', () => {
    let result;
    const mockTalkState = {
      talk: {
        averageWaitTime: '2'
      }
    };

    beforeEach(() => {
      result = getAverageWaitTime(mockTalkState);
    });

    it('returns the current state of averageWaitTime', () => {
      expect(result)
        .toBe('2');
    });
  });
});
