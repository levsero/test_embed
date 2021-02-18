import * as selectors from '../'

const getMockState = (state) => {
  return { answerBot: state }
}

describe('getCurrentMessage', () => {
  const message = `If EA suffers big enough losses from the backlash of Battlefront 2,
      and it all started because some guy couldn't unlock Vader,
      this will be the second time Anakin brought balance to something.`
  const mockState = getMockState({ currentMessage: message })

  it('returns the current message', () => {
    const result = selectors.getCurrentMessage(mockState)

    expect(result).toEqual(message)
  })
})

describe('getCurrentArticle', () => {
  const article1 = { id: 1, body: '123' }
  const article2 = { id: 2, body: '456' }

  it.each([
    [null, 1, 2, new Map([[1, { articles: [article1] }]]), undefined],
    [null, 1, 1, new Map([[1, { articles: [] }]]), undefined],
    [null, 1, 1, new Map([[1, { articles: [article2] }]]), undefined],
    [null, 1, 1, new Map([[1, { articles: [article1] }]]), article1],
    [article1, 1, 1, new Map([[1, { articles: [article2] }]]), article1],
  ])('fn(%p, %i, %i, %p)', (contextualArticle, articleID, sessionID, sessions, expected) => {
    const result = selectors.getCurrentArticle.resultFunc(
      contextualArticle,
      articleID,
      sessionID,
      sessions
    )

    expect(result).toEqual(expected)
  })
})

describe('getCurrentArticleID', () => {
  const articleID = 123
  const mockState = {
    currentArticle: { articleID },
  }

  it('returns the current article ID', () => {
    const result = selectors.getCurrentArticleID.resultFunc(mockState)

    expect(result).toEqual(articleID)
  })
})

describe('getCurrentArticleSessionID', () => {
  const sessionID = 123
  const mockState = {
    currentArticle: { sessionID },
  }

  it('returns the current article sessionID', () => {
    const result = selectors.getCurrentArticleSessionID.resultFunc(mockState)

    expect(result).toEqual(sessionID)
  })
})

describe('isFeedbackRequired', () => {
  it.each([
    [true, { markedAsIrrelevant: false }, 1, 1, false, false],
    [null, { markedAsIrrelevant: true }, 1, 1, false, false],
    [null, { markedAsIrrelevant: false }, 1, 2, false, false],
    [null, { markedAsIrrelevant: false }, 1, 1, true, false],
    [null, { markedAsIrrelevant: false }, 1, 1, false, true],
  ])(
    'fn(%p, %p, %i, %i, %s)',
    (contextual, article, sessionID, currentSessionID, currentSessionResolved, expected) => {
      const result = selectors.isFeedbackRequired.resultFunc(
        contextual,
        article,
        sessionID,
        currentSessionID,
        currentSessionResolved
      )

      expect(result).toEqual(expected)
    }
  )
})

describe('getCurrentScreen', () => {
  const screen = 'article'
  const mockState = getMockState({
    currentScreen: screen,
  })

  it('returns the current screen', () => {
    const result = selectors.getCurrentScreen(mockState)

    expect(result).toEqual(screen)
  })
})

describe('getCurrentSessionID', () => {
  const session = 1234
  const mockState = getMockState({
    currentSessionID: session,
  })

  it('returns the current sessionID', () => {
    const result = selectors.getCurrentSessionID(mockState)

    expect(result).toEqual(session)
  })
})

describe('getCurrentRequestStatus', () => {
  describe('active session', () => {
    it('returns the request status', () => {
      const mockState = getMockState({
        currentSessionID: 1,
        sessions: new Map([[1, { requestStatus: 'blah' }]]),
      })

      const result = selectors.getCurrentRequestStatus(mockState)

      expect(result).toEqual('blah')
    })
  })

  describe('no session', () => {
    it('returns null', () => {
      const mockState = getMockState({
        sessions: new Map(),
      })
      const result = selectors.getCurrentRequestStatus(mockState)

      expect(result).toEqual(null)
    })
  })
})

describe('getCurrentDeflection', () => {
  describe('active session', () => {
    it('returns the deflection of the current session', () => {
      const mockState = getMockState({
        currentSessionID: 1,
        sessions: new Map([[1, { deflection: 'blah' }]]),
      })
      const result = selectors.getCurrentDeflection(mockState)

      expect(result).toEqual('blah')
    })
  })

  describe('no session', () => {
    it('returns null', () => {
      const mockState = getMockState({
        sessions: new Map(),
      })
      const result = selectors.getCurrentDeflection(mockState)

      expect(result).toEqual(null)
    })
  })
})

