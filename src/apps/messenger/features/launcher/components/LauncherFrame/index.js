import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'

const LauncherFrame = ({ children }) => {
  return (
    <Frame
      title="TODO: Launcher"
      style={{
        height: 70,
        width: 70,
        position: 'fixed',
        bottom: 0,
        right: 0,
        border: 0
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
