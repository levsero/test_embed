import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Alert } from '@zendeskgarden/react-notifications'
import { locals as styles } from './MessageError.scss'

import classNames from 'classnames'

export class MessageError extends Component {
  static propTypes = {
    errorMessage: PropTypes.string.isRequired,
    handleError: PropTypes.func,
    className: PropTypes.string,
    messageErrorClasses: PropTypes.string
  }

  static defaultProps = {
    messageErrorClasses: ''
  }

  render() {
    let errorTag
    const { messageErrorClasses } = this.props
    const errorClasses = classNames(styles.container, this.props.className)

    if (this.props.handleError) {
      errorTag = (
        <button
          className={`${styles.messageErrorLink} ${messageErrorClasses}`}
          onClick={this.props.handleError}
        >
          {this.props.errorMessage}
        </button>
      )
    } else {
      errorTag = <span className={messageErrorClasses}>{this.props.errorMessage}</span>
    }

    return (
      <Alert type="error" role="alert" className={errorClasses}>
        {errorTag}
      </Alert>
    )
  }
}
