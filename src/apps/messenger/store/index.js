import { configureStore, combineReducers } from '@reduxjs/toolkit'
import coreWidgetReducer from 'src/apps/messenger/features/core/store'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      core: coreWidgetReducer
    })
  })

  return store
}

export default createStore
