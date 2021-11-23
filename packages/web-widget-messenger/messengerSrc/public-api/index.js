import { validate } from 'bcp47-validate'
import { logger } from '@zendesk/widget-shared-services'
import i18n from 'src/framework/services/i18n'
import {
  setLocale as suncoUpdateLocale,
  loginUser,
  logoutUser,
  hasExistingConversation,
} from 'messengerSrc/api/sunco'
import { startConversation } from 'messengerSrc/features/suncoConversation/store'
import { userLoggedOut, zIndexUpdated } from 'messengerSrc/store/actions'
import { cookiesEnabled, cookiesDisabled } from 'messengerSrc/store/cookies'
import { widgetOpened, widgetClosed } from 'messengerSrc/store/visibility'

export default (store) => ({
  messenger: {
    open: () => {
      store.dispatch(widgetOpened())
    },
    close: () => {
      store.dispatch(widgetClosed())
    },
    loginUser: (getJWTFn) => {
      loginUser(getJWTFn)
        .then(() => {
          if (hasExistingConversation()) {
            store.dispatch(startConversation())
          }
        })
        .catch((error) => {
          logger.error('Unable to login user', error)
        })
    },
    logoutUser: () => {
      logoutUser()
        .then(() => {
          store.dispatch(userLoggedOut())
        })
        .catch((error) => {
          logger.error('Unable to logout user', error)
        })
    },
  },
  ['messenger:set']: {
    __isSettingsApi: true,
    zIndex: (zIndex) => {
      if (typeof zIndex !== 'number') {
        logger.error("Invalid zIndex provided. Needs to be of type 'number'.")
        return
      }

      store.dispatch(zIndexUpdated(zIndex))
    },
    locale: (locale) => {
      if (!validate(locale)) {
        logger.error(
          'Invalid locale information provided. The locale format should be a BCP 47 language tag.'
        )
        return
      }
      suncoUpdateLocale(locale)
      i18n.setLocale(locale).catch(() => {})
    },
    cookies: (enable) => {
      if (typeof enable !== 'boolean') {
        logger.error("Invalid argument provided. Needs to be of type 'boolean'.")
      }

      if (enable) {
        store.dispatch(cookiesEnabled())
      } else {
        store.dispatch(cookiesDisabled())
      }
    },
  },
})
