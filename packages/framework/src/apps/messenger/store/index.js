import { configureStore, combineReducers } from '@reduxjs/toolkit'
import composer from 'src/apps/messenger/features/footer/store'
import header from 'src/apps/messenger/features/header/store'
import i18n from 'src/apps/messenger/features/i18n/store'
import launcherLabelConfig from 'src/apps/messenger/features/launcherLabel/store/config'
import launcherLabelVisibility from 'src/apps/messenger/features/launcherLabel/store/visibility'
import forms from 'src/apps/messenger/features/messageLog/Message/messages/FormStructuredMessage/store'
import typingIndicators from 'src/apps/messenger/features/messageLog/Message/messages/TypingIndicator/store'
import messages from 'src/apps/messenger/features/messageLog/store'
import onlineStatus from 'src/apps/messenger/features/onlineStatus/store'
import responsiveDesign from 'src/apps/messenger/features/responsiveDesign/store'
import theme from 'src/apps/messenger/features/themeProvider/store'
import integrations from 'src/apps/messenger/store/integrations'
import rememberConversationHistory from 'src/apps/messenger/store/rememberConversationHistory'
import unreadIndicator from 'src/apps/messenger/store/unreadIndicator'
import createResettableReducer from 'src/apps/messenger/utils/createResettableReducer'
import cookies from './cookies'
import visibility from './visibility'

const createStore = () => {
  const store = configureStore({
    devTools: __DEV__
      ? {
          name: 'Zendesk Messenger',
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
    }),
  })

  return store
}

export default createStore
