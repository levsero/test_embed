describe('styles', () => {
  let generateUserWidgetCSS,
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
      'constants/shared': {
        FONT_SIZE: 14
      },
      'service/settings': {
        settings: {
          get: (name) => _.get(mockSettingsValue, name, null)
        }
      }
    });

    generateUserWidgetCSS = requireUncached(stylesPath).generateUserWidgetCSS;
    generateWebWidgetPreviewCSS = require(stylesPath).generateWebWidgetPreviewCSS;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('generateUserWidgetCSS', () => {
    describe('when the color is light', () => {
      let css;

      beforeEach(() => {
        css = generateUserWidgetCSS('#58F9F7');
      });

      describe('u-userTextColor', () => {
        const expectedCss = `
        .u-userTextColor:not([disabled]) {
          color: #186766 !important;
          fill: #186766 !important;
        }
        .u-userTextColor:not([disabled]):hover,
        .u-userTextColor:not([disabled]):active,
        .u-userTextColor:not([disabled]):focus {
          color: #1A7170 !important;
          fill: #1A7170 !important;
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
          color: #186766 !important;
        }
        .u-userBackgroundColor:not([disabled]):hover,
        .u-userBackgroundColor:not([disabled]):active,
        .u-userBackgroundColor:not([disabled]):focus {
          background-color: #27F7F5 !important;
        }`;

        it('is calculated to a darker color', () => {
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
          color: #186766 !important;
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
          color: #186766 !important;
        }`;

        it('is calculated to the same color with a darker text color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderButtonColor', () => {
        const expectedCss = `
        .u-userHeaderButtonColor {
          fill: #186766 !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #27F7F5 !important;
          svg {
            background: #27F7F5 !important;
          }
        }`;

        it('is calculated to the same color with a darker text color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderButtonColorMobile', () => {
        const expectedCss = `
        .u-userHeaderButtonColorMobile {
          fill: #186766 !important;
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
        css = generateUserWidgetCSS('#283646');
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
          color: #2C3B4D !important;
          fill: #2C3B4D !important;
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
          color: #FFFFFF !important;
        }
        .u-userBackgroundColor:not([disabled]):hover,
        .u-userBackgroundColor:not([disabled]):active,
        .u-userBackgroundColor:not([disabled]):focus {
          background-color: #2C3B4D !important;
        }`;

        it('is calculated to the same colot with a highlight', () => {
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
          color: #FFFFFF !important;
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
          color: #FFFFFF !important;
        }`;

        it('is calculated to the same color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderButtonColor', () => {
        const expectedCss = `
        .u-userHeaderButtonColor {
          fill: #FFFFFF !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #2C3B4D !important;
          svg {
            background: #2C3B4D !important;
          }
        }`;

        it('is calculated to the same color', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderButtonColorMobile', () => {
        const expectedCss = `
        .u-userHeaderButtonColorMobile {
          fill: #FFFFFF !important;
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
          color: #FFFFFF !important;
        }`;

        it('prefers the button colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            button: '#DC143C'
          }};

          css = generateUserWidgetCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userBackgroundColor:not([disabled]) {
          background-color: #FF69B4 !important;
          color: #63163D !important;
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            button: '#YOYOYO'
          }};

          css = generateUserWidgetCSS();

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
          color: #FFFFFF !important;
        }
        .u-userHeaderButtonColor {
          fill: #FFFFFF !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #5E7634 !important;
          svg {
            background: #5E7634 !important;
          }
        }
        .u-userHeaderButtonColorMobile {
          fill: #FFFFFF !important;
        }`;

        it('prefers the header colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            header: '#556B2F'
          }};

          css = generateUserWidgetCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userHeaderColor {
          background: #FF69B4 !important;
          color: #63163D !important;
        }
        .u-userHeaderButtonColor {
          fill: #63163D !important;
        }
        .u-userHeaderButtonColor:hover,
        .u-userHeaderButtonColor:active,
        .u-userHeaderButtonColor:focus {
          background: #FF3399 !important;
          svg {
            background: #FF3399 !important;
          }
        }
        .u-userHeaderButtonColorMobile {
          fill: #63163D !important;
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            header: '#JUJAJU'
          }};

          css = generateUserWidgetCSS();

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

          css = generateUserWidgetCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userLinkColor a {
          color: #63163D !important;
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            articleLinks: '#MOOMOO'
          }};

          css = generateUserWidgetCSS();

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
          color: #27764A !important;
          fill: #27764A !important;
        }`;

        it('prefers the link colour over the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            resultLists: '#2E8B57'
          }};

          css = generateUserWidgetCSS();

          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('and the override is invalid or undefined', () => {
        const expectedCss = `
        .u-userTextColor:not([disabled]) {
          color: #63163D !important;
          fill: #63163D !important;
        }
        .u-userTextColor:not([disabled]):hover,
        .u-userTextColor:not([disabled]):active,
        .u-userTextColor:not([disabled]):focus {
          color: #6D1843 !important;
          fill: #6D1843 !important;
        }`;

        it('falls back to the base colour', () => {
          mockSettingsValue = { color: {
            theme: baseThemeColor,
            links: '#SNOOPD'
          }};

          css = generateUserWidgetCSS();

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
      css = generateUserWidgetCSS('#FFFFFF');
    });

    describe('u-userTextColor', () => {
      const expectedCss = `
      .u-userTextColor:not([disabled]) {
        color: #6F6F6F !important;
        fill: #6F6F6F !important;
      }
      .u-userTextColor:not([disabled]):hover,
      .u-userTextColor:not([disabled]):active,
      .u-userTextColor:not([disabled]):focus {
        color: #5E5E5E !important;
        fill: #5E5E5E !important;
      }`;

      it('is calculated to a darker color with a highlight', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userBackgroundColor', () => {
      const expectedCss = `
      .u-userBackgroundColor:not([disabled]) {
        background-color: #FFFFFF !important;
        color: #6F6F6F !important;
      }
      .u-userBackgroundColor:not([disabled]):hover,
      .u-userBackgroundColor:not([disabled]):active,
      .u-userBackgroundColor:not([disabled]):focus {
        background-color: #D9D9D9 !important;
      }`;

      it('is calculated to white and neutral grey for color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userBorderColor', () => {
      const expectedCss = `
      .u-userBorderColor:not([disabled]) {
        color: #FFFFFF !important;
        background-color: transparent !important;
        border-color: #FFFFFF !important;
      }
      .u-userBorderColor:not([disabled]):hover,
      .u-userBorderColor:not([disabled]):active,
      .u-userBorderColor:not([disabled]):focus {
        color: #6F6F6F !important;
        background-color: #FFFFFF !important;
        border-color: #FFFFFF !important;
      }`;

      it('is calculated to a lighter color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userHeaderColor', () => {
      const expectedCss = `
      .u-userHeaderColor {
        background: #FFFFFF !important;
        color: #6F6F6F !important;
      }`;

      it('is calculated to the color with a highlight', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });
  });

  describe('generateWebWidgetPreviewCSS', () => {
    let css;

    beforeEach(() => {
      css = generateWebWidgetPreviewCSS('#58F9F7');
    });

    describe('u-userHeaderColor', () => {
      const expectedCss = `
      .u-userHeaderColor {
        background: #58F9F7 !important;
        color: #186766 !important;
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
        color: #186766 !important;
      }`;

      it('is calculated to the same colot with a highlight', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userHeaderButtonColor', () => {
      const expectedCss = `
      .u-userHeaderButtonColor:focus {
        background: #27F7F5 !important;
        svg {
          background: #27F7F5 !important;
        }
      }`;

      it('is calculated to the same color with a darker text color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    it('uses the value passed into the function', () => {
      expect(css)
        .toMatch('#58F9F7');
    });
  });
});
