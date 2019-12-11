describe('chat reducer accountSettings theme', () => {
  let reducer, actionTypes, initialState

  beforeAll(() => {
    mockery.enable()

    const reducerPath = buildSrcPath('redux/modules/chat/reducer/account-settings/theme')
    const actionTypesPath = buildSrcPath('redux/modules/chat/chat-action-types')

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
      it('sets the initial state to an empty with an empty message_type property', () => {
        const expected = {
          message_type: '',
          color: {
            primary: '',
            banner: ''
          },
          position: ''
        }

        expect(initialState).toEqual(expected)
      })
    })

    describe('when a GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS action is dispatched', () => {
      beforeEach(() => {
        const mockSettings = {
          theme: {
            message_type: 'bubble_avatar',
            chat_window: {
              position: 'bl'
            },
            colors: {
              primary: 'blah',
              banner: 'yeet'
            }
          }
        }

        state = reducer(initialState, {
          type: actionTypes.GET_ACCOUNT_SETTINGS_REQUEST_SUCCESS,
          payload: mockSettings
        })
      })

      it('sets the action payload as the state', () => {
        const expected = {
          message_type: 'bubble_avatar',
          position: 'bl',
          color: {
            primary: 'blah',
            banner: 'yeet'
          }
        }

        expect(state).toEqual(expected)
      })
    })

    describe('when a UPDATE_PREVIEWER_SETTINGS action is dispatched', () => {
      beforeEach(() => {
        const mockSettings = {
          theme: {
            message_type: 'bubble_avatar',
            chat_window: {
              position: 'b'
            },
            colors: {
              primary: 'fasdfasf'
            }
          }
        }

        state = reducer(initialState, {
          type: actionTypes.UPDATE_PREVIEWER_SETTINGS,
          payload: mockSettings
        })
      })

      it('sets the action payload as the state', () => {
        const expected = {
          message_type: 'bubble_avatar',
          position: 'b',
          color: {
            primary: 'fasdfasf',
            banner: ''
          }
        }

        expect(state).toEqual(expected)
      })
    })
  })
})
