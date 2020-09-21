import { configureStore, combineReducers } from '@reduxjs/toolkit'
import visibility from './visibility'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import header from 'src/apps/messenger/features/header/store'
import theme from 'src/apps/messenger/features/themeProvider/store'
import messages from 'src/apps/messenger/features/messageLog/store'

const createStore = () => {
  const store = configureStore({
    devTools: __DEV__
      ? {
          name: 'Zendesk Messenger'
        }
      : undefined,
    reducer: combineReducers({
      visibility,
      responsiveDesign,
      theme,
      messages,
      header
    })
  })

  return store
}

export default createStore
