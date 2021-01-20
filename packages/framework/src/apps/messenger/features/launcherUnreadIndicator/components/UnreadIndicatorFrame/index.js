import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import {
  frameMarginFromPage,
  unreadIndicatorSize,
  launcherSize
} from 'src/apps/messenger/constants'
import { getZIndex } from 'src/apps/messenger/features/themeProvider/store'
import { useSelector } from 'react-redux'
import { getPosition } from 'src/apps/messenger/features/themeProvider/store'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'

import { GlobalStyles } from './styles'

const UnreadIndicatorFrame = ({ children }) => {
  const isVisible = useSelector(getIsLauncherVisible)
  const position = useSelector(getPosition)
  const zIndex = useSelector(getZIndex)

  const indicatorOffset = 4

  return (
    <Frame
      tabIndex="-1"
      title="LauncherUnreadIndicator"
      hidden={!isVisible}
      style={{
        zIndex,
        height: unreadIndicatorSize,
        width: unreadIndicatorSize + 20,
        position: 'fixed',
        bottom: frameMarginFromPage + launcherSize - unreadIndicatorSize + indicatorOffset,
        [position]: frameMarginFromPage - indicatorOffset,
        border: 0,
        marginTop: 0
      }}
    >
      <ThemeProvider>
        <>
          <GlobalStyles />
          {children}
        </>
      </ThemeProvider>
    </Frame>
  )
}

UnreadIndicatorFrame.propTypes = {
  children: PropTypes.node
}

export default UnreadIndicatorFrame
