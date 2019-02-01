import configureMockStore from 'redux-mock-store';
import _ from 'lodash';
import thunk from 'redux-thunk';
import * as actions from '../bot';

const mockStore = configureMockStore([thunk]);

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(1531267200000);
});

describe('botMessage', () => {
  const createStore = () => {
    const state = {
      answerBot: {
        currentSessionID: 1234
      }
    };

    return mockStore(state);
  };

  it('dispatches expected actions', () => {
    const store = createStore();

    store.dispatch(actions.botMessage('hello world'));

    expect(store.getActions())
      .toMatchSnapshot();
  });

  test('callback parameter can only be called once', () => {
    const originalCallback = jest.fn();

    const store = createStore();

    store.dispatch(actions.botMessage('hello world', originalCallback));

    const callback = store.getActions()[0].payload.callback;

    _.times(3, callback);

    expect(originalCallback)
      .toHaveBeenCalledTimes(1);
  });
});

describe('botChannelChoice', () => {
  it('dispatches expected payload', () => {
    expect(actions.botChannelChoice('hello', true))
      .toMatchSnapshot();
  });

  it('defaults to false fallback', () => {
    expect(actions.botChannelChoice('world'))
      .toMatchSnapshot();
  });
});

describe('botFeedbackChannelChoice', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackChannelChoice('hello', true))
      .toMatchSnapshot();
  });

  it('defaults to false fallback', () => {
    expect(actions.botFeedbackChannelChoice('world'))
      .toMatchSnapshot();
  });
});

describe('botFeedback', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedback('secondary'))
      .toMatchSnapshot();
  });

  it('defaults to primary', () => {
    expect(actions.botFeedback())
      .toMatchSnapshot();
  });
});

describe('botFeedbackRequested', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackRequested())
      .toMatchSnapshot();
  });
});

test('botGreeted dispatches expected payload', () => {
  expect(actions.botGreeted())
    .toMatchSnapshot();
});

test('botInitialFallback dispatches expected payload', () => {
  expect(actions.botInitialFallback())
    .toMatchSnapshot();
});

test('botUserMessage dispatches expected payload', () => {
  expect(actions.botUserMessage('hello'))
    .toMatchSnapshot();
});

describe('botFeedbackMessage', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackMessage('hello'))
      .toMatchSnapshot();
  });

  it('limits callback in payload to be called only once', () => {
    const originalCallback = jest.fn();
    const callback = actions.botFeedbackMessage('hello', originalCallback).payload.callback;

    _.times(4, callback);

    expect(originalCallback)
      .toHaveBeenCalledTimes(1);
  });
});
