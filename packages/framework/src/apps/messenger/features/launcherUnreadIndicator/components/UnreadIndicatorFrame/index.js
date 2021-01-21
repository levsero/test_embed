import React from 'react'
import PropTypes from 'prop-types'
import Frame from 'src/framework/components/Frame'
import ThemeProvider from 'src/apps/messenger/features/themeProvider'
import {
  frameMarginFromPage,
  unreadIndicatorSize,
  launcherSize
} from 'src/apps/messenger/constants'
import { getZIndex, getPosition } from 'src/apps/messenger/features/themeProvider/store'
import { useSelector } from 'react-redux'
import { getIsLauncherVisible } from 'src/apps/messenger/features/launcher/store'
import useTranslate from 'src/apps/messenger/features/i18n/useTranslate'

import { GlobalStyles } from './styles'

const UnreadIndicatorFrame = ({ children }) => {
  const isVisible = useSelector(getIsLauncherVisible)
  const position = useSelector(getPosition)
  const zIndex = useSelector(getZIndex)
  const translate = useTranslate()

  const indicatorOffset = 4

  return (
    <Frame
      tabIndex="-1"
      title={translate('embeddable_framework.messenger.unread_indicator.frame.title')}
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
