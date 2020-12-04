import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import {
  bezierCurve,
  frameBoxShadow,
  frameMarginFromPage,
  launcherSize,
  zIndex
} from 'src/apps/messenger/constants'
import { useSelector } from 'react-redux'
import { getPosition } from 'src/apps/messenger/features/themeProvider/store'

import { getIsWidgetOpen } from 'src/apps/messenger/store/visibility'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen
} from 'src/apps/messenger/features/responsiveDesign/store'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { launcherAnimation } from './styles'

const LauncherFrame = ({ children }) => {
  const isWidgetOpen = useSelector(getIsWidgetOpen)
  const isFullScreen = useSelector(getIsFullScreen)
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const position = useSelector(getPosition)
  const isVisible = useSelector(getIsLauncherVisible)

  const shouldAnimate = !isFullScreen && !isVerticallySmallScreen

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: launcherAnimation
        }}
      />
      <Frame
        title="Launcher"
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
          animation:
            isWidgetOpen && shouldAnimate ? `launcherOnOpen 0.7s ${bezierCurve}` : undefined,
          zIndex: zIndex
        }}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </Frame>
    </>
  )
}

LauncherFrame.propTypes = {
  children: PropTypes.node
}

export default LauncherFrame
