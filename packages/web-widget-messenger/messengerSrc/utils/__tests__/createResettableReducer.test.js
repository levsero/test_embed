import { createStore } from 'redux'
import createResettableReducer, {
  resettableActions,
} from 'messengerSrc/utils/createResettableReducer'

describe('createResettableReducer', () => {
  const exampleReducer = (state = 'initial state', action) => {
    if (action.type === 'example action') {
      return 'other state'
    }

    return state
  }

  const createExampleStore = () => createStore(createResettableReducer(exampleReducer))
  const createExampleStoreWithExcludes = () =>
    createStore(createResettableReducer(exampleReducer, { excludeActions: ['userLoggedIn'] }))

  Object.keys(resettableActions).forEach((actionType) => {
    it(`resets state when action ${actionType} is dispatched`, () => {
      const store = createExampleStore()

      expect(store.getState()).toBe('initial state')

      store.dispatch({ type: 'example action' })

      expect(store.getState()).toBe('other state')

      store.dispatch({ type: actionType })

      expect(store.getState()).toBe('initial state')
    })
  })
  describe('when an action is in the exclues list', () => {
    it(`does not reset the reducer`, () => {
      const store = createExampleStoreWithExcludes()

      expect(store.getState()).toBe('initial state')

      store.dispatch({ type: 'example action' })

      expect(store.getState()).toBe('other state')

      store.dispatch({ type: 'userLoggedIn' })

      expect(store.getState()).toBe('other state')
    })
  })
})
