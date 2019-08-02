import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'

const WidgetContainer = ({ children }) => <div className={styles.container}>{children}</div>

WidgetContainer.propTypes = {
  children: PropTypes.node
}

WidgetContainer.defaultProps = {
  children: []
}

export default WidgetContainer
