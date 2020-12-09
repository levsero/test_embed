describe('chat reducer active agents', () => {
  let reducer, actionTypes, initialState

  beforeAll(() => {
    mockery.enable()

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/chat-active-agents')
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types')

    initMockRegistry({
      'src/embeds/chat/components/RatingGroup': {
        ratings: {}
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
      it('is set to an empty map object', () => {
        expect(initialState).toEqual(new Map())
      })
    })

    describe('when a SDK_AGENT_UPDATE action is dispatched', () => {
      let payload

      beforeEach(() => {
        payload = {
          detail: {
            nick: 'agent:mcbob',
            display_name: 'McBob',
            avatar_path: 'http://www.example.com/avatar.png',
            title: 'Bobliest Bob'
          }
        }
      })

      it('updates the agent with properties from the payload', () => {
        const currentState = new Map([['agent:mcbob', {}]])

        state = reducer(currentState, {
          type: actionTypes.SDK_AGENT_UPDATE,
          payload: payload
        })

        expect(state.get('agent:mcbob')).toEqual(jasmine.objectContaining(payload.detail))
      })

      it('does not update the agent if they are not in the chat', () => {
        state = reducer(initialState, {
          type: actionTypes.SDK_AGENT_UPDATE,
          payload: payload
        })

        expect(state.get('agent:mcbob')).toBeFalsy()
      })
    })

    describe('when a SDK_CHAT_TYPING action is dispatched', () => {
      let payload

      beforeEach(() => {
        const currentState = new Map([['agent:mcbob', {}]])

        payload = {
          detail: {
            type: 'typing',
            nick: 'agent:mcbob',
            typing: true
          }
        }

        state = reducer(currentState, {
          type: actionTypes.SDK_CHAT_TYPING,
          payload: payload
        })
      })

      it('updates the agents typing property', () => {
        expect(state.get('agent:mcbob').typing).toEqual(true)
      })
    })

    describe('when a SDK_CHAT_MEMBER_JOIN action is dispatched', () => {
      let payload

      beforeAll(() => {
        payload = {
          detail: {
            type: 'chat.memberjoin',
            nick: '',
            display_name: '',
            timestamp: Date.now()
          }
        }
      })

      describe('when the member is an agent', () => {
        beforeAll(() => {
          payload.detail.nick = 'agent:mcbob'
        })

        describe('when the member does not exist in the state already', () => {
          beforeEach(() => {
            state = reducer(initialState, {
              type: actionTypes.SDK_CHAT_MEMBER_JOIN,
              payload: payload
            })
          })

          it('adds an entry for the member', () => {
            expect(state.get('agent:mcbob')).toEqual(
              jasmine.objectContaining({
                nick: payload.detail.nick
              })
            )
          })
        })

        describe('when the member exists in the state already', () => {
          beforeEach(() => {
            const currentState = new Map([[{ 'agent:mcbob': {} }]])

            state = reducer(currentState, {
              type: actionTypes.SDK_CHAT_MEMBER_JOIN,
              payload: payload
            })
          })

          it('updates the entry for the member', () => {
            expect(state.get('agent:mcbob').nick).toEqual(payload.detail.nick)
          })
        })
      })

      describe('when the member is a visitor', () => {
        beforeEach(() => {
          payload.detail.nick = 'someguy'

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
      let payload, currentState

      beforeAll(() => {
        payload = {
          detail: {
            type: 'chat.memberleave',
            nick: '',
            display_name: '',
            timestamp: Date.now()
          }
        }

        currentState = new Map([['agent:mcbob', {}], ['agent:mcjim', {}]])
      })

      describe('when the member is an agent', () => {
        beforeEach(() => {
          payload.detail.nick = 'agent:mcbob'

          state = reducer(currentState, {
            type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
            payload: payload
          })
        })

        it('removes the state entry for the agent', () => {
          expect(state.get('agent:mcbob')).toBeUndefined()
        })

        it('keeps other agents in the state', () => {
          expect(state.get('agent:mcjim')).toEqual({})
        })
      })

      describe('when the member is a visitor', () => {
        beforeEach(() => {
          payload.detail.nick = 'visitor'

          state = reducer(currentState, {
            type: actionTypes.SDK_CHAT_MEMBER_LEAVE,
            payload: payload
          })
        })

        it('returns the initial state', () => {
          expect(state).toEqual(initialState)
        })
      })
    })

    describe('when a END_CHAT_REQUEST_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        const currentState = new Map([['agent:cena', {}]])

        state = reducer(currentState, {
          type: actionTypes.END_CHAT_REQUEST_SUCCESS
        })
      })

      it('resets reducer to initial state', () => {
        expect(state).toEqual(new Map())
      })
    })

    describe('when a CHAT_RECONNECT action is dispatched', () => {
      beforeEach(() => {
        const currentState = new Map([['agent:cena', {}]])

        state = reducer(currentState, {
          type: actionTypes.CHAT_RECONNECT
        })
      })

      it('resets reducer to initial state', () => {
        expect(state).toEqual(new Map())
      })
    })

    describe('when a CHAT_DROPPED action is dispatched', () => {
      beforeEach(() => {
        const currentState = new Map([['agent:cena', {}]])

        state = reducer(currentState, {
          type: actionTypes.CHAT_DROPPED
        })
      })

      it('resets reducer to initial state', () => {
        expect(state).toEqual(new Map())
      })
    })
  })
})
