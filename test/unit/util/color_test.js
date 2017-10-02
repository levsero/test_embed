import Color from 'color';

describe('color', () => {
  let generateUserCSS,
    generateWebWidgetPreviewCSS,
    validSettingsColor,
    mockSettingsValue;

  const colorPath = buildSrcPath('util/color');
  const trimWhitespace = (str) => {
    return _.chain(str.split('\n'))
            .map(_.trim)
            .toString()
            .value();
  };

  beforeEach(() => {
    resetDOM();

    mockSettingsValue = null;

    mockery.enable();

    initMockRegistry({
      'service/settings': {
        settings: {
          get: () => mockSettingsValue
        }
      },
      'color': Color
    });

    generateUserCSS = require(colorPath).generateUserCSS;
    generateWebWidgetPreviewCSS = require(colorPath).generateWebWidgetPreviewCSS;
    validSettingsColor = require(colorPath).validSettingsColor;
  });

  afterEach(() => {
    mockery.deregisterAll();
    mockery.disable();
  });

  describe('generateUserCSS', () => {
    it('uses the default value if nothing is passed in', () => {
      expect(generateUserCSS())
        .toMatch('#78A300');
    });

    it('uses the value passed into the function if it exists', () => {
      expect(generateUserCSS('#ffffff'))
        .toMatch('#ffffff');
    });

    it('uses the value in zESettings if it exists', () => {
      mockSettingsValue = '#aaaaaa';
      const cssString = generateUserCSS('#ffffff');

      expect(cssString)
        .not.toMatch('#ffffff');

      expect(cssString)
        .toMatch('#aaaaaa');
    });

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
          color: #227C7B !important;
          background-color: transparent !important;
          border-color: #227C7B !important;
        }
        .u-userBorderColor:not([disabled]):hover,
        .u-userBorderColor:not([disabled]):active,
        .u-userBorderColor:not([disabled]):focus {
          color: black !important;
          background-color: #187C7B !important;
          border-color: #187C7B !important;
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
          color: white !important;
          background-color: transparent !important;
          border-color: white !important;
        }
        .u-userBorderColor:not([disabled]):hover,
        .u-userBorderColor:not([disabled]):active,
        .u-userBorderColor:not([disabled]):focus {
          color: black !important;
          background-color: #253241 !important;
          border-color: #253241 !important;
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
        color: #6E6E6E !important;
        background-color: transparent !important;
        border-color: white !important;
      }
      .u-userBorderColor:not([disabled]):hover,
      .u-userBorderColor:not([disabled]):active,
      .u-userBorderColor:not([disabled]):focus {
        color: black !important;
        background-color: #696969 !important;
        border-color: #696969 !important;
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

  describe('validSettingsColor', () => {
    it('allows valid hex values', () => {
      mockSettingsValue = '#aaaaaa';

      expect(validSettingsColor())
        .not.toBeNull();

      mockSettingsValue = '#eee';

      expect(validSettingsColor())
        .not.toBeNull();

      mockSettingsValue = '#AEAEAE';

      expect(validSettingsColor())
        .not.toBeNull();
    });

    it('wont allow non valid hex values', () => {
      mockSettingsValue = '#aaaa';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = '#hhh';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = '#638927384';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = 'eee';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = '0xFFFFFF';

      expect(validSettingsColor())
        .toBeNull();

      mockSettingsValue = 'rgb(255,123,123)';

      expect(validSettingsColor())
        .toBeNull();
    });
  });
});
