import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locals as styles } from './styles.scss'
import { isMobileBrowser } from 'utility/devices'

const WidgetHeader = ({ children }) => {
  const headerClasses = classNames(styles.header, {
    [styles.headerMobile]: isMobileBrowser()
  })

  const titleClasses = classNames(styles.title)

  return (
    <div className={headerClasses}>
      <h1 className={titleClasses}>{children}</h1>
    </div>
  )
}

WidgetHeader.propTypes = {
  children: PropTypes.node
}

export default WidgetHeader
