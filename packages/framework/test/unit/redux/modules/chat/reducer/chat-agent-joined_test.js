describe('chat reducer agentJoined', () => {
  let reducer, actionTypes, initialState

  beforeAll(() => {
    mockery.enable()

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-agent-joined')
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types')

    initMockRegistry({
      'constants/chat': {
        AGENT_BOT: 'agent:trigger'
      }
    })

    reducer = requireUncached(reducerPath).default
    actionTypes = requireUncached(actionTypesPath)

    initialState = reducer(undefined, { type: '' })
  })

  afterAll(() => {
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('reducer', () => {
    let state

    describe('initial state', () => {
      it('is set to false', () => {
        expect(initialState).toEqual(false)
      })
    })

    describe('when a SDK_CHAT_MEMBER_JOIN action is dispatched', () => {
      let payload

      describe('when the member is a visitor', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'visitor:xxx'
            }
          }

          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_MEMBER_JOIN,
            payload: payload
          })
        })

        it('does not change the state', () => {
          expect(state).toEqual(initialState)
        })
      })

      describe('when the member is an agent', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'agent:xxx'
            }
          }

          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_MEMBER_JOIN,
            payload: payload
          })
        })

        it('sets state to true', () => {
          expect(state).toEqual(true)
        })
      })

      describe('when the member is an agent bot', () => {
        beforeEach(() => {
          payload = {
            detail: {
              nick: 'agent:trigger'
            }
          }

          state = reducer(initialState, {
            type: actionTypes.SDK_CHAT_MEMBER_JOIN,
            payload: payload
          })
        })

        it('does not change the state', () => {
          expect(state).toEqual(initialState)
        })
      })
    })

    describe('when a SDK_CHAT_MEMBER_LEAVE action is dispatched', () => {
      let payload
      const randomState = {
        yolo: 'yolo'
      }

      beforeEach(() => {
        state = reducer(randomState, {
          type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
          payload
        })
      })

      describe('when agent leaves', () => {
        beforeAll(() => {
          payload = {
            detail: {
              nick: 'agent:123'
            }
          }
        })

        it('does not change state', () => {
          expect(state).toEqual(randomState)
        })
      })

      describe('when user leaves', () => {
        beforeAll(() => {
          payload = {
            detail: {
              nick: 'visitor'
            }
          }
        })

        it('clears the state', () => {
          expect(state).toEqual(initialState)
        })
      })
    })

    describe('when a END_CHAT_REQUEST_SUCCESS action is dispatched', () => {
      describe('when the member is an agent', () => {
        beforeEach(() => {
          state = reducer(initialState, {
            type: actionTypes.END_CHAT_REQUEST_SUCCESS
          })
        })

        it('should set the state to false', () => {
          expect(state).toEqual(false)
        })
      })
    })
  })
})