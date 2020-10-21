import { configureStore, combineReducers } from '@reduxjs/toolkit'
import visibility from './visibility'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import connectionStatus from 'src/apps/messenger/features/connectionStatus/store'
import header from 'src/apps/messenger/features/header/store'
import theme from 'src/apps/messenger/features/themeProvider/store'
import messages from 'src/apps/messenger/features/messageLog/store'
import forms from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import unreadIndicator from 'src/apps/messenger/store/unreadIndicator'
import typingIndicators from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'
import launcherLabel from 'src/apps/messenger/features/launcherLabel/store'
import composer from 'src/apps/messenger/features/footer/store'

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
      connectionStatus,
      theme,
      messages,
      header,
      forms,
      launcherLabel,
      typingIndicators,
      unreadIndicator,
      composer
    })
  })

  return store
}

export default createStore
