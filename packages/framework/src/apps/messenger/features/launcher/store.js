import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'src/apps/messenger/features/responsiveDesign/store'
import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'

const getIsLauncherVisible = (state) => {
  if (getIsWidgetOpen(state) && (getIsVerticallySmallScreen(state) || getIsFullScreen(state))) {
    return false
  }

  return true
}

export { getIsLauncherVisible }
