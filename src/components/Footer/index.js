import React from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import { locals as styles } from './index.scss'

const Footer = ({ children, scrollShadowVisible }) => {
  const footerClasses = classNames(styles.footer, scrollShadowVisible ? styles.footerShadow : '')

  return <footer className={footerClasses}>{children}</footer>
}

Footer.propTypes = {
  children: PropTypes.node,
  scrollShadowVisible: PropTypes.bool
}

Footer.defaultProps = {
  scrollShadowVisible: false
}

export default Footer
