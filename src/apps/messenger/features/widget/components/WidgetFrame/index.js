import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import { getFrameStyles } from './styles'
import { useSelector } from 'react-redux'
import {
  getIsFullScreen,
  getIsVerticallySmallScreen
} from 'src/apps/messenger/features/responsiveDesign/store'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import { getPosition } from 'src/apps/messenger/features/themeProvider/reducer/store'

const MessengerFrame = ({ children }) => {
  const isVerticallySmallScreen = useSelector(getIsVerticallySmallScreen)
  const isLauncherVisible = useSelector(getIsLauncherVisible)
  const isFullScreen = useSelector(getIsFullScreen)
  const position = useSelector(getPosition)

  return (
    <Frame
      title="Messenger"
      style={getFrameStyles({ isVerticallySmallScreen, isLauncherVisible, isFullScreen, position })}
    >
      <ThemeProvider>{children}</ThemeProvider>
    </Frame>
  )
}

MessengerFrame.propTypes = {
  children: PropTypes.node
}

export default MessengerFrame
