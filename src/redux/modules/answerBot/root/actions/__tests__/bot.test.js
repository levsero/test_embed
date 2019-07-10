import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import * as actions from '../bot'
import * as selectors from 'src/redux/modules/selectors/selectors'

const mockStore = configureMockStore([thunk])

beforeEach(() => {
  jest.spyOn(Date, 'now').mockReturnValue(1531267200000)
})

const createStore = () => {
  const state = {
    answerBot: {
      currentSessionID: 1234
    }
  }

  return mockStore(state)
}

describe('botMessage', () => {
  it('dispatches expected actions', () => {
    const store = createStore()

    store.dispatch(actions.botMessage('hello world'))

    expect(store.getActions()).toMatchSnapshot()
  })
})

describe('botChannelChoice', () => {
  it('dispatches expected payload', () => {
    expect(actions.botChannelChoice('hello', true)).toMatchSnapshot()
  })

  it('defaults to false fallback', () => {
    expect(actions.botChannelChoice('world')).toMatchSnapshot()
  })
})

describe('botFeedback', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedback('secondary')).toMatchSnapshot()
  })

  it('defaults to primary', () => {
    expect(actions.botFeedback()).toMatchSnapshot()
  })
})

describe('botFeedbackRequested', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackRequested()).toMatchSnapshot()
  })
})

test('botGreeted dispatches expected payload', () => {
  expect(actions.botGreeted()).toMatchSnapshot()
})

test('botInitialFallback dispatches expected payload', () => {
  expect(actions.botInitialFallback()).toMatchSnapshot()
})

test('botUserMessage dispatches expected payload', () => {
  expect(actions.botUserMessage('hello')).toMatchSnapshot()
})

test('botTyping dispatches expected payload', () => {
  expect(actions.botTyping()).toMatchSnapshot()
})

describe('botFeedbackMessage', () => {
  it('dispatches expected payload', () => {
    expect(actions.botFeedbackMessage('hello')).toMatchSnapshot()
  })
})

describe('botFallbackMessage', () => {
  ;[true, false].forEach(channelAvailable => {
    describe(`when channelAvailable is ${channelAvailable}`, () => {
      it('dispatches the appropriate actions', () => {
        const store = createStore()

        jest.spyOn(selectors, 'getChannelAvailable').mockReturnValue(channelAvailable)
        store.dispatch(actions.botFallbackMessage())

        expect(store.getActions()).toMatchSnapshot()
      })
    })
  })

  describe('when feedbackRelated is true', () => {
    it('adds `feedbackRelated: true` to the botMessage payload', () => {
      const store = createStore()

      jest.spyOn(selectors, 'getChannelAvailable').mockReturnValue(false)
      store.dispatch(actions.botFallbackMessage(true))
      const payload = store.getActions()[0].payload

      expect(payload.feedbackRelated).toEqual(true)
    })
  })
})
