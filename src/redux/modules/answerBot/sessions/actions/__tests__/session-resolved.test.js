import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import * as actions from '../session-resolved';
import { http } from 'service/transport';
import { settings } from 'service/settings';

jest.mock('service/transport');

const mockStore = configureMockStore([thunk]);

settings.init();

describe('sessionResolved', () => {
  let dispatchedActions, store;

  beforeEach(() => {
    const state = {
      answerBot: {
        currentSessionID: 1234,
        currentArticle: {
          articleID: 4567
        },
        sessions: new Map([
          [1234, {
            deflection: { id: 888 },
            interactionToken: { y: 2 }
          }],
        ])
      }
    };

    store = mockStore(state);

    store.dispatch(actions.sessionResolved());

    dispatchedActions = store.getActions();
  });

  it('dispatches the expected pending actions', () => {
    expect(dispatchedActions)
      .toMatchSnapshot();
  });

  it('sends the expected http params', () => {
    expect(http.send)
      .toMatchSnapshot();
  });

  describe('callbacks', () => {
    it('dispatches expected actions on successful request', () => {
      const callback = http.send.mock.calls[0][0].callbacks.done;

      callback();
      expect(store.getActions())
        .toMatchSnapshot();
    });

    it('dispatches expected actions on failed request', () => {
      const callback = http.send.mock.calls[0][0].callbacks.fail;

      callback({ error: 'blah' });
      expect(store.getActions())
        .toMatchSnapshot();
    });
  });
});
