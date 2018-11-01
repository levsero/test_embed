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

describe('getShowProfileRating', () => {
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

  it('returns false if ratings in account settings is disabled', () => {
    const result = selectors.getShowProfileRating(_.merge(profileRating(true), ratingSettings(false)));

    expect(result)
      .toBeFalsy();
  });

  it('returns false if ratings in profile card is false', () => {
    const result = selectors.getShowProfileRating(_.merge(profileRating(false), ratingSettings(true)));

    expect(result)
      .toBeFalsy();
  });

  it('returns true if ratings in profile card is and ratings is enabled in account settings', () => {
    const result = selectors.getShowProfileRating(_.merge(profileRating(true), ratingSettings(true)));

    expect(result)
      .toBeTruthy();
  });
});

test('getShowProfileTitle', () => {
  const result = selectors.getShowProfileTitle(profileCard({ title: false }));

  expect(result)
    .toBe(false);
});

test('getShowProfileAvatar', () => {
  const result = selectors.getShowProfileAvatar(profileCard({ avatar: true }));

  expect(result)
    .toBe(true);
});
