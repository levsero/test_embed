import * as selectors from '../'

describe('getSessions', () => {
  it('returns the sessions', () => {
    const sessions = new Map([
      [1, {}],
      [2, {}],
    ])

    expect(selectors.getSessions({ answerBot: { sessions } }).size).toEqual(2)
  })
})

describe('isInitialSession', () => {
  describe('1 active session', () => {
    it('returns true', () => {
      const sessions = new Map([[1, {}]])

      expect(selectors.isInitialSession.resultFunc(sessions)).toEqual(true)
    })
  })

  describe('more than 1 active session', () => {
    it('returns false', () => {
      const sessions = new Map([
        [1, {}],
        [2, {}],
      ])

      expect(selectors.isInitialSession.resultFunc(sessions)).toEqual(false)
    })
  })
})

describe('getSessionFallbackSuggested', () => {
  it('returns the session fallbackSuggested', () => {
    const sessions = new Map([
      [1, { fallbackSuggested: true }],
      [2, { fallbackSuggested: false }],
    ])

    expect(selectors.getSessionFallbackSuggested.resultFunc(1, sessions)).toBe(true)
    expect(selectors.getSessionFallbackSuggested.resultFunc(2, sessions)).toBe(false)
  })
})
