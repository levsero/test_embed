import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import { frameBoxShadow, frameMarginFromPage, launcherSize } from 'src/apps/messenger/constants'
import { useSelector } from 'react-redux'
import { getPosition } from 'src/apps/messenger/features/themeProvider/reducer/store'

const LauncherFrame = ({ children }) => {
  const position = useSelector(getPosition)

  return (
    <Frame
      title="Launcher"
      style={{
        height: launcherSize,
        width: launcherSize,
        position: 'fixed',
        bottom: frameMarginFromPage,
        [position]: frameMarginFromPage,
        border: 0,
        marginTop: 0,
        boxShadow: frameBoxShadow
      }}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </Frame>
  )
}

LauncherFrame.propTypes = {
  children: PropTypes.node
}

export default LauncherFrame
