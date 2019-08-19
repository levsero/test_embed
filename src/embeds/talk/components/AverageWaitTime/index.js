import React from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './styles.scss'

const AverageWaitTime = ({ message }) => {
  return <p className={styles.message}>{message}</p>
}

AverageWaitTime.propTypes = {
  message: PropTypes.string
}

export default AverageWaitTime
