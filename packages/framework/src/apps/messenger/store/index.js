import { configureStore, combineReducers } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import composer from 'src/apps/messenger/features/footer/store'
import header from 'src/apps/messenger/features/header/store'
import i18n from 'src/apps/messenger/features/i18n/store'
import launcherConfig from 'src/apps/messenger/features/launcher/store'
import launcherLabelConfig from 'src/apps/messenger/features/launcherLabel/store/config'
import launcherLabelVisibility from 'src/apps/messenger/features/launcherLabel/store/visibility'
import forms from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import typingIndicators from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'
import messages from 'src/apps/messenger/features/messageLog/store'
import onlineStatus from 'src/apps/messenger/features/onlineStatus/store'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import { reducer as conversation } from 'src/apps/messenger/features/suncoConversation/store'
import theme from 'src/apps/messenger/features/themeProvider/store'
import integrations from 'src/apps/messenger/store/integrations'
import rememberConversationHistory from 'src/apps/messenger/store/rememberConversationHistory'
import unreadIndicator from 'src/apps/messenger/store/unreadIndicator'
import createResettableReducer from 'src/apps/messenger/utils/createResettableReducer'
import { store as persistence } from 'src/framework/services/persistence'
import { inDebugMode } from 'src/util/runtime'
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
      if (!__DEV__ && persistence.get('debug')) {
        return getDefaultMiddleware().concat(logger)
      }

      return getDefaultMiddleware()
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
      launcher: launcherConfig,
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
