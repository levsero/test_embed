import { FRAME_ANIMATION_DELAY } from 'src/constants/shared'
import { updateWidgetShown } from 'src/redux/modules/base/base-actions'
import { getStandaloneMobileNotificationVisible } from 'src/redux/modules/chat/chat-selectors'
import { getWebWidgetVisibleOpenAndReady } from 'src/redux/modules/selectors'
import { isMobileBrowser } from 'src/util/devices'
import { setScaleLock } from 'src/util/devices'
import { setScrollKiller, setWindowScroll, revertWindowScroll } from 'src/util/scrollHacks'

export default function onWidgetOpen(prevState, nextState, dispatch, getState) {
  if (!getWebWidgetVisibleOpenAndReady(prevState) && getWebWidgetVisibleOpenAndReady(nextState)) {
    dispatch(updateWidgetShown(true))

    if (isMobileBrowser()) {
      setTimeout(() => {
        if (getWebWidgetVisibleOpenAndReady(getState())) {
          setScaleLock(true)
          if (!getStandaloneMobileNotificationVisible(getState())) {
            setWindowScroll(0)
            setScrollKiller(true)
          }
        }
      }, FRAME_ANIMATION_DELAY)
    }
  } else if (
    getWebWidgetVisibleOpenAndReady(prevState) &&
    !getWebWidgetVisibleOpenAndReady(nextState)
  ) {
    dispatch(updateWidgetShown(false))

    if (isMobileBrowser()) {
      setScaleLock(false)
      setScrollKiller(false)
      revertWindowScroll()
    }
  }
}
