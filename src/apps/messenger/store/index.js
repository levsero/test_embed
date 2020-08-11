import { configureStore, combineReducers } from '@reduxjs/toolkit'
import companyReducer from './company'
import messengerVisibilityReducer from './messengerVisibility'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      messengerVisibility: messengerVisibilityReducer,
      company: companyReducer
    })
  })

  return store
}

export default createStore
