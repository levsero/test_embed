import { configureStore, combineReducers } from '@reduxjs/toolkit'
import coreWidgetReducer from 'src/apps/messenger/features/core/store'
import headerReducer from 'src/apps/messenger/features/header/store'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      core: coreWidgetReducer,
      header: headerReducer
    })
  })

  return store
}

export default createStore
