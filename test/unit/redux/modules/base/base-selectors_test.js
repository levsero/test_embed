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

  describe('getUserMinimizedChatBadge', () => {
    let result;
    const mockState = {
      base: {
        isChatBadgeMinimized: true
      }
    };

    beforeEach(() => {
      result = selectors.getUserMinimizedChatBadge(mockState);
    });

    it('returns the value of isChatBadgeMinimized', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getAfterWidgetShowAnimation', () => {
    let result;
    const mockState = {
      base: {
        afterWidgetShowAnimation: []
      }
    };

    beforeEach(() => {
      result = selectors.getAfterWidgetShowAnimation(mockState);
    });

    it('returns the value of afterWidgetShowAnimation', () => {
      expect(result)
        .toEqual([]);
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
    let result,
      mockState;

    beforeEach(() => {
      result = selectors.getChatStandalone(mockState);
    });

    describe('when chat is standalone', () => {
      beforeAll(() => {
        mockState = {
          base: {
            embeddableConfig: {
              embeds: {
                zopimChat: {
                  props: {
                    standalone: true
                  }
                }
              }
            }
          }
        };
      });

      it('returns true', () => {
        expect(result)
          .toEqual(true);
      });
    });

    describe('when chat is not standalone', () => {
      beforeAll(() => {
        mockState = {
          base: {
            embeddableConfig: {
              embeds: {
                zopimChat: {
                  props: {
                    standalone: false
                  }
                }
              }
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

  describe('getLocale', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          locale: 'ar'
        }
      };
      result = selectors.getLocale(mockState);
    });

    it('returns the expected locale', () => {
      expect(result)
        .toEqual('ar');
    });
  });

  describe('getChatBadgeArturoEnabled', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          arturos: {
            chatBadge: true
          }
        }
      };
      result = selectors.getChatBadgeArturoEnabled(mockState);
    });

    it('returns the value of the chatBadge arturo', () => {
      expect(result)
        .toEqual(true);
    });
  });

  describe('getChatPopoutArturoEnabled', () => {
    let result,
      mockState;

    beforeEach(() => {
      mockState = {
        base: {
          arturos: {
            chatPopout: true
          }
        }
      };
      result = selectors.getChatPopoutArturoEnabled(mockState);
    });

    it('returns the value of the chatPopout arturo', () => {
      expect(result)
        .toEqual(true);
    });
  });
});
