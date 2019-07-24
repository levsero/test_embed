import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locals as styles } from './index.scss'
import { win } from 'utility/globals'
import { MAX_WIDGET_HEIGHT, MIN_WIDGET_HEIGHT, WIDGET_MARGIN } from 'constants/shared'

const calculateHeight = ({ isMobile = false, fullscreen = false, maxHeight }) => {
  if (fullscreen || isMobile) return null

  const winHeight = win.innerHeight

  if (winHeight < maxHeight) {
    return winHeight > MIN_WIDGET_HEIGHT
      ? winHeight - WIDGET_MARGIN * 2
      : MIN_WIDGET_HEIGHT - WIDGET_MARGIN * 2
  }

  return maxHeight
}

const Layout = ({ children, isMobile, fullscreen, maxHeight }) => {
  const layoutClasses = classNames(
    styles.container,
    styles.flexContainer,
    { [styles.desktop]: !isMobile },
    { [styles.desktopFullscreen]: isMobile || fullscreen },
    { [styles.desktopContainer]: !isMobile && !fullscreen }
  )

  return (
    <div
      style={{ height: calculateHeight({ fullscreen, isMobile, maxHeight }) }}
      className={layoutClasses}
    >
      {children}
    </div>
  )
}

Layout.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool,
  fullscreen: PropTypes.bool,
  maxHeight: PropTypes.number
}

Layout.defaultProps = {
  isMobile: false,
  fullscreen: false,
  children: [],
  maxHeight: MAX_WIDGET_HEIGHT
}

export default Layout
