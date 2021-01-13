import { setLocale } from 'src/apps/messenger/store/locale'
import { setLocale as suncoUpdateLocale } from 'src/apps/messenger/api/sunco'
import { widgetOpened, widgetClosed } from 'src/apps/messenger/store/visibility'

export default store => ({
  messenger: {
    setLocale: locale => {
      suncoUpdateLocale(locale)
      store.dispatch(setLocale(locale))
    },
    open: () => {
      store.dispatch(widgetOpened())
    },
    close: () => {
      store.dispatch(widgetClosed())
    }
  }
})
