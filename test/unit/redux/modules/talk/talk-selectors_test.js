describe('talk selectors', () => {
  let getEmbeddableConfig,
    getCapability,
    getAgentAvailability,
    getFormState,
    getScreen,
    getCallback,
    getAverageWaitTime,
    getAverageWaitTimeEnabled,
    getInitialScreen,
    isCallbackEnabled,
    mockGetTalkEmbedValue,
    getTalkAvailable;
  const successNotificationScreen = 'widget/talk/SUCCESS_NOTIFICATION_SCREEN';

  beforeEach(() => {
    mockery.enable();

    const talkSelectorsPath = buildSrcPath('redux/modules/talk/talk-selectors');

    mockGetTalkEmbedValue = true;

    initMockRegistry({
      'src/redux/modules/base/selectors': {
        getTalkEmbed: () => mockGetTalkEmbedValue
      }
    });

    mockery.registerAllowable(talkSelectorsPath);

    const selectors = requireUncached(talkSelectorsPath);

    getEmbeddableConfig = selectors.getEmbeddableConfig;
    getCapability = selectors.getCapability;
    getAgentAvailability = selectors.getAgentAvailability;
    getFormState = selectors.getFormState;
    getScreen = selectors.getScreen;
    getCallback = selectors.getCallback;
    getAverageWaitTime = selectors.getAverageWaitTime;
    getAverageWaitTimeEnabled = selectors.getAverageWaitTimeEnabled;
    getInitialScreen = selectors.getInitialScreen;
    isCallbackEnabled = selectors.isCallbackEnabled;
    getTalkAvailable = selectors.getTalkAvailable;
  });

  describe('getEmbeddableConfig', () => {
    let result;
    const mockTalkState = {
      talk: {
        embeddableConfig: {
          capability: '0',
          enabled: false,
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
          enabled: false,
          phoneNumber: '+61412345678'
        });
    });
  });

  describe('getCapability', () => {
    let result;
    const mockTalkState = {
      talk: {
        embeddableConfig: {
          capability: 'widget/talk/CALLBACK_AND_PHONE'
        }
      }
    };

    beforeEach(() => {
      result = getCapability(mockTalkState);
    });

    it('returns the current state of capability', () => {
      expect(result)
        .toBe('widget/talk/CALLBACK_AND_PHONE');
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

    it('returns the current state of agentAvailability', () => {
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

  describe('getAverageWaitTimeEnabled', () => {
    let result;
    const mockTalkState = {
      talk: {
        averageWaitTimeEnabled: true
      }
    };

    beforeEach(() => {
      result = getAverageWaitTimeEnabled(mockTalkState);
    });

    it('returns the current state of averageWaitTimeEnabled', () => {
      expect(result)
        .toBe(true);
    });
  });

  describe('getInitialScreen', () => {
    let result;
    const mockTalkState = {
      talk: {
        embeddableConfig: { capability: 'widget/talk/PHONE_ONLY' }
      }
    };

    beforeEach(() => {
      result = getInitialScreen(mockTalkState);
    });

    it('returns the current correct screen for the current state of capability', () => {
      expect(result)
        .toBe('widget/talk/PHONE_ONLY_SCREEN');
    });
  });

  describe('isCallbackEnabled', () => {
    let result;

    describe('when callback only capability is enabled', () => {
      beforeEach(() => {
        const mockTalkState = {
          talk: {
            embeddableConfig: { capability: 'widget/talk/CALLBACK_ONLY' }
          }
        };

        result = isCallbackEnabled(mockTalkState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when phone and callback capability is enabled', () => {
      beforeEach(() => {
        const mockTalkState = {
          talk: {
            embeddableConfig: { capability: 'widget/talk/CALLBACK_AND_PHONE' }
          }
        };

        result = isCallbackEnabled(mockTalkState);
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when phone only capability is enabled', () => {
      beforeEach(() => {
        const mockTalkState = {
          talk: {
            embeddableConfig: { capability: 'widget/talk/PHONE_ONLY' }
          }
        };

        result = isCallbackEnabled(mockTalkState);
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getTalkAvailable', () => {
    const mockTalkState = {
      talk: {
        agentAvailability: true,
        embeddableConfig: {
          enabled: true
        }
      }
    };

    describe('when embeddableConfig.enabled, agentAvailability and talkEmbed is true', () => {
      let result;

      beforeEach(() => {
        result = getTalkAvailable(mockTalkState);
      });

      it('returns true', () => {
        expect(result)
          .toBe(true);
      });
    });

    describe('when embeddableConfig enabled is false', () => {
      let result;

      beforeEach(() => {
        mockTalkState.talk.embeddableConfig.enabled = false;
        result = getTalkAvailable(mockTalkState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when agentAvailability is false', () => {
      let result;

      beforeEach(() => {
        mockTalkState.talk.agentAvailability = false;
        result = getTalkAvailable(mockTalkState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });

    describe('when talkEmbed is false', () => {
      let result;

      beforeEach(() => {
        mockGetTalkEmbedValue = false;
        result = getTalkAvailable(mockTalkState);
      });

      it('returns false', () => {
        expect(result)
          .toBe(false);
      });
    });
  });
});
