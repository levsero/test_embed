import { configureStore, combineReducers } from '@reduxjs/toolkit'
import companyReducer from './company'
import visibilityReducer from './visibility'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      visibility: visibilityReducer,
      company: companyReducer,
      responsiveDesign
    })
  })

  return store
}

export default createStore
