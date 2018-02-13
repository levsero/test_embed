describe('styles', () => {
  let generateUserCSS,
    generateWebWidgetPreviewCSS,
    mockSettingsValue;

  const baseThemeColor = '#FF69B4';
  const stylesPath = buildSrcPath('util/color/styles');
  const trimWhitespace = (str) => {
    return _.chain(str.split('\n'))
            .map(_.trim)
            .toString()
            .value();
  };

  beforeEach(() => {
    mockery.enable();

    initMockRegistry({
      'service/settings': {
        settings: {
          get: (name) => _.get(mockSettingsValue, name, null)
        }
      }
    });

    generateUserCSS = requireUncached(stylesPath).generateUserCSS;
    generateWebWidgetPreviewCSS = require(stylesPath).generateWebWidgetPreviewCSS;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('generateUserCSS', () => {
    describe('when the color is light', () => {
      let css;

      beforeEach(() => {
        css = generateUserCSS('#58F9F7');
      });

      describe('u-userTextColor', () => {
        const expectedCss = `
        .u-userTextColor:not([disabled]) {
          color: #1A8987 !important;
          fill: #1A8987 !important;
        }
        .u-userTextColor:not([disabled]):hover,
        .u-userTextColor:not([disabled]):active,
        .u-userTextColor:not([disabled]):focus {
          color: #187C7B !important;
          fill: #187C7B !important;
        }`;

        it('is calculated to a darker color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userBackgroundColor', () => {
        const expectedCss = `
        .u-userBackgroundColor:not([disabled]) {
          background-color: #58F9F7 !important;
          color: #227C7B !important;
        }
        .u-userBackgroundColor:not([disabled]):hover,
        .u-userBackgroundColor:not([disabled]):active,
        .u-userBackgroundColor:not([disabled]):focus {
          background-color: #35F8F4 !important;
        }`;

        it('is calculated to a darker color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userLauncherColor', () => {
        const expectedCss = `
        .u-userLauncherColor:not([disabled]) {
          background-color: #58F9F7 !important;
          color: #227C7B !important;
          fill: #227C7B !important;
          svg {
            color: #227C7B !important;
            fill: #227C7B !important;
          }
        }
        .u-launcherColor:not([disabled]):hover {
          background-color: #35F8F4 !important;
        }`;

        it('is calculated to the same color with a darker text color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userBorderColor', () => {
        const expectedCss = `
        .u-userBorderColor:not([disabled]) {
          color: #58F9F7 !important;
          background-color: transparent !important;
          border-color: #58F9F7 !important;
        }
        .u-userBorderColor:not([disabled]):hover,
        .u-userBorderColor:not([disabled]):active,
        .u-userBorderColor:not([disabled]):focus {
          color: #227C7B !important;
          background-color: #58F9F7 !important;
          border-color: #58F9F7 !important;
        }`;

        it('is calculated to a darker color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderColor', () => {
        const expectedCss = `
        .u-userHeaderColor {
          background: #58F9F7 !important;
          color: #227C7B !important;
        }`;

        it('is calculated to the same color with a darker text color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderButtonColor', () => {
        const expectedCss = `
        .u-userHeaderButtonColor {
          fill: #227C7B !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #35F8F4 !important;
          svg {
            background: #35F8F4 !important;
          }
        }`;

        it('is calculated to the same color with a darker text color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });

    describe('when the color is not light', () => {
      let css;

      beforeEach(() => {
        css = generateUserCSS('#283646');
      });

      describe('u-userTextColor', () => {
        const expectedCss = `
        .u-userTextColor:not([disabled]) {
          color: #283646 !important;
          fill: #283646 !important;
        }
        .u-userTextColor:not([disabled]):hover,
        .u-userTextColor:not([disabled]):active,
        .u-userTextColor:not([disabled]):focus {
          color: #253241 !important;
          fill: #253241 !important;
        }`;

        it('is calculated to the same color with a highlight', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userBackgroundColor', () => {
        const expectedCss = `
        .u-userBackgroundColor:not([disabled]) {
          background-color: #283646 !important;
          color: white !important;
        }
        .u-userBackgroundColor:not([disabled]):hover,
        .u-userBackgroundColor:not([disabled]):active,
        .u-userBackgroundColor:not([disabled]):focus {
          background-color: #253241 !important;
        }`;

        it('is calculated to the same colot with a highlight', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userLauncherColor', () => {
        const expectedCss = `
        .u-userLauncherColor:not([disabled]) {
          background-color: #283646 !important;
          color: white !important;
          fill: white !important;
          svg {
            color: white !important;
            fill: white !important;
          }
        }
        .u-launcherColor:not([disabled]):hover {
          background-color: #253241 !important;
        }`;

        it('is calculated to the same color with a white highlight', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userBorderColor', () => {
        const expectedCss = `
        .u-userBorderColor:not([disabled]) {
          color: #283646 !important;
          background-color: transparent !important;
          border-color: #283646 !important;
        }
        .u-userBorderColor:not([disabled]):hover,
        .u-userBorderColor:not([disabled]):active,
        .u-userBorderColor:not([disabled]):focus {
          color: white !important;
          background-color: #283646 !important;
          border-color: #283646 !important;
        }`;

        it('is calculated to white with a highlight', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderColor', () => {
        const expectedCss = `
        .u-userHeaderColor {
          background: #283646 !important;
          color: white !important;
        }`;

        it('is calculated to the same color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderButtonColor', () => {
        const expectedCss = `
        .u-userHeaderButtonColor {
          fill: white !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #253241 !important;
          svg {
            background: #253241 !important;
          }
        }`;

        it('is calculated to the same color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });
  });

  describe('when overriding with zESettings', () => {
    let css;

    describe('when overriding button colours', () => {
      describe('and the override is valid', () => {
        const expectedCss = `
        .u-userBackgroundColor:not([disabled]) {
          background-color: #DC143C !important;
          color: white !important;
        }`;

        it('prefers the button colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            button: '#DC143C'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userBackgroundColor:not([disabled]) {
          background-color: #FF69B4 !important;
          color: white !important;
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            button: '#YOYOYO'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });

    describe('when overriding header colours', () => {
      describe('and the override is valid', () => {
        const expectedCss = `
        .u-userHeaderColor {
          background: #556B2F !important;
          color: white !important;
        }
        .u-userHeaderButtonColor {
          fill: white !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #4C602A !important;
          svg {
            background: #4C602A !important;
          }
        }`;

        it('prefers the header colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            header: '#556B2F'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userHeaderColor {
          background: #FF69B4 !important;
          color: white !important;
        }
        .u-userHeaderButtonColor {
          fill: white !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #FF47A3 !important;
          svg {
            background: #FF47A3 !important;
          }
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            header: '#JUJAJU'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });

    describe('when overriding launcher colours', () => {
      describe('and the override is valid', () => {
        const expectedCss = `
        .u-userLauncherColor:not([disabled]) {
          background-color: #FFD700 !important;
          color: #6C5F13 !important;
          fill: #6C5F13 !important;
          svg {
            color: #6C5F13 !important;
            fill: #6C5F13 !important;
          }
        }`;

        it('prefers the launcher colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            launcher: '#FFD700'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userLauncherColor:not([disabled]) {
          background-color: #FF69B4 !important;
          color: white !important;
          fill: white !important;
          svg {
            color: white !important;
            fill: white !important;
          }
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            launcher: '#SARASA'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });

    describe('when overriding link colours', () => {
      describe('and the override is valid', () => {
        const expectedCss = `
        .u-userLinkColor a {
          color: #6B8E23 !important;
        }`;

        it('prefers the link colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            articleLinks: '#6B8E23'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userLinkColor a {
          color: #FF69B4 !important;
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            articleLinks: '#MOOMOO'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });

    describe('when overriding list colours', () => {
      describe('and the override is valid', () => {
        const expectedCss = `
        .u-userTextColor:not([disabled]) {
          color: #2E8B57 !important;
          fill: #2E8B57 !important;
        }
        .u-userTextColor:not([disabled]):hover,
        .u-userTextColor:not([disabled]):active,
        .u-userTextColor:not([disabled]):focus {
          color: #297A4C !important;
          fill: #297A4C !important;
        }`;

        it('prefers the link colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            resultLists: '#2E8B57'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userTextColor:not([disabled]) {
          color: #FF69B4 !important;
          fill: #FF69B4 !important;
        }
        .u-userTextColor:not([disabled]):hover,
        .u-userTextColor:not([disabled]):active,
        .u-userTextColor:not([disabled]):focus {
          color: #FF47A3 !important;
          fill: #FF47A3 !important;
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            links: '#SNOOPD'
          }};

          css = generateUserCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });

    afterAll(() => {
      mockSettingsValue = null;
    });
  });

  describe('when the color is extremely light (white or almost white)', () => {
    let css;

    beforeEach(() => {
      css = generateUserCSS('#FFFFFF');
    });

    describe('u-userTextColor', () => {
      const expectedCss = `
      .u-userTextColor:not([disabled]) {
        color: #737373 !important;
        fill: #737373 !important;
      }
      .u-userTextColor:not([disabled]):hover,
      .u-userTextColor:not([disabled]):active,
      .u-userTextColor:not([disabled]):focus {
        color: #696969 !important;
        fill: #696969 !important;
      }`;

      it('is calculated to a darker color with a highlight', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userBackgroundColor', () => {
      const expectedCss = `
      .u-userBackgroundColor:not([disabled]) {
        background-color: #777 !important;
        color: white !important;
      }
      .u-userBackgroundColor:not([disabled]):hover,
      .u-userBackgroundColor:not([disabled]):active,
      .u-userBackgroundColor:not([disabled]):focus {
        background-color: #6B6B6B !important;
      }`;

      it('is calculated to #777 and white for color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userLauncherColor', () => {
      const expectedCss = `
      .u-userLauncherColor:not([disabled]) {
        background-color: #FFFFFF !important;
        color: #6E6E6E !important;
        fill: #6E6E6E !important;
        svg {
          color: #6E6E6E !important;
          fill: #6E6E6E !important;
        }
      }
      .u-launcherColor:not([disabled]):hover {
        background-color: #E6E6E6 !important;
      }`;

      it('is calculated to the same color with a darker text and highlight color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userBorderColor', () => {
      const expectedCss = `
      .u-userBorderColor:not([disabled]) {
        color: #777 !important;
        background-color: transparent !important;
        border-color: #777 !important;
      }
      .u-userBorderColor:not([disabled]):hover,
      .u-userBorderColor:not([disabled]):active,
      .u-userBorderColor:not([disabled]):focus {
        color: white !important;
        background-color: #777 !important;
        border-color: #777 !important;
      }`;

      it('is calculated to a darker color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userHeaderColor', () => {
      const expectedCss = `
      .u-userHeaderColor {
        background: #FFFFFF !important;
        color: #6E6E6E !important;
      }`;

      it('is calculated to the color with a highlight', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });
  });

  describe('generateWebWidgetPreviewCSS', () => {
    it('uses the value passed into the function', () => {
      expect(generateWebWidgetPreviewCSS('#ffffff'))
        .toMatch('#ffffff');
    });
  });
});
