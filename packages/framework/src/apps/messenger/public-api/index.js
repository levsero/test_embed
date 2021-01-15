import i18n from 'src/framework/services/i18n'
import { setLocale as suncoUpdateLocale } from 'src/apps/messenger/api/sunco'
import { widgetOpened, widgetClosed } from 'src/apps/messenger/store/visibility'

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
    locale: locale => {
      suncoUpdateLocale(locale)
      i18n.setLocale(locale).catch(() => {})
    }
  }
})
