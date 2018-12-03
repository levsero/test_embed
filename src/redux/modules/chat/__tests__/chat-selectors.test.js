import 'utility/i18nTestHelper';

import _ from 'lodash';
import * as selectors from '../chat-selectors';
jest.mock('utility/globals');
jest.mock('utility/devices');

const globals = require('utility/globals');
const devices = require('utility/devices');
const profileCard = (settings) => {
  return {
    settings: {
      chat: {
        profileCard: settings
      }
    }
  };
};

const ratingSettings = (enabled) => {
  return {
    chat: {
      accountSettings: {
        rating: { enabled }
      }
    }
  };
};

const profileRating = (rating) => {
  return profileCard({ rating });
};

const prechatFormSettings = (required) => {
  return {
    chat: {
      accountSettings: {
        prechatForm: {
          required
        }
      }
    }
  };
};

describe('getProfileConfig', () => {
  describe('rating', () => {
    describe('account settings rating is false', () => {
      it('returns false even if ratings in profile rating is true', () => {
        const result = selectors.getProfileConfig(_.merge(profileRating(true), ratingSettings(false)));

        expect(result.rating)
          .toBeFalsy();
      });
    });

    describe('account settings rating is true', () => {
      it('returns true if ratings in profile card is true', () => {
        const result = selectors.getProfileConfig(_.merge(profileRating(true), ratingSettings(true)));

        expect(result.rating)
          .toBeTruthy();
      });

      it('returns false if ratings in profile card is false', () => {
        const result = selectors.getProfileConfig(_.merge(profileRating(false), ratingSettings(true)));

        expect(result.rating)
          .toBeFalsy();
      });
    });
  });

  describe('title', () => {
    it('returns false if settings is false', () => {
      const result = selectors.getProfileConfig(_.merge(ratingSettings(true), profileCard({ title: false })));

      expect(result.title)
        .toBe(false);
    });

    it('returns true if settings is true', () => {
      const result = selectors.getProfileConfig(_.merge(ratingSettings(true), profileCard({ title: true })));

      expect(result.title)
        .toBe(true);
    });
  });

  describe('avatar', () => {
    it('returns false if settings is false', () => {
      const result = selectors.getProfileConfig(_.merge(ratingSettings(true), profileCard({ avatar: false })));

      expect(result.avatar)
        .toBe(false);
    });

    it('returns true if settings is true', () => {
      const result = selectors.getProfileConfig(_.merge(ratingSettings(true), profileCard({ avatar: true })));

      expect(result.avatar)
        .toBe(true);
    });
  });
});

describe('getPrechatFormRequired', () => {
  it('returns true when prechat form is required', () => {
    const result = selectors.getPrechatFormRequired(prechatFormSettings(true));

    expect(result)
      .toEqual(true);
  });
});

describe('getIsPopupVisible', () => {
  let
    mockIsMobile,
    isMobileValue = false,
    mockState,
    mockIsPopout = false;

  beforeEach(() => {
    mockState = {
      chat: {
        isAuthenticated: false
      },
      base: {
        activeEmbed: 'chat',
        launcherVisible: false,
        arturos: {
          chatPopout: true
        }
      }
    };
    globals.isPopout = () => mockIsPopout;
    jest.spyOn(devices, 'isMobileBrowser').mockImplementation(mockIsMobile);
  });

  afterEach(() => {
    devices.isMobileBrowser.mockRestore();
    isMobileValue = false;
    mockIsPopout = false;
    globals.isPopout = () => mockIsPopout;
    mockState.base.launcherVisible = false;
  });

  mockIsMobile = jest.fn(() => isMobileValue);

  describe('when values are correct', () => {
    it('it renders popup', () => {
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(true);
    });
  });
  describe('when activeEmbed is not "chat"', () => {
    it('does not render popup', () => {
      mockState.base.activeEmbed = 'boop';
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(false);
    });
  });

  describe('getIsAuthenticated is true', () => {
    it('does not render popup', () => {
      mockState.chat.isAuthenticated = true;
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(false);
    });
  });

  describe('isMobileBrowser is true', () => {
    it('does not render popup', () => {
      isMobileValue = true;
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(false);
    });
  });

  describe('isLauncherVisible is true', () => {
    beforeEach(() => {
      mockState.base.launcherVisible = true;
    });

    it('does not render popup', () => {
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(false);
    });
  });

  describe('when window is a popout', () => {
    beforeEach(() => {
      mockIsPopout = true;
    });

    it('does not render popout', () => {
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(false);
    });
  });

  describe('when window is not a popout', () => {
    it('does render popout', () => {
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(true);
    });
  });

  describe('getChatPopoutArturo is false', () => {
    it('does not render popup', () => {
      mockState.base.arturos.chatPopout = false;
      expect(selectors.getIsPopoutAvailable(mockState)).toEqual(false);
    });
  });
});

