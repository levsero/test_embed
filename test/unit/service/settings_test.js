import configureMockStore from 'redux-mock-store';

describe('settings', () => {
  let settings,
    mockRegistry,
    defaults;
  const settingsPath = buildSrcPath('service/settings');
  const maxLocaleFallbacks = 3;
  const createMockStore = configureMockStore();
  const mockStore = createMockStore();
  const mockUpdateSettingsChatSuppressAction = 'UPDATE_SETTINGS_CHAT_SUPPRESS';
  const mockUpdateSettingsAction = 'UPDATE_SETTINGS';

  beforeEach(() => {
    mockery.enable();
    mockRegistry = initMockRegistry({
      'src/redux/modules/settings': {
        updateSettingsChatSuppress: () => { return { type: mockUpdateSettingsChatSuppressAction }; },
        updateSettings: () => { return { type: mockUpdateSettingsAction }; }
      },
      'utility/globals': {
        win: {
          zESettings: {}
        }
      },
      'utility/utils': {
        objectDifference: mockObjectDifference
      }
    });
    defaults = {
      color: {
        bypassAccessibilityRequirement: true
      },
      contactForm: {
        subject: false,
        attachments: true,
        ticketForms: [],
        tags: []
      },
      contactOptions: { enabled: false },
      helpCenter: {
        originalArticleButton: true,
        localeFallbacks: []
      },
      margin: 8,
      offset: {
        horizontal: 0,
        vertical: 0,
        mobile: {
          horizontal: 0,
          vertical: 0
        }
      },
      viaId: 48,
      zIndex: 999999
    };

    mockery.registerAllowable(settingsPath);
    settings = requireUncached(settingsPath).settings;
  });

  describe('store', () => {
    describe('webWidget defaults', () => {
      beforeEach(() => {
        settings.init();
      });

      it('has the correct value for offset', () => {
        expect(settings.get('offset'))
          .toEqual(defaults.offset);
      });

      it('has the correct value for margin', () => {
        expect(settings.get('margin'))
          .toEqual(defaults.margin);
      });

      it('has the correct value for via id', () => {
        expect(settings.get('viaId'))
          .toEqual(defaults.viaId);
      });

      it('has the correct value for helpCenter.originalArticleButton', () => {
        expect(settings.get('helpCenter.originalArticleButton'))
          .toEqual(defaults.helpCenter.originalArticleButton);
      });

      it('has the correct value for color.bypassAccessibilityRequirement', () => {
        expect(settings.get('color.bypassAccessibilityRequirement'))
          .toEqual(defaults.color.bypassAccessibilityRequirement);
      });

      it('has the correct value for contactForm.attachments', () => {
        expect(settings.get('contactForm.attachments'))
          .toEqual(defaults.contactForm.attachments);
      });

      it('has the correct value for contactForm.subject', () => {
        expect(settings.get('contactForm.subject'))
          .toEqual(defaults.contactForm.subject);
      });

      it('has the correct value for contactForm.tags', () => {
        expect(settings.get('contactForm.tags'))
          .toEqual(defaults.contactForm.tags);
      });

      it('has the correct value for contactForm.ticketForms', () => {
        expect(settings.get('contactForm.ticketForms'))
          .toEqual(defaults.contactForm.ticketForms);
      });

      it('has the correct value for contactOptions', () => {
        expect(settings.get('contactOptions'))
          .toEqual(defaults.contactOptions);
      });

      it('has the correct value for zIndex', () => {
        expect(settings.get('zIndex'))
          .toEqual(defaults.zIndex);
      });

      it('has the correct value chat concierge avatarPath', () => {
        expect(settings.get('chat.concierge.avatarPath'))
          .toBeNull();
      });
    });
  });

  describe('#init', () => {
    it('should store a whitelisted value if it is in win.zESetting', () => {
      mockRegistry['utility/globals'].win.zESettings = { webWidget: { authenticate: 'foo' } };
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual('foo');
    });

    it('should not store a value if it is not in the whitelist', () => {
      mockRegistry['utility/globals'].win.zESettings = { webWidget: { foo: 'bar' } };
      settings.init();

      expect(settings.get('foo'))
        .toEqual(null);
    });

    it('should be backwards compatible with authenticate', () => {
      mockRegistry['utility/globals'].win.zESettings = { authenticate: 'foo' };
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual('foo');
    });

    it('should limit number of locale fallbacks', () => {
      mockRegistry['utility/globals'].win.zESettings = {
        webWidget: {
          helpCenter: {
            localeFallbacks: ['en-US', 'en-AU', 'fr', 'zh-CH']
          }
        }
      };
      settings.init();
      settings.enableCustomizations();

      const localeFallbacks = settings.get('helpCenter.localeFallbacks');

      expect(localeFallbacks.length)
        .toBe(maxLocaleFallbacks);

      expect(localeFallbacks)
        .toEqual(['en-US', 'en-AU', 'fr']);
    });

    it('calls updateSettingsChatSuppress', () => {
      settings.init(mockStore);

      expect(mockStore.getActions()[0].type)
        .toEqual(mockUpdateSettingsChatSuppressAction);
    });

    it('calls updateSettings', () => {
      settings.init(mockStore);

      expect(mockStore.getActions()[1].type)
        .toEqual(mockUpdateSettingsAction);
    });

    describe('when errorReporting is true', () => {
      beforeEach(() => {
        mockRegistry['utility/globals'].win.zESettings = { errorReporting: true };
        settings.init();
      });

      it('sets errorReporting to true', () => {
        expect(settings.getErrorReportingEnabled())
          .toBe(true);
      });
    });

    describe('when errorReporting is false', () => {
      beforeEach(() => {
        mockRegistry['utility/globals'].win.zESettings = { errorReporting: false };
        settings.init();
      });

      it('sets errorReporting to false', () => {
        expect(settings.getErrorReportingEnabled())
          .toBe(false);
      });
    });

    describe('when errorReporting is not defined', () => {
      beforeEach(() => {
        settings.init();
      });

      it('sets errorReporting to true', () => {
        expect(settings.getErrorReportingEnabled())
          .toBe(true);
      });
    });
  });

  describe('#get', () => {
    beforeEach(() => {
      mockRegistry['utility/globals'].win.zESettings = {
        webWidget: {
          authenticate: 'foo',
          contactForm: {
            subject: true
          },
          contactOptions: {
            enabled: true,
            contactButton: {
              '*': 'Yo, contact us!',
              'es-ES': '¿Dónde está la biblioteca?'
            },
            aNonSanctionedOption: 'wawaweewa!'
          },
          helpCenter: {
            originalArticleButton: false,
            suppress: true,
            localeFallbacks: ['fr']
          },
          chat: {
            suppress: true,
            concierge: {
              avatarPath: 'https://i.imgur.com/3mZBYfn.jpg'
            },
            visitor: {
              departments: {
                department: 'yolo'
              }
            },
            mobile: {
              notifications: {
                disable: true
              }
            }
          },
          talk: {
            suppress: true
          },
          color: {
            theme: '#FF0000',
            button: '#0000FF',
            header: '#00FF00',
            launcher: '#990000',
            launcherText: '#009900',
            articleLinks: '#000099',
            resultLists: '#660000',
            bypassAccessibilityRequirement: true
          }
        }
      };

      settings.init();
    });

    it('returns user setting for helpCenter.originalArticleButton', () => {
      expect(settings.get('helpCenter.originalArticleButton'))
        .toBe(false);
    });

    it('returns chat department settings', () => {
      expect(settings.get('chat.visitor.departments.department'))
        .toBe('yolo');
    });

    it('returns mobile notifications disable settings', () => {
      expect(settings.get('chat.mobile.notifications.disable'))
        .toBe(true);
    });

    it('returns chat concierge avatarPath', () => {
      expect(settings.get('chat.concierge.avatarPath'))
        .toBe('https://i.imgur.com/3mZBYfn.jpg');
    });

    it('returns user setting for suppress', () => {
      expect(settings.get('helpCenter.suppress'))
        .toBe(true);

      expect(settings.get('chat.suppress'))
        .toBe(true);

      expect(settings.get('talk.suppress'))
        .toBe(true);
    });

    it('returns user setting for color theme', () => {
      expect(settings.get('color.theme'))
        .toBe('#FF0000');
    });

    it('returns user setting for color button', () => {
      expect(settings.get('color.button'))
        .toBe('#0000FF');
    });

    it('returns user setting for color header', () => {
      expect(settings.get('color.header'))
        .toBe('#00FF00');
    });

    it('returns user setting for color launcher', () => {
      expect(settings.get('color.launcher'))
        .toBe('#990000');
    });

    it('returns user setting for color launcherText', () => {
      expect(settings.get('color.launcherText'))
        .toBe('#009900');
    });

    it('returns user setting for color articleLinks', () => {
      expect(settings.get('color.articleLinks'))
        .toBe('#000099');
    });

    it('returns user setting for color resultLists', () => {
      expect(settings.get('color.resultLists'))
        .toBe('#660000');
    });

    it('returns user setting for color bypassAccessibilityRequirement', () => {
      expect(settings.get('color.bypassAccessibilityRequirement'))
        .toBe(true);
    });

    it('returns user setting for contactForm.subject', () => {
      expect(settings.get('contactForm.subject'))
        .toBe(true);
    });

    describe('when web widget customisations are enabled', () => {
      beforeEach(() => {
        settings.init();
        settings.enableCustomizations();
      });

      it('returns user setting for helpCenter.localeFallbacks', () => {
        expect(settings.get('helpCenter.localeFallbacks'))
          .toEqual(['fr']);
      });
    });

    describe('when web widget customisations are disabled', () => {
      it('returns user default for helpCenter.localeFallbacks', () => {
        expect(settings.get('helpCenter.localeFallbacks'))
          .toEqual(defaults.helpCenter.localeFallbacks);
      });
    });

    it('returns a value if it exists in the store', () => {
      expect(settings.get('authenticate'))
        .toEqual('foo');
    });

    it('returns null if a value does not exist in the store', () => {
      mockRegistry['utility/globals'].win.zESettings = { webWidget: {} };
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual(null);
    });

    it('returns a value for a nested param if it exists in the store', () => {
      mockRegistry['utility/globals'].win.zESettings = { webWidget: { contactForm: { attachments: 'foo' } } };
      settings.init();

      expect(settings.get('contactForm.attachments'))
        .toEqual('foo');
    });
  });

  describe('#getTranslations', () => {
    beforeEach(() => {
      mockRegistry['utility/globals'].win.zESettings = {
        webWidget: {
          helpCenter: {
            title: {
              '*': 'help center title',
              'en-US': 'why?'
            },
            messageButton: {
              'en-US': 'Yo',
              'fr': ':('
            }
          }
        }
      };

      settings.init();
    });

    it('returns the translations', () => {
      expect(settings.getTranslations())
        .toEqual({
          helpCenterTitle: {
            '*': 'help center title',
            'en-US': 'why?'
          },
          helpCenterMessageButton: {
            'en-US': 'Yo',
            'fr': ':('
          }
        });
    });
  });

  describe('#getTrackSettings', () => {
    let userSettings;

    beforeEach(() => {
      userSettings = {
        webWidget: {
          authenticate: { jwt: 'abc' },
          contactForm: {
            attachments: true
          },
          helpCenter: { originalArticleButton: false }
        }
      };

      mockRegistry['utility/globals'].win.zESettings = userSettings;
      settings.init();
    });

    it('returns a web Widget Object', () => {
      expect(settings.getTrackSettings().webWidget)
        .toBeDefined();
    });

    it('should filter out unwanted values from the store', () => {
      expect(settings.getTrackSettings().webWidget.margin)
        .toBeUndefined();

      expect(settings.getTrackSettings().webWidget.viaId)
        .toBeUndefined();
    });

    it('should filter out default values from the store', () => {
      expect(settings.getTrackSettings().webWidget.contactForm)
        .toBeUndefined();
    });

    it('should not filter out custom values from the store', () => {
      userSettings.webWidget.authenticate = true;
      _.unset(userSettings, 'webWidget.contactForm');

      expect(settings.getTrackSettings())
        .toEqual(userSettings);
    });

    it('should filter out empty objects', () => {
      mockRegistry['utility/globals'].win.zESettings.emptyThing = {};
      settings.init();

      expect(settings.getTrackSettings().emptyThing)
        .toBeUndefined();
    });
  });

  describe('#getSupportAuthSettings', () => {
    let mockSettings,
      supportAuthSettings;

    beforeEach(() => {
      mockSettings = {
        webWidget: {
          authenticate: {
            support: { jwt: 'abc' }
          }
        }
      };

      mockRegistry['utility/globals'].win.zESettings = mockSettings;
      settings.init();
      supportAuthSettings = settings.getSupportAuthSettings();
    });

    describe('when authenticate is defined', () => {
      describe('when authenticate.support is defined', () => {
        describe('when jwt property is defined', () => {
          it('returns the auth settings', () => {
            expect(supportAuthSettings)
              .toEqual({ jwt: 'abc' });
          });
        });

        describe('when jwt property is not defined', () => {
          beforeEach(() => {
            mockSettings.webWidget.authenticate.support = {};
            mockRegistry['utility/globals'].win.zESettings = mockSettings;
            settings.init();

            supportAuthSettings = settings.getSupportAuthSettings();
          });

          describe('when authenticate.jwt property is defined', () => {
            beforeEach(() => {
              mockSettings.webWidget.authenticate.jwt = 'abc';
              mockRegistry['utility/globals'].win.zESettings = mockSettings;
              settings.init();

              supportAuthSettings = settings.getSupportAuthSettings();
            });

            it('returns the auth settings', () => {
              expect(supportAuthSettings)
                .toEqual(jasmine.objectContaining({ jwt: 'abc' }));
            });
          });

          describe('when jwt property is not defined', () => {
            it('returns null', () => {
              expect(supportAuthSettings)
                .toBeNull();
            });
          });
        });
      });

      describe('when authenticate.support is not defined', () => {
        describe('when jwt property is defined', () => {
          beforeEach(() => {
            mockSettings.webWidget.authenticate = { jwt: 'abc' };
            mockRegistry['utility/globals'].win.zESettings = mockSettings;
            settings.init();

            supportAuthSettings = settings.getSupportAuthSettings();
          });

          it('returns the auth settings', () => {
            expect(supportAuthSettings)
              .toEqual({ jwt: 'abc' });
          });
        });

        describe('when jwt property is not defined', () => {
          beforeEach(() => {
            mockSettings.webWidget.authenticate = {};
            mockRegistry['utility/globals'].win.zESettings = mockSettings;
            settings.init();

            supportAuthSettings = settings.getSupportAuthSettings();
          });

          it('returns null', () => {
            expect(supportAuthSettings)
              .toBeNull();
          });
        });
      });
    });

    describe('when authenticate is not defined', () => {
      beforeEach(() => {
        mockSettings.webWidget = {};
        mockRegistry['utility/globals'].win.zESettings = mockSettings;
        settings.init();

        supportAuthSettings = settings.getSupportAuthSettings();
      });

      it('returns null', () => {
        expect(supportAuthSettings)
          .toBeNull();
      });
    });
  });

  describe('#getChatAuthSettings', () => {
    let mockSettings,
      chatAuthSettings;

    describe('when authenticate.chat is defined', () => {
      beforeEach(() => {
        mockSettings = {
          webWidget: {
            authenticate: {
              chat: { jwtFn: () => {} }
            }
          }
        };

        mockRegistry['utility/globals'].win.zESettings = mockSettings;
        settings.init();

        chatAuthSettings = settings.getChatAuthSettings();
      });

      describe('when jwtFn property is defined', () => {
        it('returns the auth object', () => {
          expect(chatAuthSettings)
            .toEqual({ jwtFn: jasmine.any(Function) });
        });
      });

      describe('when jwtFn property is not defined', () => {
        beforeEach(() => {
          mockSettings.webWidget.authenticate.chat = {};
          mockRegistry['utility/globals'].win.zESettings = mockSettings;
          settings.init();

          chatAuthSettings = settings.getChatAuthSettings();
        });

        it('returns null', () => {
          expect(chatAuthSettings)
            .toBeNull();
        });
      });
    });

    describe('when authenticate.chat is not defined', () => {
      beforeEach(() => {
        mockSettings.webWidget.authenticate = {};
        mockRegistry['utility/globals'].win.zESettings = mockSettings;
        settings.init();

        chatAuthSettings = settings.getChatAuthSettings();
      });

      it('returns null', () => {
        expect(chatAuthSettings)
          .toBeNull();
      });
    });
  });
});
