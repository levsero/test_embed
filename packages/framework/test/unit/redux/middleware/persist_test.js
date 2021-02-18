describe('persist middleware', () => {
  let persist
  const storeSetSpy = jasmine.createSpy('store.set')

  const UPDATE_ACTIVE_EMBED = 'UPDATE_ACTIVE_EMBED'
  const UPDATE_WIDGET_SHOWN = 'UPDATE_WIDGET_SHOWN'
  const SDK_CHAT_MEMBER_JOIN = 'SDK_CHAT_MEMBER_JOIN'
  const SDK_CHAT_MEMBER_LEAVE = 'SDK_CHAT_MEMBER_LEAVE'
  const END_CHAT_REQUEST_SUCCESS = 'END_CHAT_REQUEST_SUCCESS'

  beforeEach(() => {
    const persistPath = buildSrcPath('redux/middleware/persist')

    mockery.enable()
    initMockRegistry({
      'src/framework/services/persistence': {
        store: {
          set: storeSetSpy,
        },
      },
      'src/redux/modules/base/base-action-types': {
        UPDATE_ACTIVE_EMBED,
        UPDATE_WIDGET_SHOWN,
      },
      'src/redux/modules/chat/chat-action-types': {
        SDK_CHAT_MEMBER_JOIN,
        SDK_CHAT_MEMBER_LEAVE,
        END_CHAT_REQUEST_SUCCESS,
      },
    })

    persist = requireUncached(persistPath).default
  })

  afterAll(() => {
    mockery.disable()
    mockery.deregisterAll()
  })

  describe('persist', () => {
    let action
    const nextSpy = jasmine.createSpy('nextSpy')
    const flatState = {
      chat: {
        chats: {},
        is_chatting: true, // eslint-disable-line camelcase
      },
      base: {
        activeEmbed: 'chat',
        widgetShown: true,
        somethingElse: 'test',
      },
    }

    describe('next', () => {
      beforeEach(() => {
        action = { type: 'random_type' }
        persist({ getState: () => flatState })(nextSpy)(action)
      })

      it('calls next function', () => {
        expect(nextSpy).toHaveBeenCalledWith({ type: 'random_type' })
      })
    })

    describe('when the action is included in the actionsToStoreOn array', () => {
      const actionsToStoreOn = [
        UPDATE_ACTIVE_EMBED,
        UPDATE_WIDGET_SHOWN,
        SDK_CHAT_MEMBER_JOIN,
        SDK_CHAT_MEMBER_LEAVE,
        END_CHAT_REQUEST_SUCCESS,
      ]

      actionsToStoreOn.forEach((actionType) => {
        beforeEach(() => {
          action = { type: actionType }

          persist({ getState: () => flatState })(nextSpy)(action)
        })

        it(`calls store.set with the parts of base state we want to store for ${actionType}`, () => {
          const expected = {
            activeEmbed: 'chat',
            widgetShown: true,
            is_chatting: true, // eslint-disable-line camelcase
          }

          expect(storeSetSpy).toHaveBeenCalledWith('store', expected)
        })
      })
    })
  })
})
