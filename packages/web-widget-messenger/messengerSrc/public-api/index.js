import { validate } from 'bcp47-validate'
import { logger } from '@zendesk/widget-shared-services'
import { errorTracker } from '@zendesk/widget-shared-services/errorTracker'
import isFeatureEnabled from '@zendesk/widget-shared-services/feature-flags'
import { setLocale as suncoUpdateLocale } from 'messengerSrc/api/sunco'
import i18n from 'messengerSrc/features/i18n'
import { zIndexUpdated } from 'messengerSrc/store/actions'
import { loginUser, logoutUser } from 'messengerSrc/store/authentication'
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
    ...(isFeatureEnabled(null, 'web_widget_jwt_auth') && {
      loginUser: (getJWTFn) => {
        if (!getJWTFn || typeof getJWTFn !== 'function') {
          const errorMessage =
            "Invalid argument provided for loginUser. Needs to be of type 'function'"
          logger.error(errorMessage)
          errorTracker.error(new Error(errorMessage))
          return
        }

        store.dispatch(loginUser(getJWTFn))
      },
      logoutUser: () => {
        store.dispatch(logoutUser())
      },
    }),
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
