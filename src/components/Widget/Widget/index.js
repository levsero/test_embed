import React from 'react'
import PropTypes from 'prop-types'
import { locals as styles } from './styles.scss'

const Widget = ({ children }) => <div className={styles.container}>{children}</div>

Widget.propTypes = {
  children: PropTypes.node
}

Widget.defaultProps = {
  children: []
}

export default Widget
