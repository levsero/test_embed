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

    describe('if the color is light', () => {
      let css;

      beforeEach(() => {
        css = generateUserCSS('#ffffff');
      });

      describe('u-userTextColor', () => {
        const expectedCss = `
        .u-userTextColor:not([disabled]) {
          color: rgb(138, 138, 138) !important;
          fill: rgb(138, 138, 138) !important;
        }
        .u-userTextColor:not([disabled]):hover,
        .u-userTextColor:not([disabled]):active,
        .u-userTextColor:not([disabled]):focus {
          color: rgb(0, 0, 0) !important;
          fill: rgb(0, 0, 0) !important;
        }`;

        it('is calculated correctly', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userBackgroundColor', () => {
        const expectedCss = `
        .u-userBackgroundColor:not([disabled]) {
          background-color: #ffffff !important;
          color: rgb(110, 110, 110) !important;
          fill: rgb(110, 110, 110) !important;
          border: 1px solid rgb(184, 184, 184) !important;
          svg {
            color: rgb(110, 110, 110) !important;
            fill: rgb(110, 110, 110) !important;
          }
        }
        .u-userBackgroundColor:not([disabled]):hover,
        .u-userBackgroundColor:not([disabled]):active,
        .u-userBackgroundColor:not([disabled]):focus {
          background-color: rgb(230, 230, 230) !important;
        }`;

        it('is calculated correctly', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userBorderColor', () => {
        const expectedCss = `
        .u-userBorderColor:not([disabled]) {
          color: rgb(110, 110, 110) !important;
          background-color: transparent !important;
          border-color: rgb(110, 110, 110) !important;
        }
        .u-userBorderColor:not([disabled]):hover,
        .u-userBorderColor:not([disabled]):active,
        .u-userBorderColor:not([disabled]):focus {
          color: black !important;
          background-color: rgb(0, 0, 0) !important;
          border-color: rgb(0, 0, 0) !important;
        }`;

        it('is calculated correctly', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userHeaderColor', () => {
        const expectedCss = `
        .u-userHeaderColor {
          background: #ffffff !important;
          color: rgb(110, 110, 110) !important;
        }`;

        it('is calculated correctly', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });
    });

    describe('if the color is not light', () => {
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
          color: rgb(0, 0, 0) !important;
          fill: rgb(0, 0, 0) !important;
        }`;

        it('is calculated correctly', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
      });

      describe('u-userBackgroundColor', () => {
        const expectedCss = `
        .u-userBackgroundColor:not([disabled]) {
          background-color: #283646 !important;
          color: white !important;
          fill: white !important;
          border: none !important;
          svg {
            color: white !important;
            fill: white !important;
          }
        }
        .u-userBackgroundColor:not([disabled]):hover,
        .u-userBackgroundColor:not([disabled]):active,
        .u-userBackgroundColor:not([disabled]):focus {
          background-color: rgb(37, 50, 65) !important;
        }`;

        it('is calculated correctly', () => {
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
          background-color: rgb(0, 0, 0) !important;
          border-color: rgb(0, 0, 0) !important;
        }`;

        it('is calculated correctly', () => {
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

        it('is calculated correctly', () => {
          expect(trimWhitespace(css))
            .toContain(trimWhitespace(expectedCss));
        });
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
