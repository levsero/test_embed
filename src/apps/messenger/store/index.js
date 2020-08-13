import { configureStore, combineReducers } from '@reduxjs/toolkit'
import coreWidgetReducer from 'src/apps/messenger/features/core/store'
import companyReducer from './company'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      core: coreWidgetReducer,
      company: companyReducer
    })
  })

  return store
}

export default createStore
