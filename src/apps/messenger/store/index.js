import { configureStore, combineReducers } from '@reduxjs/toolkit'
import throwawayReducer from './throwaway'
import coreWidgetReducer from 'src/apps/messenger/features/core/store'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      throwaway: throwawayReducer,
      core: coreWidgetReducer
    })
  })

  return store
}

export default createStore
