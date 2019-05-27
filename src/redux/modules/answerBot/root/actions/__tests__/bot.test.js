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

test('botTyping dispatches expected payload', () => {
  expect(actions.botTyping())
    .toMatchSnapshot();
});

describe('botFeedbackMessage', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackMessage('hello'))
      .toMatchSnapshot();
  });
});
