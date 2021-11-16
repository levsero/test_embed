import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { FRAME_ANIMATION_DURATION } from '@zendesk/conversation-components'
import Frame from 'src/framework/components/Frame'
import {
  bezierCurve,
  frameBoxShadow,
  frameMarginFromPage,
  launcherSize,
  frameBorderRadius,
} from 'messengerSrc/constants'
import useTranslate from 'messengerSrc/features/i18n/useTranslate'
import { getIsLauncherVisible, getLauncherShape } from 'messengerSrc/features/launcher/store'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen,
} from 'messengerSrc/features/responsiveDesign/store'
import ThemeProvider from 'messengerSrc/features/themeProvider'
import { getPosition, getZIndex } from 'messengerSrc/features/themeProvider/store'
import { getIsWidgetOpen } from 'messengerSrc/store/visibility'
import { launcherAnimation } from './styles'

const LauncherFrame = ({ children }) => {
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const isFullScreen = useSelector(getIsFullScreen)
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const position = useSelector(getPosition)
  const isVisible = useSelector(getIsLauncherVisible)
  const zIndex = useSelector(getZIndex)
  const shape = useSelector(getLauncherShape)
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
          animation: `webSDKOnLoad 0.2s ease-in, ${
            isWidgetOpen && shouldAnimate
              ? `launcherOnOpen ${FRAME_ANIMATION_DURATION}s ${bezierCurve}`
              : undefined
          }`,
          zIndex,
          borderRadius: frameBorderRadius[shape],
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
