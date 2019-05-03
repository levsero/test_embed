import _ from 'lodash';
import { settings } from '../settings';
import * as actions from 'src/redux/modules/settings/settings-actions';

jest.mock('src/redux/modules/settings/settings-actions');
jest.mock('src/redux/modules/selectors');

const store = {
  dispatch: jest.fn()
};

beforeEach(() => {
  window.zESettings = undefined;
  settings.disableCustomizations();
});

describe('init', () => {
  describe('defaults', () => {
    beforeEach(() => {
      settings.init(store);
    });

    test.each([
      ['margin', 8],
      ['viaId', 48],
      ['contactForm.ticketForms', []],
      ['contactOptions', { enabled: false }],
      ['chat.concierge.avatarPath', null]
    ])(
      '%s defaults to %p',
      (path, expected) => {
        expect(settings.get(path))
          .toEqual(expected);
      }
    );
  });

  describe('redux', () => {
    beforeEach(() => {
      actions.updateSettings.mockReturnValue('updateSettingsCalled');
      settings.init(store);
    });

    it('dispatches updateSettings action', () => {
      expect(store.dispatch)
        .toHaveBeenCalledWith('updateSettingsCalled');
    });

    it('calls updateSettings', () => {
      expect(actions.updateSettings)
        .toHaveBeenCalledWith({
          webWidget: expect.any(Object)
        });
    });
  });

  it('stores a whitelisted value if it is in win.zESetting', () => {
    window.zESettings = { webWidget: { authenticate: 'foo' } };
    settings.init();
    expect(settings.get('authenticate'))
      .toEqual('foo');
  });

  it('does not store a value if it is not in the whitelist', () => {
    window.zESettings = { webWidget: { foo: 'bar' } };
    settings.init();

    expect(settings.get('foo'))
      .toEqual(null);
  });

  it('is backwards compatible with old authenticate setting', () => {
    window.zESettings = { authenticate: 'foo' };
    settings.init();

    expect(settings.get('authenticate'))
      .toEqual('foo');
  });

  it('can set errorReporting to true', () => {
    window.zESettings = { errorReporting: true };
    settings.init();
    expect(settings.getErrorReportingEnabled())
      .toBe(true);
  });

  it('can set errorReporting to false', () => {
    window.zESettings = { errorReporting: false };
    settings.init();
    expect(settings.getErrorReportingEnabled())
      .toBe(false);
  });
});

