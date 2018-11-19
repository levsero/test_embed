import 'utility/i18nTestHelper';

import _ from 'lodash';
import * as selectors from '../chat-selectors';

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
