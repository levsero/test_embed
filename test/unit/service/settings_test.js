describe('settings', () => {
  let settings,
    mockRegistry,
    defaults;
  const settingsPath = buildSrcPath('service/settings');
  const maxLocaleFallbacks = 3;

  beforeEach(() => {
    mockery.enable();
    mockRegistry = initMockRegistry({
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
      contactForm: {
        subject: false,
        attachments: true,
        ticketForms: [],
        tags: []
      },
      channelChoice: false,
      expanded: false,
      helpCenter: {
        originalArticleButton: true,
        localeFallbacks: []
      },
      margin: 15,
      offset: { horizontal: 0, vertical: 0 },
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

      it('has the correct value for channelChoice', () => {
        expect(settings.get('channelChoice'))
          .toEqual(defaults.channelChoice);
      });

      it('has the correct value for expanded', () => {
        expect(settings.get('expanded'))
          .toEqual(defaults.expanded);
      });

      it('has the correct value for zIndex', () => {
        expect(settings.get('zIndex'))
          .toEqual(defaults.zIndex);
      });
    });

    describe('ipm defaults', () => {
      beforeEach(() => {
        settings.init();
      });

      it('has the correct value for offset', () => {
        settings.init();

        expect(settings.get('offset', 'ipm'))
          .toEqual({ horizontal: 0, vertical: 0 });
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
  });

  describe('#get', () => {
    beforeEach(() => {
      mockRegistry['utility/globals'].win.zESettings = {
        webWidget: {
          authenticate: 'foo',
          contactForm: {
            subject: true
          },
          channelChoice: true,
          helpCenter: {
            originalArticleButton: false,
            suppress: true,
            localeFallbacks: ['fr']
          },
          chat: {
            suppress: true
          },
          color: {
            theme: '#FF0000'
          }
        }
      };

      settings.init();
    });

    it('should return user setting for helpCenter.originalArticleButton', () => {
      expect(settings.get('helpCenter.originalArticleButton'))
        .toBe(false);
    });

    it('should return user setting for suppress', () => {
      expect(settings.get('helpCenter.suppress'))
        .toBe(true);

      expect(settings.get('chat.suppress'))
        .toBe(true);
    });

    it('should return user setting for color', () => {
      expect(settings.get('color.theme'))
        .toBe('#FF0000');
    });

    it('should return user setting for contactForm.subject', () => {
      expect(settings.get('contactForm.subject'))
        .toBe(true);
    });

    describe('when web widget customisations are enabled', () => {
      beforeEach(() => {
        settings.init();
        settings.enableCustomizations();
      });
      it('should return user setting for channelChoice', () => {
        expect(settings.get('channelChoice'))
          .toBe(true);
      });

      it('should return user setting for helpCenter.localeFallbacks', () => {
        expect(settings.get('helpCenter.localeFallbacks'))
          .toEqual(['fr']);
      });
    });

    describe('when web widget customisations are disabled', () => {
      it('should return default setting for channelChoice', () => {
        expect(settings.get('channelChoice'))
          .toBe(defaults.channelChoice);
      });

      it('should return user default for helpCenter.localeFallbacks', () => {
        expect(settings.get('helpCenter.localeFallbacks'))
          .toEqual(defaults.helpCenter.localeFallbacks);
      });
    });

    it('should return a value if it exists in the store', () => {
      expect(settings.get('authenticate'))
        .toEqual('foo');
    });

    it('should return null if a value does not exist in the store', () => {
      mockRegistry['utility/globals'].win.zESettings = { webWidget: {} };
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual(null);
    });

    it('should return a value for a nested param if it exists in the store', () => {
      mockRegistry['utility/globals'].win.zESettings = { webWidget: { contactForm: { attachments: 'foo' } } };
      settings.init();

      expect(settings.get('contactForm.attachments'))
        .toEqual('foo');
    });

    it('should be able to get things from different stores', () => {
      mockRegistry['utility/globals'].win.zESettings = {
        ipm: {
          offset: {
            horizontal: 10,
            vertical: 10
          }
        },
        webWidget: {
          offset: {
            horizontal: 20,
            vertical: 20
          }
        }
      };
      settings.init();
      settings.enableCustomizations();

      expect(settings.get('offset', 'ipm'))
        .toEqual({ horizontal: 10, vertical: 10 });
      expect(settings.get('offset', 'webWidget'))
        .toEqual({ horizontal: 20, vertical: 20 });
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

    it('should return the translations', () => {
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
        },
        ipm: {
          offset: {
            horizontal: 1,
            vertical: 1
          }
        }
      };

      mockRegistry['utility/globals'].win.zESettings = userSettings;
      settings.init();
    });

    it('should return a web Widget Object', () => {
      expect(settings.getTrackSettings().webWidget)
        .toBeDefined();
    });

    it('should return a ipm Object', () => {
      expect(settings.getTrackSettings().ipm)
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
      mockRegistry['utility/globals'].win.zESettings.ipm = {};
      settings.init();

      expect(settings.getTrackSettings().ipm)
        .toBeUndefined();
    });
  });
});
