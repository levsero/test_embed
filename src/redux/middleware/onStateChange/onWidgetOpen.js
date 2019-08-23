import { isMobileBrowser } from 'utility/devices'
import { getActiveEmbed } from 'src/redux/modules/base/base-selectors'
import { updateWidgetShown } from 'src/redux/modules/base/base-actions'
import { getWebWidgetVisible } from 'src/redux/modules/selectors'
import { setScrollKiller, setWindowScroll, revertWindowScroll } from 'utility/scrollHacks'

export default function onWidgetOpen(prevState, nextState, dispatch) {
  if (getActiveEmbed(nextState) === 'zopimChat') return

  if (!getWebWidgetVisible(prevState) && getWebWidgetVisible(nextState)) {
    dispatch(updateWidgetShown(true))

    if (isMobileBrowser()) {
      setTimeout(() => {
        setWindowScroll(0)
        setScrollKiller(true)
      }, 0)
    }
  } else if (getWebWidgetVisible(prevState) && !getWebWidgetVisible(nextState)) {
    dispatch(updateWidgetShown(false))

    if (isMobileBrowser()) {
      setScrollKiller(false)
      revertWindowScroll()
    }
  }
}
