describe('base selectors', () => {
  let getZopimChatEmbed,
    getHelpCenterEmbed,
    getTalkEmbed,
    getActiveEmbed,
    getChatEmbed,
    getWidgetShown,
    getIPMWidget,
    getChatStandalone,
    getNewHeight,
    getOAuth,
    getAuthToken,
    getBaseIsAuthenticated,
    mockStoreValue,
    isTokenValidSpy = jasmine.createSpy('isTokenValid');

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/base/base-selectors');

    mockery.registerAllowable(selectorsPath);

    initMockRegistry({
      'service/persistence': {
        store: {
          get: () => mockStoreValue
        }
      },
      'utility/utils': {
        isTokenValid: isTokenValidSpy
      }
    });

    const selectors = requireUncached(selectorsPath);

    getZopimChatEmbed = selectors.getZopimChatEmbed;
    getActiveEmbed = selectors.getActiveEmbed;
    getHelpCenterEmbed = selectors.getHelpCenterEmbed;
    getTalkEmbed = selectors.getTalkEmbed;
    getChatEmbed = selectors.getChatEmbed;
    getWidgetShown = selectors.getWidgetShown;
    getChatStandalone = selectors.getChatStandalone;
    getIPMWidget = selectors.getIPMWidget;
    getNewHeight = selectors.getNewHeight;
    getOAuth = selectors.getOAuth;
    getAuthToken = selectors.getAuthToken;
    getBaseIsAuthenticated = selectors.getBaseIsAuthenticated;
  });

  describe('getActiveEmbed', () => {
    let result;
    const mockState = {
      base: {
        activeEmbed: 'chat'
      }
    };

    beforeEach(() => {
      result = getActiveEmbed(mockState);
    });

    it('returns the current active embed', () => {
      expect(result)
        .toEqual('chat');
    });
  });

  describe('getZopimChatEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          zopimChat: true
        }
      }
    };

    beforeEach(() => {
      result = getZopimChatEmbed(mockState);
    });

    it('returns the current state of embed.zopimChat', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getHelpCenterEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          helpCenterForm: true
        }
      }
    };

    beforeEach(() => {
      result = getHelpCenterEmbed(mockState);
    });

    it('returns the current state of embed.helpCenterForm', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getTalkEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          talk: true
        }
      }
    };

    beforeEach(() => {
      result = getTalkEmbed(mockState);
    });

    it('returns the current state of embed.talk', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatEmbed', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          chat: true
        }
      }
    };

    beforeEach(() => {
      result = getChatEmbed(mockState);
    });

    it('returns the current state of embed.chat', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getWidgetShown', () => {
    let result;
    const mockState = {
      base: {
        widgetShown: true
      }
    };

    beforeEach(() => {
      result = getWidgetShown(mockState);
    });

    it('returns the current state of widgetShown', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatStandalone', () => {
    let result;
    const additionalEmbeds = ['talk', 'helpCenterForm', 'ticketSubmissionForm'];

    describe('when Chat is the only product existing', () => {
      beforeEach(() => {
        const mockState = {
          base: {
            embeds: {
              chat: {}
            }
          }
        };

        result = getChatStandalone(mockState);
      });

      it('returns true for the state of chatStandalone', () => {
        expect(result)
          .toEqual(true);
      });
    });

    const refuteChatStandAlone = (embed) => {
      describe(`when ${embed} exist alongside with Chat`, () => {
        beforeEach(() => {
          const mockState = {
            base: {
              embeds: {
                chat: {},
                [embed]: {}
              }
            }
          };

          result = getChatStandalone(mockState);
        });

        it('returns false for the state of chatStandalone', () => {
          expect(result)
            .toEqual(false);
        });
      });
    };

    it('evalutes at least a single additional embed', () => {
      expect(additionalEmbeds.length > 0)
        .toBe(true);
    });

    additionalEmbeds.forEach(refuteChatStandAlone);
  });

  describe('getIPMWidget', () => {
    let result;
    const mockState = {
      base: {
        embeds: {
          ipmWidget: true
        }
      }
    };

    beforeEach(() => {
      result = getIPMWidget(mockState);
    });

    it('returns whether IPM widget is activated', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getNewHeight', () => {
    let result,
      mockState;

    beforeEach(() => {
      result = getNewHeight(mockState);
    });

    describe('when newHeight is true', () => {
      beforeAll(() => {
        mockState = {
          base: {
            arturos: {
              newHeight: true
            }
          }
        };
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when newHeight is false', () => {
      beforeAll(() => {
        mockState = {
          base: {
            arturos: {
              newHeight: false
            }
          }
        };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });

    describe('when newHeight does not exist', () => {
      beforeAll(() => {
        mockState = {
          base: {
            arturos: {
              newChat: true
            }
          }
        };
      });

      it('returns false', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });

  describe('getOAuth', () => {
    let result;

    beforeEach(() => {
      mockStoreValue = 'someAuth';
      result = getOAuth();
    });

    it('returns correct oauth details', () => {
      expect(result)
        .toEqual('someAuth');
    });
  });

  describe('getAuthToken', () => {
    let result;

    beforeEach(() => {
      result = getAuthToken();
    });

    describe('when token does exist', () => {
      beforeAll(() => {
        mockStoreValue = {
          token: 'token'
        };
      });

      it('returns the token', () => {
        expect(result)
          .toEqual('token');
      });
    });

    describe('when token does not exist', () => {
      beforeAll(() => {
        mockStoreValue = {};
      });

      it('returns null', () => {
        expect(result)
          .toEqual(null);
      });
    });

    describe('when whole token object does not exist', () => {
      beforeAll(() => {
        mockStoreValue = undefined;
      });

      it('returns null', () => {
        expect(result)
          .toEqual(null);
      });
    });
  });

  describe('getBaseIsAuthenticated', () => {
    beforeEach(() => {
      mockStoreValue = 'yolo';
      getBaseIsAuthenticated();
    });

    it('calls isTokenValid with correct params', () => {
      expect(isTokenValidSpy)
        .toHaveBeenCalledWith('yolo');
    });
  });
});