describe('getCurrentInteractionToken', () => {
  describe('active session', () => {
    it('returns the interactionToken of the current session', () => {
      const mockState = getMockState({
        currentSessionID: 1,
        sessions: new Map([[1, { interactionToken: 'blah' }]]),
      })
      const result = selectors.getCurrentInteractionToken(mockState)

      expect(result).toEqual('blah')
    })
  })

  describe('no session', () => {
    it('returns null', () => {
      const mockState = getMockState({
        sessions: new Map(),
      })
      const result = selectors.getCurrentInteractionToken(mockState)

      expect(result).toEqual(null)
    })
  })
})

describe('getCurrentQuery', () => {
  describe('active session', () => {
    it('returns the query of the current session', () => {
      const mockState = getMockState({
        currentSessionID: 1,
        sessions: new Map([[1, { query: 'blah' }]]),
      })
      const result = selectors.getCurrentQuery(mockState)

      expect(result).toEqual('blah')
    })
  })

  describe('no session', () => {
    it('returns null', () => {
      const mockState = getMockState({
        sessions: new Map(),
      })
      const result = selectors.getCurrentQuery(mockState)

      expect(result).toEqual(null)
    })
  })
})

describe('isCurrentSessionResolved', () => {
  describe('active session', () => {
    describe('is resolved', () => {
      it('returns true', () => {
        const mockState = getMockState({
          currentSessionID: 1,
          sessions: new Map([[1, { resolved: true }]]),
        })
        const result = selectors.isCurrentSessionResolved(mockState)

        expect(result).toEqual(true)
      })
    })

    describe('is not resolved', () => {
      it('returns false', () => {
        const mockState = getMockState({
          currentSessionID: 1,
          sessions: new Map([[1, { resolved: false }]]),
        })
        const result = selectors.isCurrentSessionResolved(mockState)

        expect(result).toEqual(false)
      })
    })
  })

  describe('no session', () => {
    it('returns false', () => {
      const mockState = getMockState({
        sessions: new Map(),
      })
      const result = selectors.isCurrentSessionResolved(mockState)

      expect(result).toEqual(false)
    })
  })
})

test('getGreeted returns the greeted state', () => {
  const result = selectors.getGreeted(getMockState({ greeted: true }))

  expect(result).toEqual(true)
})

test('getInitialFallbackSuggested returns the initialFallbackSuggested state', () => {
  const result = selectors.getInitialFallbackSuggested(
    getMockState({ initialFallbackSuggested: true })
  )

  expect(result).toEqual(true)
})

test('getContextualSearchShown returns the contextualSearchFinished state', () => {
  const result = selectors.getContextualSearchFinished(
    getMockState({ contextualSearchFinished: true })
  )

  expect(result).toEqual(true)
})

describe('getContextualSearchStatus', () => {
  it.each([
    [false, false, null, null, null],
    [true, true, 'text', 0, 'PENDING'],
    [false, true, 'text', 0, null],
    [true, true, 'botTyping', 0, null],
    [true, false, 'botTyping', 3, 'COMPLETED'],
    [true, false, 'botTyping', 0, 'NO_RESULTS'],
  ])(
    'fn(%p, %p, %s, %i)',
    (hasContextuallySearched, searchLoading, lastMessageType, resultsCount, expected) => {
      const result = selectors.getContextualSearchStatus.resultFunc(
        hasContextuallySearched,
        searchLoading,
        lastMessageType,
        resultsCount
      )

      expect(result).toEqual(expected)
    }
  )
})

describe('getContactButtonVisible', () => {
  test.each([
    [true, true, true],
    [true, false, false],
    [false, false, false],
    [false, true, false],
  ])(
    'when getInTouchVisible is %p && channelAvailable is %p, it returns %p',
    (getInTouchVisible, channelAvailable, expected) => {
      const result = selectors.getContactButtonVisible.resultFunc(
        getInTouchVisible,
        channelAvailable
      )

      expect(result).toEqual(expected)
    }
  )
})

describe('getAuthToken', () => {
  const createState = ({ sessionID, session }) => {
    const sessions = new Map()
    if (sessionID && session) {
      sessions.set(sessionID, session)
    }

    return {
      answerBot: {
        currentArticle: {
          sessionID,
        },
        sessions,
      },
    }
  }

  it('returns undefined when there is no current article session id', () => {
    expect(selectors.getAuthToken(createState({ sessionID: null }))).toBeUndefined()
  })

  it('returns undefined when session information is not known', () => {
    const state = createState({
      sessionID: '123',
      session: null,
    })

    expect(selectors.getAuthToken(state)).toBeUndefined()
  })

  it('returns undefined if sessions deflection is falsy', () => {
    const state = createState({
      sessionID: '123',
      session: {
        deflection: false,
      },
    })

    expect(selectors.getAuthToken(state)).toBeUndefined()
  })

  it("returns the session's auth token when it exists", () => {
    const state = createState({
      sessionID: '123',
      session: {
        deflection: {
          auth_token: 'token',
        },
      },
    })

    expect(selectors.getAuthToken(state)).toBe('token')
  })
})
