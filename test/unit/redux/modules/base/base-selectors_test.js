describe('base selectors', () => {
  let selectors,
    mockStoreValue,
    mockIsOnHelpCenterPage,
    isTokenValidSpy = jasmine.createSpy('isTokenValid');

  beforeEach(() => {
    mockery.enable();

    const selectorsPath = buildSrcPath('redux/modules/base/base-selectors');

    mockery.registerAllowable(selectorsPath);

    initMockRegistry({
      'constants/shared': {
        EMBED_MAP: {
          helpCenterForm: 'helpCenter'
        },
        LAUNCHER: 'launcher'
      },
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

    selectors = requireUncached(selectorsPath);
  });

  describe('getZChatConfig', () => {
    let result,
      mockState;

    beforeEach(() => {
      result = selectors.getZChatConfig(mockState);
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
      result = selectors.getZopimId(mockState);
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
      result = selectors.getChatOverrideProxy(mockState);
    });

    it('returns the override proxy', () => {
      expect(result)
        .toEqual('yoloo');
    });
  });

  describe('getOnApiListeners', () => {
    let result;
    const mockState = {
      base: {
        onApiListeners: 'listening'
      }
    };

    beforeEach(() => {
      result = selectors.getOnApiListeners(mockState);
    });

    it('returns the override proxy', () => {
      expect(result)
        .toEqual('listening');
    });
  });

  describe('getHiddenByHideAPI', () => {
    let result;
    const mockState = {
      base: {
        hidden: {
          hideApi: true
        }
      }
    };

    beforeEach(() => {
      result = selectors.getHiddenByHideAPI(mockState);
    });

    it('returns the override proxy', () => {
      expect(result)
        .toEqual(true);
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
      result = selectors.getHasPassedAuth(mockState);
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
      result = selectors.getHasWidgetShown(mockState);
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
      result = selectors.getIsAuthenticationPending(mockState);
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
      result = selectors.getHelpCenterSignInRequired(mockState);
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
      result = selectors.getHelpCenterContextualEnabled(mockState);
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
      result = selectors.getEmbeddableConfig(mockState);
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
      result = selectors.getQueue(mockState);
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
      result = selectors.getActiveEmbed(mockState);
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
      result = selectors.getZopimChatEmbed(mockState);
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
      result = selectors.getHelpCenterEmbed(mockState);
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
      result = selectors.getTalkEmbed(mockState);
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
      result = selectors.getChatEmbed(mockState);
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
      result = selectors.getWidgetShown(mockState);
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

        result = selectors.getChatStandalone(mockState);
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

          result = selectors.getChatStandalone(mockState);
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
      result = selectors.getIPMWidget(mockState);
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
      result = selectors.getOAuth();
    });

    it('returns correct oauth details', () => {
      expect(result)
        .toEqual('someAuth');
    });
  });

  describe('getAuthToken', () => {
    let result;

    beforeEach(() => {
      result = selectors.getAuthToken();
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
      selectors.getBaseIsAuthenticated();
    });

    it('calls isTokenValid with correct params', () => {
      expect(isTokenValidSpy)
        .toHaveBeenCalledWith('yolo');
    });
  });

  describe('getWidgetDisplayInfo', () => {
    let widgetShownValue, result;

    beforeEach(() => {
      const mockState = {
        base: {
          widgetShown: widgetShownValue,
          activeEmbed: 'helpCenterForm'
        }
      };

      result = selectors.getWidgetDisplayInfo(mockState);
    });

    describe('when widget is shown', () => {
      beforeAll(() => {
        widgetShownValue = true;
      });

      it('returns the active embed part of the map', () => {
        expect(result)
          .toEqual('helpCenter');
      });
    });

    describe('when widget is not shown', () => {
      beforeAll(() => {
        widgetShownValue = false;
      });

      it('returns launcher', () => {
        expect(result)
          .toEqual('launcher');
      });
    });
  });

  describe('getConfigColor', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          embeddableConfig: {
            color: 'blue',
            textColor: 'deep'
          }
        }
      };
      result = selectors.getConfigColor(mockState);
    });

    it('returns the color in expected format', () => {
      expect(result)
        .toEqual({ base: 'blue', text: 'deep' });
    });
  });

  describe('getFrameVisible', () => {
    let result, frame;

    beforeEach(() => {
      const mockState = {
        base: {
          webWidgetVisible: true,
          launcherVisible: false
        }
      };

      result = selectors.getFrameVisible(mockState, frame);
    });

    describe('when frame is webWidget', () => {
      beforeAll(() => {
        frame = 'webWidget';
      });

      it('returns the web widget visible state', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when frame is launcher', () => {
      beforeAll(() => {
        frame = 'launcher';
      });

      it('returns the launcher visible state', () => {
        expect(result)
          .toEqual(false);
      });
    });
  });
});
