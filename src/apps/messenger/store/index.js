import { configureStore, combineReducers } from '@reduxjs/toolkit'
import visibility from './visibility'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import header from 'src/apps/messenger/features/header/store'
import messengerColors from 'src/apps/messenger/features/themeProvider/reducer/messengerColors'
import messages from 'src/apps/messenger/features/messageLog/store'

const createStore = () => {
  const store = configureStore({
    reducer: combineReducers({
      visibility,
      responsiveDesign,
      messengerColors,
      messages,
      header
    })
  })

  return store
}

export default createStore
