import _ from 'lodash';
import {
  generateUserWidgetCSS,
  generateUserLauncherCSS,
  generateWebWidgetPreviewCSS
} from '../styles';
import { settings } from 'service/settings';

const baseThemeColor = '#FF69B4';

let mockSettingsValue;

settings.get = (name) => _.get(mockSettingsValue, name, null);

describe('generateUserWidgetCSS', () => {
  describe('when the color is light', () => {
    let css;

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#58F9F7' });
    });

    it('calculates the css correctly', () => {
      expect(css)
        .toMatchSnapshot();
    });
  });

  describe('when the color is not light', () => {
    let css;

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#283646' });
    });

    describe('u-userTextColor', () => {
      it('calculates the css correctly', () => {
        expect(css)
          .toMatchSnapshot();
      });
    });
  });

  describe('when the color is set via embeddable config', () => {
    let css;

    beforeEach(() => {
      css = generateUserWidgetCSS({ base: '#283646', color: '#FF9900' });
    });

    it('uses the color passed in from config', () => {
      expect(css)
        .toMatchSnapshot();
    });
  });
});

describe('generateUserLauncherCSS', () => {
  describe('when the color is light', () => {
    let css;

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#58F9F7' });
    });

    it('is calculated to the same color with a darker text color', () => {
      expect(css)
        .toMatchSnapshot();
    });
  });

  describe('when the color is not light', () => {
    let css;

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#283646' });
    });

    it('is calculated to the same color with a white highlight', () => {
      expect(css)
        .toMatchSnapshot();
    });
  });

  describe('when the color is set via embeddable config', () => {
    let css;

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#283646', color: '#FF9900' });
    });

    it('uses the color passed in from config', () => {
      expect(css)
        .toMatchSnapshot();
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
      it('prefers the button colour over the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          button: '#DC143C'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });

    describe('and the override is invalid or undefined', () => {
      it('falls back to the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          button: '#YOYOYO'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });
  });

  describe('when overriding header colours', () => {
    describe('and the override is valid', () => {
      it('prefers the header colour over the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          header: '#556B2F'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });

    describe('and the override is invalid or undefined', () => {
      it('falls back to the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          header: '#JUJAJU'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });
  });

  describe('when overriding launcher colours', () => {
    describe('and the override is valid', () => {
      it('prefers the launcher colour over the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          launcher: '#FFD700'
        }};

        css = generateUserLauncherCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });

    describe('and the override is invalid or undefined', () => {
      it('falls back to the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          launcher: '#SARASA'
        }};

        css = generateUserLauncherCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });
  });

  describe('when overriding link colours', () => {
    describe('and the override is valid', () => {
      it('prefers the link colour over the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          articleLinks: '#6B8E23'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });

    describe('and the override is invalid or undefined', () => {
      it('falls back to the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          articleLinks: '#MOOMOO'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });
  });

  describe('when overriding list colours', () => {
    describe('and the override is valid', () => {
      it('prefers the link colour over the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          resultLists: '#2E8B57'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
      });
    });

    describe('and the override is invalid or undefined', () => {
      it('falls back to the base colour', () => {
        mockSettingsValue = { color: {
          theme: baseThemeColor,
          links: '#SNOOPD'
        }};

        css = generateUserWidgetCSS();

        expect(css)
          .toMatchSnapshot();
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

    it('calculates the colours correctly', () => {
      expect(css)
        .toMatchSnapshot();
    });
  });

  describe('generateUserLauncherCSS', () => {
    let css;

    beforeEach(() => {
      css = generateUserLauncherCSS({ base: '#FFFFFF' });
    });

    it('calculates the colours correctly', () => {
      expect(css)
        .toMatchSnapshot();
    });
  });
});

describe('generateWebWidgetPreviewCSS', () => {
  let css;

  beforeEach(() => {
    css = generateWebWidgetPreviewCSS({ base: '#58F9F7' });
  });

  it('calculates the colours correctly', () => {
    expect(css)
      .toMatchSnapshot();
  });
});
