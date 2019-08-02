import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locals as styles } from './styles.scss'

const WidgetFooter = ({ children, scrollShadowVisible }) => {
  const footerClasses = classNames(styles.footer, {
    [styles.footerShadow]: scrollShadowVisible
  })

  return <footer className={footerClasses}>{children}</footer>
}

WidgetFooter.propTypes = {
  children: PropTypes.node,
  scrollShadowVisible: PropTypes.bool
}

WidgetFooter.defaultProps = {
  scrollShadowVisible: false
}

export default WidgetFooter
