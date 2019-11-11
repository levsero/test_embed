import { isMobileBrowser } from 'utility/devices'
import { updateWidgetShown } from 'src/redux/modules/base/base-actions'
import { getWebWidgetVisible } from 'src/redux/modules/selectors'
import { mediator } from 'service/mediator'
import { setScaleLock, getZoomSizingRatio } from 'utility/devices'
import { setScrollKiller, setWindowScroll, revertWindowScroll } from 'utility/scrollHacks'
import { onNextTick } from 'src/util/utils'

export default function onWidgetOpen(prevState, nextState, dispatch) {
  if (!getWebWidgetVisible(prevState) && getWebWidgetVisible(nextState)) {
    dispatch(updateWidgetShown(true))

    if (isMobileBrowser()) {
      onNextTick(() => {
        setScaleLock(true)
        setWindowScroll(0)
        setScrollKiller(true)
        mediator.channel.broadcast('.updateZoom', getZoomSizingRatio())
      })
    }
  } else if (getWebWidgetVisible(prevState) && !getWebWidgetVisible(nextState)) {
    dispatch(updateWidgetShown(false))
    mediator.channel.broadcast('webWidget.onClose')

    if (isMobileBrowser()) {
      setScaleLock(false)
      setScrollKiller(false)
      revertWindowScroll()
    }
  }
}