test('getHideBranding', () => {
  expect(selectors.getHideBranding({
    chat: {
      accountSettings: {
        branding: {
          hide_branding: true
        }
      }
    }
  })).toEqual(true);
});

describe('getEnabledDepartments', () => {
  const accountDepartments = [
    { name: 'Earth', id: 1 },
    { name: 'Wind', id: 2 },
    { name: 'Fire', id: 3 },
    { name: 'Water', id: 4 },
    { name: 'Lelu', id: 5 }
  ];
  const callSelector = (testData) => (
    selectors.getEnabledDepartments.resultFunc(testData, accountDepartments)
  );

  describe('when zESettings chat enabled departments is malformed', () => {
    [null, undefined, 'bad input', 12345, { bad: 'input' }].forEach((testData) => {
      it('returns the unaltered account settings department list', () => {
        expect(callSelector(testData))
          .toEqual(accountDepartments);
      });
    });
  });

  describe('when zESettings chat enabled departments is correctly formed', () => {
    describe('when zESettings chat enabled departments is an empty array', () => {
      it('returns an empty array', () => {
        expect(callSelector([])).toEqual([]);
      });
    });

    describe('when zESettings chat enabled departments contains values', () => {
      describe('when those values are department ids', () => {
        it('returns only departments from the account settings with corresponding ids', () => {
          expect(callSelector([1, 4])).toEqual([
            { name: 'Earth', id: 1 },
            { name: 'Water', id: 4 }
          ]);
        });
      });

      describe('when those values are department names', () => {
        it('returns only departments from the account settings with corresponding names', () => {
          expect(callSelector(['fire', 'lelu'])).toEqual([
            { name: 'Fire', id: 3 },
            { name: 'Lelu', id: 5 }
          ]);
        });

        it('is case insensitve', () => {
          expect(callSelector(['wind', 'earth'])).toEqual([
            { name: 'Earth', id: 1 },
            { name: 'Wind', id: 2 }
          ]);
        });
      });
    });
  });
});

describe('getDefaultSelectedDepartment', () => {
  const enabledDepartments = [
    { name: 'police', id: 1 },
    { name: 'fire', id: 2 }
  ];
  const callSelector = (testData) => (
    selectors.getDefaultSelectedDepartment.resultFunc(testData, enabledDepartments)
  );

  describe('when the settings chat department is the department name', () => {
    it('returns that department', () => {
      expect(callSelector('police')).toEqual({
        name: 'police',
        id: 1
      });
    });
  });

  describe('when the settings chat department is the department id', () => {
    it('returns that department', () => {
      expect(callSelector(2)).toEqual({
        name: 'fire',
        id: 2
      });
    });
  });

  describe("when the settings chat department doesn't exist/bad data is passed", () => {
    [
      'fire!',
      999,
      ['foo', 'bar'],
      { foo: 'bar' },
      true
    ].forEach((data) => {
      it('returns undefined', () => {
        expect(callSelector(data)).toEqual(undefined);
      });
    });
  });
});
