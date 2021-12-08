import { FRAME_ANIMATION_DELAY } from 'classicSrc/constants/shared'
import { getStandaloneMobileNotificationVisible } from 'classicSrc/embeds/chat/selectors'
import { updateWidgetShown } from 'classicSrc/redux/modules/base/base-actions'
import { getWebWidgetVisibleOpenAndReady } from 'classicSrc/redux/modules/selectors'
import { isMobileBrowser, setScaleLock } from '@zendesk/widget-shared-services'
import {
  setScrollKiller,
  setWindowScroll,
  revertWindowScroll,
} from '@zendesk/widget-shared-services/util/scrollHacks'

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
