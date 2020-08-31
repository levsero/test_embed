import { configureStore, combineReducers } from '@reduxjs/toolkit'
import companyReducer from './company'
import visibilityReducer from './visibility'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import messengerColors from 'src/apps/messenger/features/themeProvider/reducer/messengerColors'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      visibility: visibilityReducer,
      company: companyReducer,
      responsiveDesign,
      messengerColors
    })
  })

  return store
}

export default createStore
