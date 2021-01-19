import { validate } from 'bcp47-validate'
import i18n from 'src/framework/services/i18n'
import { setLocale as suncoUpdateLocale } from 'src/apps/messenger/api/sunco'
import { widgetOpened, widgetClosed } from 'src/apps/messenger/store/visibility'
import logger from 'src/util/logger'
import { zIndexUpdated } from 'src/apps/messenger/store/actions'

export default store => ({
  messenger: {
    open: () => {
      store.dispatch(widgetOpened())
    },
    close: () => {
      store.dispatch(widgetClosed())
    }
  },
  ['messenger:set']: {
    __isSettingsApi: true,
    zIndex: zIndex => {
      if (typeof zIndex !== 'number') {
        logger.error("Invalid zIndex provided. Needs to be of type 'number'.")
        return
      }

      store.dispatch(zIndexUpdated(zIndex))
    },
    locale: locale => {
      if (!validate(locale)) {
        logger.error(
          'Invalid locale information provided. The locale format should be a BCP 47 language tag.'
        )
        return
      }
      suncoUpdateLocale(locale)
      i18n.setLocale(locale).catch(() => {})
    }
  }
})
