import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './index.scss'

const Main = ({ children }) => {
  return <div className={styles.container}>{children}</div>
}

Main.propTypes = {
  children: PropTypes.node
}

Main.defaultProps = {
  children: []
}

export default Main
