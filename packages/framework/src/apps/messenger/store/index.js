import { configureStore, combineReducers } from '@reduxjs/toolkit'
import visibility from './visibility'
import i18n from 'src/apps/messenger/features/i18n/store'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import onlineStatus from 'src/apps/messenger/features/onlineStatus/store'
import header from 'src/apps/messenger/features/header/store'
import theme from 'src/apps/messenger/features/themeProvider/store'
import messages from 'src/apps/messenger/features/messageLog/store'
import forms from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import unreadIndicator from 'src/apps/messenger/store/unreadIndicator'
import typingIndicators from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'
import launcherLabel from 'src/apps/messenger/features/launcherLabel/store'
import composer from 'src/apps/messenger/features/footer/store'
import cookies from './cookies'
import createResettableReducer from 'src/apps/messenger/utils/createResettableReducer'

const createStore = () => {
  const store = configureStore({
    devTools: __DEV__
      ? {
          name: 'Zendesk Messenger'
        }
      : undefined,
    reducer: combineReducers({
      visibility: createResettableReducer(visibility),
      i18n,
      responsiveDesign,
      onlineStatus,
      theme,
      messages: createResettableReducer(messages),
      header,
      forms: createResettableReducer(forms),
      launcherLabel,
      typingIndicators: createResettableReducer(typingIndicators),
      unreadIndicator: createResettableReducer(unreadIndicator),
      composer: createResettableReducer(composer),
      cookies
    })
  })

  return store
}

export default createStore
