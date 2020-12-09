describe('chat reducer suppress', () => {
  let reducer, actionTypes, initialState

  beforeAll(() => {
    const reducerPath = buildSrcPath('redux/modules/settings/reducer/chat/chat-suppress')
    const actionTypesPath = buildSrcPath('redux/modules/settings/settings-action-types')

    reducer = requireUncached(reducerPath).default

    initialState = reducer(undefined, { type: '' })
    actionTypes = requireUncached(actionTypesPath)
  })

  afterAll(() => {
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('initial state', () => {
    it('is set to false', () => {
      expect(initialState).toEqual(false)
    })
  })

  describe('when an UPDATE_SETTINGS action is dispatched', () => {
    let payload, state

    beforeEach(() => {
      state = reducer(initialState, {
        type: actionTypes.UPDATE_SETTINGS,
        payload: payload
      })
    })

    describe('when valid properties are set', () => {
      beforeAll(() => {
        payload = {
          webWidget: {
            chat: {
              suppress: true
            }
          }
        }
      })

      it('updates the value', () => {
        expect(state).toEqual(true)
      })
    })

    describe('when invalid properties are set', () => {
      beforeAll(() => {
        payload = {
          webWidget: {
            yeah: 'nah'
          }
        }
      })

      it('does nothing', () => {
        expect(state).toEqual(initialState)
      })
    })
  })
})
