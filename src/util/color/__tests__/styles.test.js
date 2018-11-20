import _ from 'lodash';
import {
  generateUserWidgetCSS,
  generateUserLauncherCSS,
  generateWebWidgetPreviewCSS
} from '../styles';
import { settings } from 'service/settings';

const baseThemeColor = '#FF69B4';
const trimWhitespace = (str) => {
  return _.chain(str.split('\n'))
    .map(_.trim)
    .toString()
    .value();
};

let mockSettingsValue;

settings.get = (name) => _.get(mockSettingsValue, name, null);

describe('generateUserWidgetCSS', () => {
  describe('when the color is light', () => {
    let css;

    beforeEach(() => {
      css = generateUserWidgetCSS({base: '#58F9F7'});
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
      css = generateUserWidgetCSS({base: '#283646'});
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

  describe('when the color is set via embeddable config', () => {
    let css;

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#283646', color: '#FF9900' });
    });

    describe('u-userBackgroundColor', () => {
      it('uses the color passed in from config', () => {
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

        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('.u-userBorderColor', () => {
      it('uses the color passed in from config', () => {
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

        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('.u-userHeaderColor', () => {
      it('uses the color passed in from config', () => {
        const expectedCss = `
        .u-userHeaderColor {
          background: #283646 !important;
          color: #FFFFFF !important;
        }`;

        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('.u-userHeaderButtonColor', () => {
      it('uses the color passed in from config', () => {
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
        }
        .u-userHeaderButtonColorMobile {
          fill: #FFFFFF !important;
        }`;

        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });
  });
});

describe('generateUserLauncherCSS', () => {
  describe('when the color is light', () => {
    let css;

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#58F9F7' });
    });

    describe('u-userLauncherColor', () => {
      const expectedCss = `
      .u-userLauncherColor:not([disabled]) {
        background-color: #58F9F7 !important;
        color: #186766 !important;
        fill: #186766 !important;
        svg {
          color: #186766 !important;
          fill: #186766 !important;
        }
      }
      .u-userLauncherColor:not([disabled]):focus {
        box-shadow: inset 0 0 0 0.21428571428571427rem rgba(24, 103, 102, 0.1) !important;
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
      css = generateUserLauncherCSS({ base: '#283646' });
    });

    describe('u-userLauncherColor', () => {
      const expectedCss = `
      .u-userLauncherColor:not([disabled]) {
        background-color: #283646 !important;
        color: #FFFFFF !important;
        fill: #FFFFFF !important;
        svg {
          color: #FFFFFF !important;
          fill: #FFFFFF !important;
        }
      }
      .u-userLauncherColor:not([disabled]):focus {
        box-shadow: inset 0 0 0 0.21428571428571427rem rgba(255, 255, 255, 0.1) !important;
      }`;

      it('is calculated to the same color with a white highlight', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });
  });

  describe('when the color is set via embeddable config', () => {
    let css;

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#283646', color: '#FF9900' });
    });

    describe('.u-userLauncherColor', () => {
      it('uses the color passed in from config', () => {
        const expectedCss = `
        .u-userLauncherColor:not([disabled]) {
          background-color: #283646 !important;
          color: #FFFFFF !important;
          fill: #FFFFFF !important;
          svg {
            color: #FFFFFF !important;
            fill: #FFFFFF !important;
          }
        }
        .u-userLauncherColor:not([disabled]):focus {
          box-shadow: inset 0 0 0 0.21428571428571427rem rgba(255, 255, 255, 0.1) !important;
        }`;

        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });
  });
});

describe('when overriding with zESettings', () => {
  let css;

  afterEach(() => {
    mockSettingsValue = null;
  });

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
        background: #FF8DC6 !important;
        svg {
          background: #FF8DC6 !important;
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

  describe('when overriding launcher colours', () => {
    describe('and the override is valid', () => {
      const expectedCss = `
        .u-userLauncherColor:not([disabled]) {
          background-color: #FFD700 !important;
          color: #64570E !important;
          fill: #64570E !important;
          svg {
            color: #64570E !important;
            fill: #64570E !important;
          }
        }`;

      it('prefers the launcher colour over the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          launcher: '#FFD700'
        }};

        css = generateUserLauncherCSS();

        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('and the override is invalid or undefined', () => {
      const expectedCss = `
        .u-userLauncherColor:not([disabled]) {
          background-color: #FF69B4 !important;
          color: #63163D !important;
          fill: #63163D !important;
          svg {
            color: #63163D !important;
            fill: #63163D !important;
          }
        }`;

      it('falls back to the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          launcher: '#SARASA'
        }};

        css = generateUserLauncherCSS();

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
        color: #339960 !important;
        fill: #339960 !important;
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
});

describe('when the color is extremely light (white or almost white)', () => {
  describe('generateUserWidgetCSS', () => {
    let css;

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#FFFFFF' });
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
        color: #7A7A7A !important;
        fill: #7A7A7A !important;
      }`;

      it('is calculated to a darker color with a highlight', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userBackgroundColor', () => {
      const expectedCss = `
      .u-userBackgroundColor:not([disabled]) {
        background-color: #7C7C7C !important;
        color: #121212 !important;
      }
      .u-userBackgroundColor:not([disabled]):hover,
      .u-userBackgroundColor:not([disabled]):active,
      .u-userBackgroundColor:not([disabled]):focus {
        background-color: #888888 !important;
      }`;

      it('is calculated to neutral grey and accessible dark for color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });

    describe('u-userBorderColor', () => {
      const expectedCss = `
      .u-userBorderColor:not([disabled]) {
        color: #7C7C7C !important;
        background-color: transparent !important;
        border-color: #7C7C7C !important;
      }
      .u-userBorderColor:not([disabled]):hover,
      .u-userBorderColor:not([disabled]):active,
      .u-userBorderColor:not([disabled]):focus {
        color: #121212 !important;
        background-color: #7C7C7C !important;
        border-color: #7C7C7C !important;
      }`;

      it('is calculated to neutral grey and accessible dark for color', () => {
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

  describe('generateUserLauncherCSS', () => {
    let css;

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#FFFFFF' });
    });

    describe('u-userLauncherColor', () => {
      const expectedCss = `
      .u-userLauncherColor:not([disabled]) {
        background-color: #FFFFFF !important;
        color: #6F6F6F !important;
        fill: #6F6F6F !important;
        svg {
          color: #6F6F6F !important;
          fill: #6F6F6F !important;
        }
      }
      .u-userLauncherColor:not([disabled]):focus {
        box-shadow: inset 0 0 0 0.21428571428571427rem rgba(111, 111, 111, 0.1) !important;
      }`;

      it('is calculated to the same color with a darker text and highlight color', () => {
        expect(trimWhitespace(css))
          .toContain(trimWhitespace(expectedCss));
      });
    });
  });
});

describe('generateWebWidgetPreviewCSS', () => {
  let css;

  beforeEach(() => {
    css = generateWebWidgetPreviewCSS({ base: '#58F9F7' });
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
