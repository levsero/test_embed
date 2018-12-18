import reducer from '../';
import * as settingsActionTypes from 'src/redux/modules/settings/settings-action-types';

const defaultState = () => {
  return {
    originalArticleButton: true,
    suppress: false,
    localeFallbacks: [],
    chatButton: null,
    sectionFilter: null,
    categoryFilter: null,
    labelFilter: null,
    messageButton: null,
    searchPlaceholder: null,
    title: null
  };
};

const reduce = (payload) => {
  return reducer(defaultState(), {
    type: settingsActionTypes.UPDATE_SETTINGS,
    payload: payload
  });
};

test('default state', () => {
  expect(reducer(undefined, {}))
    .toEqual(defaultState());
});

describe('when UPDATE_SETTINGS is dispatched', () => {
  it('updates the settings', () => {
    const payload = {
      webWidget: {
        helpCenter: {
          originalArticleButton: false,
          suppress: true,
          localeFallbacks: ['fr'],
          chatButton: { '*': 'chat button text' },
          filter: {
            section: 'section',
            category: 'category',
            label_names: 'label' // eslint-disable-line camelcase
          },
          messageButton: { '*': 'messageButton text' },
          searchPlaceholder: { '*': 'searchPlaceholder text' },
          title: { '*': 'title text' },
        }
      }
    };

    expect(reduce(payload))
      .toMatchSnapshot();
  });

  it('does not affect values not passed in', () => {
    const payload = {
      webWidget: {
        helpCenter: {
          title: { '*': 'title text' },
        }
      }
    };

    expect(reduce(payload))
      .toMatchSnapshot();
  });

  it('restricts the number of fallback locales', () => {
    const payload = {
      webWidget: {
        helpCenter: {
          localeFallbacks: ['fr', 'ger', 'sp', 'rus']
        }
      }
    };

    expect(reduce(payload).localeFallbacks)
      .toEqual(['fr', 'ger', 'sp']);
  });
});
