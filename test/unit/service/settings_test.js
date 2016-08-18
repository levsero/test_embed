describe('settings', () => {
  let settings,
    mockRegistry;
  const settingsPath = buildSrcPath('service/settings');

  beforeEach(() => {
    mockery.enable();
    mockRegistry = initMockRegistry({
      'utility/globals': {
        win: {
          zESettings: {}
        }
      }
    });
    mockery.registerAllowable(settingsPath);
    settings = requireUncached(settingsPath).settings;
  });

  describe('store', () => {
    describe('webWidget defaults', () => {
      let defaults;

      beforeEach(() => {
        defaults = {
          contactForm: {
            attachments: true
          },
          helpCenter: {
            originalArticleButton: true
          },
          margin: 15,
          offset: { horizontal: 0, vertical: 0 },
          viaId: 48
        };
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
    });

    describe('ipm defaults', () => {
      it('has the correct value for offset', () => {
        expect(settings.get('offset'))
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
  });

  describe('#get', () => {
    it('should return a value if it exists in the store', () => {
      mockRegistry['utility/globals'].win.zESettings = { webWidget: { authenticate: 'foo' } };
      settings.init();

      expect(settings.get('authenticate'))
        .toEqual('foo');
    });

    it('should return null if a value does not exist in the store', () => {
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
        ipm: { offset: 'foo' },
        webWidget: { offset: 'bar' }
      };
      settings.init();

      expect(settings.get('offset', 'ipm'))
        .toEqual('foo');
      expect(settings.get('offset'))
        .toEqual('bar');
    });
  });

  describe('#getTrackSettings', () => {
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
  });
});
