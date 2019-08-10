import React from 'react'
import PropTypes from 'prop-types'

import ErrorIcon from '@zendeskgarden/svg-icons/src/14/error.svg'
import { locals as styles } from './styles.scss'

const ErrorNotification = ({ message }) => {
  return (
    <div className={styles.error}>
      <ErrorIcon className={styles.errorIcon} />
      {message}
    </div>
  )
}

ErrorNotification.propTypes = {
  message: PropTypes.string
}

export default ErrorNotification
