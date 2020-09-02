import { configureStore, combineReducers } from '@reduxjs/toolkit'
import company from './company'
import visibility from './visibility'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import messengerColors from 'src/apps/messenger/features/themeProvider/reducer/messengerColors'
import messages from 'src/apps/messenger/features/messageLog/store'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      visibility,
      company,
      responsiveDesign,
      messengerColors,
      messages
    })
  })

  return store
}

export default createStore
