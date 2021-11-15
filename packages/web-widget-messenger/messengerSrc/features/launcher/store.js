import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'messengerSrc/features/responsiveDesign/store'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'

const getIsLauncherVisible = (state) => {
  if (getIsWidgetOpen(state) && (getIsVerticallySmallScreen(state) || getIsFullScreen(state))) {
    return false
  }

  return true
}

export { getIsLauncherVisible }
