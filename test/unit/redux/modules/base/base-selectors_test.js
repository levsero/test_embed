describe('base selectors', () => {
  let getZopimChatEmbed,
    getHelpCenterEmbed,
    getTalkEmbed,
    getActiveEmbed,
    getChatEmbed,
    getWidgetShown,
    getIPMWidget,
    getChatStandalone,
    getOAuth,
    getAuthToken,
    getBaseIsAuthenticated,
    getQueue,
    getEmbeddableConfig,
    getHelpCenterContextualEnabled,
    getHelpCenterSignInRequired,
    getIsAuthenticationPending,
    getHasWidgetShown,
    getHasPassedAuth,
    getChatOverrideProxy,
    getZChatConfig,
    getZopimId,
    mockStoreValue,
    mockIsOnHelpCenterPage,
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
      'src/redux/modules/base/helpers/auth': {
        isTokenValid: isTokenValidSpy
      },
      'utility/pages': {
        isOnHelpCenterPage: () => mockIsOnHelpCenterPage
      }
    });

    const selectors = requireUncached(selectorsPath);

    getIsAuthenticationPending = selectors.getIsAuthenticationPending;
    getZopimChatEmbed = selectors.getZopimChatEmbed;
    getActiveEmbed = selectors.getActiveEmbed;
    getHelpCenterEmbed = selectors.getHelpCenterEmbed;
    getTalkEmbed = selectors.getTalkEmbed;
    getChatEmbed = selectors.getChatEmbed;
    getWidgetShown = selectors.getWidgetShown;
    getChatStandalone = selectors.getChatStandalone;
    getIPMWidget = selectors.getIPMWidget;
    getOAuth = selectors.getOAuth;
    getAuthToken = selectors.getAuthToken;
    getBaseIsAuthenticated = selectors.getBaseIsAuthenticated;
    getQueue = selectors.getQueue;
    getEmbeddableConfig = selectors.getEmbeddableConfig;
    getHelpCenterContextualEnabled = selectors.getHelpCenterContextualEnabled;
    getHelpCenterSignInRequired = selectors.getHelpCenterSignInRequired;
    getHasWidgetShown = selectors.getHasWidgetShown;
    getHasPassedAuth = selectors.getHasPassedAuth;
    getChatOverrideProxy = selectors.getChatOverrideProxy;
    getZopimId = selectors.getZopimId;
    getZChatConfig = selectors.getZChatConfig;
  });

  describe('getZChatConfig', () => {
    let result,
      mockState;

    beforeEach(() => {
      result = getZChatConfig(mockState);
    });

    describe('when overrideProxy exists', () => {
      beforeAll(() => {
        mockState = {
          base: {
            embeddableConfig: {
              embeds: {
                zopimChat: {
                  props: {
                    zopimId: 'id',
                    overrideProxy: 'someProxy'
                  }
                }
              }
            }
          }
        };
      });

      it('returns the chat config', () => {
        /* eslint-disable camelcase */
        expect(result)
          .toEqual({
            account_key: 'id',
            override_proxy: 'someProxy'
          });
        /* eslint-enable camelcase */
      });
    });

    describe('when overrideProxy does not exist', () => {
      beforeAll(() => {
        mockState = {
          base: {
            embeddableConfig: {
              embeds: {
                zopimChat: {
                  props: {
                    zopimId: 'id'
                  }
                }
              }
            }
          }
        };
      });

      it('returns the chat config', () => {
        /* eslint-disable camelcase */
        expect(result)
          .toEqual({
            account_key: 'id'
          });
        /* eslint-enable camelcase */
      });
    });
  });

  describe('getZopimId', () => {
    let result;
    const mockState = {
      base: {
        embeddableConfig: {
          embeds: {
            zopimChat: {
              props: {
                zopimId: 'id'
              }
            }
          }
        }
      }
    };

    beforeEach(() => {
      result = getZopimId(mockState);
    });

    it('returns the chat key', () => {
      expect(result)
        .toEqual('id');
    });
  });

  describe('getChatOverrideProxy', () => {
    let result;
    const mockState = {
      base: {
        embeddableConfig: {
          embeds: {
            zopimChat: {
              props: {
                overrideProxy: 'yoloo'
              }
            }
          }
        }
      }
    };

    beforeEach(() => {
      result = getChatOverrideProxy(mockState);
    });

    it('returns the override proxy', () => {
      expect(result)
        .toEqual('yoloo');
    });
  });

  describe('getHasPassedAuth', () => {
    let result,
      mockState,
      mockHelpCenterSignInRequired;

    beforeEach(() => {
      mockState = {
        base: {
          embeddableConfig: {
            embeds: {
              helpCenterForm: {
                props: {
                  signInRequired: mockHelpCenterSignInRequired
                }
              }
            }
          }
        }
      };
      result = getHasPassedAuth(mockState);
    });

    describe('isAuthenticated', () => {
      beforeAll(() => {
        mockHelpCenterSignInRequired = true;
        mockIsOnHelpCenterPage = false;
      });

      describe('when set to true', () => {
        beforeAll(() => {
          isTokenValidSpy = jasmine.createSpy('isTokenValid').and.returnValue(true);
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when set to false', () => {
        beforeAll(() => {
          isTokenValidSpy = jasmine.createSpy('isTokenValid').and.returnValue(false);
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });

    describe('helpCenterSignInRequired', () => {
      beforeAll(() => {
        isTokenValidSpy = jasmine.createSpy('isTokenValid').and.returnValue(false);
        mockIsOnHelpCenterPage = false;
      });

      describe('when set to true', () => {
        beforeAll(() => {
          mockHelpCenterSignInRequired = true;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });

      describe('when set to false', () => {
        beforeAll(() => {
          mockHelpCenterSignInRequired = false;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });
    });

    describe('isOnHelpCenterPage', () => {
      beforeAll(() => {
        isTokenValidSpy = jasmine.createSpy('isTokenValid').and.returnValue(false);
        mockHelpCenterSignInRequired = true;
      });

      describe('when set to true', () => {
        beforeAll(() => {
          mockIsOnHelpCenterPage = true;
        });

        it('returns true', () => {
          expect(result)
            .toEqual(true);
        });
      });

      describe('when set to false', () => {
        beforeAll(() => {
          mockIsOnHelpCenterPage = false;
        });

        it('returns false', () => {
          expect(result)
            .toEqual(false);
        });
      });
    });
  });

  describe('getHasWidgetShown', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          hasWidgetShown: true
        }
      };
      result = getHasWidgetShown(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getIsAuthenticationPending', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          isAuthenticationPending: true
        }
      };
      result = getIsAuthenticationPending(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getHelpCenterSignInRequired', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          embeddableConfig: {
            embeds: {
              helpCenterForm: {
                props: {
                  signInRequired: true
                }
              }
            }
          }
        }
      };
      result = getHelpCenterSignInRequired(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getHelpCenterContextualEnabled', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          embeddableConfig: {
            embeds: {
              helpCenterForm: {
                props: {
                  contextualHelpEnabled: true
                }
              }
            }
          }
        }
      };
      result = getHelpCenterContextualEnabled(mockState);
    });

    it('returns true', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getEmbeddableConfig', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          embeddableConfig: 'yoloConfig'
        }
      };
      result = getEmbeddableConfig(mockState);
    });

    it('returns the embeddableConfig', () => {
      expect(result)
        .toEqual('yoloConfig');
    });
  });

  describe('getQueue', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          queue: {
            someMethod: ['yeah', 'some', 'args']
          }
        }
      };
      result = getQueue(mockState);
    });

    it('returns the queue', () => {
      expect(result)
        .toEqual({
          someMethod: ['yeah', 'some', 'args']
        });
    });
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
