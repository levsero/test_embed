import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'

const WidgetMain = ({ children }) => <div className={styles.container}>{children}</div>

WidgetMain.propTypes = {
  children: PropTypes.node
}

WidgetMain.defaultProps = {
  children: []
}

export default WidgetMain
