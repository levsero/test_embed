import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon } from 'component/Icon'
import { ICONS } from 'src/constants/shared'

import { locals as styles } from './ChatHistoryLink.scss'
export default class ChatHistoryLink extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    hasChatHistory: PropTypes.bool.isRequired,
    openedChatHistory: PropTypes.func.isRequired,
    label: PropTypes.string.isRequired
  }

  render = () => {
    const { isAuthenticated, hasChatHistory, openedChatHistory, label } = this.props

    if (!isAuthenticated || !hasChatHistory) return null

    return (
      <div className={styles.linkDiv}>
        <Icon className={styles.icon} type={ICONS.CLOCK} />
        <a className={styles.linkText} onClick={openedChatHistory}>
          {label}
        </a>
      </div>
    )
  }
}
