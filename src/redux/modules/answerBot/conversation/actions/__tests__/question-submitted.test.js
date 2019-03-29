import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../question-submitted';
import { http } from 'service/transport';
import { settings } from 'service/settings';
import { identity } from 'service/identity';
import { store } from 'service/persistence';
import { i18n } from 'service/i18n';
import _ from 'lodash';

jest.mock('service/transport');
jest.mock('service/identity');
jest.mock('service/i18n');

const mockStore = configureMockStore([thunk]);

settings.init();
store.set('zE_oauth', {
  token: 'abc123'
});
jest.spyOn(i18n, 'getLocale').mockReturnValue('tl');

Date.now = jest.fn(() => 123456789);
identity.getSuid = jest.fn(() => ({ id: 8888 }));

describe('questionSubmitted', () => {
  const defaultState = {
    answerBot: {
      currentSessionID: 1234,
      sessions: new Map([
        [1234, {
          deflection: { id: 888 },
          interactionToken: { y: 2 }
        }]
      ])
    },
    settings: {
      answerBot: {
        search: {
          labels: ['this', 'is', 'a', 'label']
        }
      }
    }
  };
  const dispatchAction = (newState = {}) => {
    const state = _.merge({}, defaultState, newState);
    const store = mockStore(state);

    store.dispatch(actions.questionSubmitted('hello world'));

    return store;
  };

  it('dispatches the expected pending actions', () => {
    expect(dispatchAction().getActions())
      .toMatchSnapshot();
  });

  it('dispatches the expected action without session starting', () => {
    expect(dispatchAction({
      answerBot: {
        currentSessionID: 4567
      }
    }).getActions())
      .toMatchSnapshot();
  });

  it('sends the expected http params', () => {
    dispatchAction();
    expect(http.send)
      .toMatchSnapshot();
  });

  describe('callbacks', () => {
    it('dispatches expected actions on successful request', () => {
      const store = dispatchAction();
      const callback = http.send.mock.calls[0][0].callbacks.done;

      callback({
        body: {
          deflection_articles: [1, 2, 3], // eslint-disable-line camelcase
          deflection: { x: 123 },
          interaction_access_token: { y: 456 } // eslint-disable-line camelcase
        }
      });
      expect(store.getActions())
        .toMatchSnapshot();
    });

    it('dispatches another request when there are no results and there is a locale in the request', () => {
      dispatchAction();
      const callback = http.send.mock.calls[0][0].callbacks.done;

      callback({
        body: {
          deflection_articles: [], // eslint-disable-line camelcase
          deflection: { x: 123 },
          interaction_access_token: { y: 456 } // eslint-disable-line camelcase
        }
      });
      expect(http.send)
        .toHaveBeenCalledTimes(2);
      expect(http.send.mock.calls[1][0])
        .toMatchSnapshot();
    });

    it('dispatches only 1 request when there are no results and there is no locale in the request', () => {
      jest.spyOn(i18n, 'getLocale').mockReturnValue(null);
      dispatchAction();
      const callback = http.send.mock.calls[0][0].callbacks.done;

      callback({
        body: {
          deflection_articles: [], // eslint-disable-line camelcase
          deflection: { x: 123 },
          interaction_access_token: { y: 456 } // eslint-disable-line camelcase
        }
      });
      expect(http.send)
        .toHaveBeenCalledTimes(1);
    });

    it('dispatches expected actions on failed request', () => {
      const store = dispatchAction();
      const callback = http.send.mock.calls[0][0].callbacks.fail;

      callback('error');
      expect(store.getActions())
        .toMatchSnapshot();
    });
  });
});
