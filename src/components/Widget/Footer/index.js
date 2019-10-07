import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locals as styles } from './styles.scss'

const Footer = ({ children, scrollShadowVisible, minimal }) => {
  const footerClasses = classNames(styles.footer, {
    [styles.footerShadow]: scrollShadowVisible,
    [styles.minimal]: minimal
  })

  return <footer className={footerClasses}>{children}</footer>
}

Footer.propTypes = {
  children: PropTypes.node,
  scrollShadowVisible: PropTypes.bool,
  minimal: PropTypes.bool
}

Footer.defaultProps = {
  scrollShadowVisible: false
}

export default Footer
