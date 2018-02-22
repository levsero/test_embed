describe('Colour Validation Utilities', () => {
  let validate,
    mockSettingsValue;

  const validatePath = buildSrcPath('util/color/validate');

  beforeEach(() => {
    mockSettingsValue = null;

    mockery.enable();

    initMockRegistry({
      'service/settings': {
        settings: {
          get: (name) => _.get(mockSettingsValue, name, null)
        }
      }
    });

    validate = requireUncached(validatePath);
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('defaultColor', () => {
    it('is the colour we specify', () => {
      expect(validate.defaultColor).toEqual('#78A300');
    });
  });

  describe('themeColor', () => {
    describe('with settings', () => {
      it('allows valid hex values from the settings', () => {
        mockSettingsValue = { color: { theme: '#aaaaaa' } };

        expect(validate.themeColor())
          .not.toBeNull();

        mockSettingsValue = { color: { theme: '#eee' } };

        expect(validate.themeColor())
          .not.toBeNull();

        mockSettingsValue = { color: { theme: '#AEAEAE' } };

        expect(validate.themeColor())
          .not.toBeNull();
      });

      describe('and a base colour', () => {
        it('prioritises the settings colour over the base one', () => {
          mockSettingsValue = { color: { theme: '#eeddff' } };

          expect(validate.themeColor('#ffaabb'))
            .toEqual('#eeddff');
        });
      });

      describe('that are not normalised', () => {
        it('normalises the settings colour and returns it', () => {
          mockSettingsValue = { color: { theme: '45efcb' } };

          expect(validate.themeColor())
            .toEqual('#45efcb');
        });
      });

      describe('that are malformed or invalid', () => {
        describe('and a base colour', () => {
          it('prefers the base colour and returns it', () => {
            mockSettingsValue = { color: { theme: '#OMGWFTBBQ' } };

            expect(validate.themeColor('#efac23'))
              .toEqual('#efac23');
          });
        });

        describe('and without a base colour', () => {
          it('returns null', () => {
            mockSettingsValue = { color: { theme: '#OMGWFTBBQ' } };

            expect(validate.themeColor())
              .toEqual(null);
          });

          const testColors = ['#aaaa', '#hhh', '#638927384', '0xFFFFFF', 'rgb(255,123,123)'];

          _.forEach(testColors, (testColor) => {
            it(`won't allow an invalid value (i.e., ${testColor}) and returns null`, () => {
              mockSettingsValue = { color: { theme: testColor } };
              expect(validate.themeColor())
                .toEqual(null);
            });
          });
        });
      });
    });

    describe('without settings', () => {
      describe('with a base colour', () => {
        describe('with a valid base colour', () => {
          it('prefers the base colour and returns it', () => {
            mockSettingsValue = null;

            expect(validate.themeColor('#eb67a2'))
              .toEqual('#eb67a2');
          });
        });

        describe('with an invalid base colour', () => {
          it('returns null', () => {
            mockSettingsValue = null;

            expect(validate.themeColor('#OMGWFTBBQ'))
              .toEqual(null);
          });
        });
      });

      describe('without a base colour', () => {
        it('returns null', () => {
          mockSettingsValue = null;

          expect(validate.themeColor())
            .toEqual(null);
        });
      });
    });
  });

  describe('colorFor', () => {
    describe('with valid settings', () => {
      describe('and a fallback', () => {
        it('prefers the settings value over the fallback', () => {
          mockSettingsValue = { color: { theme: '#45eb1d' } };

          expect(validate.colorFor('theme', '#56ad20'))
            .toEqual('#45eb1d');
        });
      });

      describe('and without a fallback', () => {
        it('returns the settings value', () => {
          mockSettingsValue = { color: { header: '#6abc28' } };

          expect(validate.colorFor('header'))
            .toEqual('#6abc28');
        });
      });
    });

    describe('with un-normalised settings', () => {
      it('normalises the settings value and returns it', () => {
        mockSettingsValue = { color: { theme: '7cbda2' } };

        expect(validate.colorFor('theme'))
          .toEqual('#7cbda2');
      });
    });

    describe('with invalid settings', () => {
      describe('and a fallback', () => {
        it('uses the fallback', () => {
          mockSettingsValue = { color: { theme: '#llanllwni' } };

          expect(validate.colorFor('setting', '#41dcb1'))
            .toEqual('#41dcb1');
        });
      });

      describe('and without a fallback', () => {
        it('returns null', () => {
          mockSettingsValue = { color: { theme: '#llanddewibrefi' } };

          expect(validate.colorFor('anotherSetting'))
            .toBeNull();
        });
      });
    });

    describe('without settings', () => {
      describe('and a fallback', () => {
        it('uses the fallback', () => {
          mockSettingsValue = null;

          expect(validate.colorFor('setting', '#31acb6'))
            .toEqual('#31acb6');
        });
      });

      describe('and without a fallback', () => {
        it('returns null', () => {
          mockSettingsValue = null;

          expect(validate.colorFor('anotherSetting'))
            .toBeNull();
        });
      });
    });
  });
});