describe('get', () => {
  beforeEach(() => {
    window.zESettings = {
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
          notifications: {
            mobile: {
              disable: true
            }
          },
          departments: {
            select: 'yolo'
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
          resultLists: '#660000'
        }
      }
    };

    settings.init();
  });

  it('returns chat department settings', () => {
    expect(settings.get('chat.departments.select'))
      .toBe('yolo');
  });

  it('returns mobile notifications disable settings', () => {
    expect(settings.get('chat.notifications.mobile.disable'))
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

  it('returns a value if it exists in the store', () => {
    expect(settings.get('authenticate'))
      .toEqual('foo');
  });

  it('returns null if a value does not exist in the store', () => {
    window.zESettings = { webWidget: {} };
    settings.init();

    expect(settings.get('authenticate'))
      .toEqual(null);
  });

  it('returns a value for a nested param if it exists in the store', () => {
    window.zESettings = { webWidget: { contactForm: { attachments: 'foo' } } };
    settings.init();

    expect(settings.get('contactForm.attachments'))
      .toEqual('foo');
  });
});

describe('getTranslations', () => {
  beforeEach(() => {
    window.zESettings = {
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

describe('getTrackSettings', () => {
  const generateSettings = (customSettings = {}) => {
    const userSettings = _.merge({}, {
      webWidget: {
        authenticate: { jwt: 'abc' },
        helpCenter: { originalArticleButton: false }
      }
    }, customSettings);

    window.zESettings = userSettings;

    return userSettings;
  };

  it('returns a web widget object', () => {
    generateSettings();
    settings.init();

    expect(settings.getTrackSettings().webWidget)
      .toBeDefined();
  });

  it('filters out unwanted values from the store', () => {
    generateSettings();
    settings.init();

    expect(settings.getTrackSettings().webWidget.margin)
      .toBeUndefined();

    expect(settings.getTrackSettings().webWidget.viaId)
      .toBeUndefined();
  });

  it('filters out default values from the store', () => {
    generateSettings();
    settings.init();

    expect(settings.getTrackSettings().webWidget.contactForm)
      .toBeUndefined();
  });

  it('does not filter out custom values from the store', () => {
    const userSettings = generateSettings();

    settings.init();
    userSettings.webWidget.authenticate = true;

    expect(settings.getTrackSettings())
      .toEqual({
        webWidget: {
          authenticate: {
            chat: false,
            helpCenter: true
          },
          helpCenter: {
            originalArticleButton: false
          }
        }
      });
  });

  it('gives expected payload when chat jwt is available', () => {
    generateSettings({
      webWidget: {
        authenticate: {
          chat: {
            jwtFn: () => '1234'
          }
        }
      }
    });
    settings.init();
    expect(settings.getTrackSettings().webWidget.authenticate.chat)
      .toEqual(true);
  });

  it('gives expected payload when support jwt is available', () => {
    generateSettings({
      webWidget: {
        authenticate: {
          support: {
            jwt: '321414'
          }
        }
      }
    });
    settings.init();
    expect(settings.getTrackSettings().webWidget.authenticate.helpCenter)
      .toEqual(true);
  });

  it('filters out empty objects', () => {
    generateSettings();
    window.zESettings.emptyThing = {};
    settings.init();

    expect(settings.getTrackSettings().emptyThing)
      .toBeUndefined();
  });
});

describe('getAuthSettingsJwt', () => {
  const setupAuthSettingsJwt = (authenticate) => {
    const mockSettings = {
      webWidget: {
        authenticate
      }
    };

    window.zESettings = mockSettings;
    settings.init();
    return settings.getAuthSettingsJwt();
  };

  describe('when authenticate.jwt is defined', () => {
    it('returns the jwt', () => {
      expect(setupAuthSettingsJwt({ jwt: 'mockJwt' }))
        .toEqual('mockJwt');
    });
  });

  describe('when authenticate.jwt is not defined', () => {
    it('returns null', () => {
      expect(setupAuthSettingsJwt({}))
        .toBeNull();
    });
  });

  describe('when authenticate is not defined', () => {
    it('returns null', () => {
      expect(setupAuthSettingsJwt())
        .toBeNull();
    });
  });
});

describe('getAuthSettingsJwtFn', () => {
  const setupAuthSettingsJwtFn = (authenticate) => {
    const mockSettings = {
      webWidget: {
        authenticate
      }
    };

    window.zESettings = mockSettings;
    settings.init();
    return settings.getAuthSettingsJwtFn();
  };

  describe('when authenticate.jwtFn is defined', () => {
    it('returns the jwtFn', () => {
      const mockJwtFn = () => {};

      expect(setupAuthSettingsJwtFn({ jwtFn: mockJwtFn }))
        .toEqual(mockJwtFn);
    });
  });

  describe('when authenticate.jwtFn is not defined', () => {
    it('returns null', () => {
      expect(setupAuthSettingsJwtFn({}))
        .toBeNull();
    });
  });

  describe('when authenticate.jwtFn is not a function', () => {
    it('returns null', () => {
      expect(setupAuthSettingsJwtFn({ jwtFn: 'jwt-string' }))
        .toBeNull();
    });
  });

  describe('when authenticate is not defined', () => {
    it('returns null', () => {
      expect(setupAuthSettingsJwtFn())
        .toBeNull();
    });
  });
});

describe('getChatAuthSettings', () => {
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

      window.zESettings = mockSettings;
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
        window.zESettings = mockSettings;
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
      window.zESettings = mockSettings;
      settings.init();

      chatAuthSettings = settings.getChatAuthSettings();
    });

    it('returns null', () => {
      expect(chatAuthSettings)
        .toBeNull();
    });
  });
});

describe('updateSettingsLegacy', () => {
  let mockSettings = {},
    callbackSpy;

  beforeEach(() => {
    mockSettings.webWidget = {
      offset: {
        horizontal: 0
      }
    };
    window.zESettings = mockSettings;
    settings.init();

    const newSettings = {
      offset: {
        vertical: 0,
        horizontal: 10,
        mobile: {
          vertical: 10,
          horizontal: 100
        }
      }
    };

    callbackSpy = jest.fn();

    settings.updateSettingsLegacy(newSettings, callbackSpy);
  });

  it('calls callback', () => {
    expect(callbackSpy)
      .toHaveBeenCalled();
  });

  it('updates legacy settings object', () => {
    expect(settings.get('offset.vertical'))
      .toEqual(0);
    expect(settings.get('offset.horizontal'))
      .toEqual(10);
    expect(settings.get('offset.mobile'))
      .toEqual({
        vertical: 10,
        horizontal: 100
      });
  });
});
