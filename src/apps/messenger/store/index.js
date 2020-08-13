import { configureStore, combineReducers } from '@reduxjs/toolkit'
import companyReducer from './company'
import visibilityReducer from './visibility'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      visibility: visibilityReducer,
      company: companyReducer
    })
  })

  return store
}

export default createStore
