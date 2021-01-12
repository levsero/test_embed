import i18n from 'src/framework/services/i18n'
import { setLocale as suncoUpdateLocale } from 'src/apps/messenger/api/sunco'
import { widgetOpened, widgetClosed } from 'src/apps/messenger/store/visibility'

export default store => ({
  messenger: {
    setLocale: locale => {
      suncoUpdateLocale(i18n.getLocale())
      i18n.setLocale(locale).catch(() => {})
    },
    open: () => {
      store.dispatch(widgetOpened())
    },
    close: () => {
      store.dispatch(widgetClosed())
    }
  }
})
