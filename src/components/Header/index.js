import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locals as styles } from './index.scss'

const Header = ({ children, isMobile }) => {
  const headerClasses = classNames(styles.header, styles.userHeader)

  const titleClasses = classNames(styles.title, {
    [styles.titleMobile]: isMobile
  })

  return (
    <div className={headerClasses}>
      <h1 className={titleClasses}>{children}</h1>
    </div>
  )
}

Header.propTypes = {
  children: PropTypes.node,
  isMobile: PropTypes.bool
}

Header.defaultProps = {
  isMobile: false
}

export default Header
