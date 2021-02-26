import PropTypes from 'prop-types'
import { FRAME_ANIMATION_DURATION } from '@zendesk/conversation-components'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import {
  bezierCurve,
  frameBoxShadow,
  frameMarginFromPage,
  launcherSize,
} from 'src/apps/messenger/constants'
import { useSelector } from 'react-redux'
import { getPosition, getZIndex } from 'src/apps/messenger/features/themeProvider/store'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'src/apps/messenger/features/responsiveDesign/store'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { launcherAnimation } from './styles'

const LauncherFrame = ({ children }) => {
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const isFullScreen = useSelector(getIsFullScreen)
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const position = useSelector(getPosition)
  const isVisible = useSelector(getIsLauncherVisible)
  const zIndex = useSelector(getZIndex)
  const translate = useTranslate()

  const shouldAnimate = !isFullScreen && !isVerticallySmallScreen
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: launcherAnimation,
        }}
      />
      <Frame
        title={translate('embeddable_framework.messenger.launcher.frame.title')}
        hidden={!isVisible}
        style={{
          height: launcherSize,
          width: launcherSize,
          position: 'fixed',
          bottom: frameMarginFromPage,
          [position]: frameMarginFromPage,
          border: 0,
          marginTop: 0,
          boxShadow: frameBoxShadow,
          animation: `onLoad 0.2s ease-in, ${
            isWidgetOpen && shouldAnimate
              ? `launcherOnOpen ${FRAME_ANIMATION_DURATION}s ${bezierCurve}`
              : undefined
          }`,
          zIndex,
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </Frame>
    </>
  )
}

LauncherFrame.propTypes = {
  children: PropTypes.node,
}

export default LauncherFrame
