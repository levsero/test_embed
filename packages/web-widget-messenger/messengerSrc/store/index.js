import { configureStore, combineReducers } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { store as persistence } from 'src/framework/services/persistence'
import { inDebugMode } from 'src/util/runtime'
import composer from 'messengerSrc/features/footer/store'
import header from 'messengerSrc/features/header/store'
import i18n from 'messengerSrc/features/i18n/store'
import launcherLabelConfig from 'messengerSrc/features/launcherLabel/store/config'
import launcherLabelVisibility from 'messengerSrc/features/launcherLabel/store/visibility'
import forms from 'messengerSrc/features/messageLog/Message/messages/FormStructuredMessage/store'
import typingIndicators from 'messengerSrc/features/messageLog/Message/messages/TypingIndicator/store'
import messages from 'messengerSrc/features/messageLog/store'
import onlineStatus from 'messengerSrc/features/onlineStatus/store'
import responsiveDesign from 'messengerSrc/features/responsiveDesign/store'
import { reducer as conversation } from 'messengerSrc/features/suncoConversation/store'
import theme from 'messengerSrc/features/themeProvider/store'
import integrations from 'messengerSrc/store/integrations'
import errorLoggerMiddleware from 'messengerSrc/store/middleware/errorLoggerMiddleware'
import rememberConversationHistory from 'messengerSrc/store/rememberConversationHistory'
import unreadIndicator from 'messengerSrc/store/unreadIndicator'
import createResettableReducer from 'messengerSrc/utils/createResettableReducer'
import cookies from './cookies'
import visibility from './visibility'

const createStore = () => {
  const store = configureStore({
    devTools:
      __DEV__ || inDebugMode()
        ? {
            name: 'Zendesk Messenger',
          }
        : undefined,
    middleware: (getDefaultMiddleware) => {
      let middleware = getDefaultMiddleware()

      if (!__DEV__ && persistence.get('debug')) {
        middleware = middleware.concat(logger)
      }

      middleware = middleware.concat(errorLoggerMiddleware)

      return middleware
    },

    reducer: combineReducers({
      visibility: createResettableReducer(visibility),
      i18n,
      responsiveDesign,
      onlineStatus,
      theme,
      messages: createResettableReducer(messages),
      header,
      forms: createResettableReducer(forms),
      launcherLabel: combineReducers({
        config: launcherLabelConfig,
        visibility: createResettableReducer(launcherLabelVisibility),
      }),
      typingIndicators: createResettableReducer(typingIndicators),
      unreadIndicator: createResettableReducer(unreadIndicator),
      composer: createResettableReducer(composer),
      cookies,
      integrations,
      rememberConversationHistory,
      conversation: createResettableReducer(conversation),
    }),
  })

  return store
}

export default createStore
