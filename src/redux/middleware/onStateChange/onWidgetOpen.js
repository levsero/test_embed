import { isMobileBrowser } from 'utility/devices'
import { updateWidgetShown } from 'src/redux/modules/base/base-actions'
import { getWebWidgetVisible } from 'src/redux/modules/selectors'
import { renderer } from 'service/renderer'
import { setScaleLock, getZoomSizingRatio } from 'utility/devices'
import { setScrollKiller, setWindowScroll, revertWindowScroll } from 'utility/scrollHacks'
import { FRAME_ANIMATION_DELAY } from 'src/constants/shared'

export default function onWidgetOpen(prevState, nextState, dispatch, getState) {
  if (!getWebWidgetVisible(prevState) && getWebWidgetVisible(nextState)) {
    dispatch(updateWidgetShown(true))

    if (isMobileBrowser()) {
      setTimeout(() => {
        if (getWebWidgetVisible(getState())) {
          setScaleLock(true)
          setWindowScroll(0)
          setScrollKiller(true)
          renderer.propagateFontRatio(getZoomSizingRatio())
        }
      }, FRAME_ANIMATION_DELAY)
    }
  } else if (getWebWidgetVisible(prevState) && !getWebWidgetVisible(nextState)) {
    dispatch(updateWidgetShown(false))

    if (isMobileBrowser()) {
      setScaleLock(false)
      setScrollKiller(false)
      revertWindowScroll()
    }
  }
}
