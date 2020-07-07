import { configureStore, combineReducers } from '@reduxjs/toolkit'
import throwawayReducer from './throwaway'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      throwaway: throwawayReducer
    })
  })

  return store
}

export default createStore
