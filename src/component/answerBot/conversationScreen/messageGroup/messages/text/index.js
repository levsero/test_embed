import React from 'react'
import PropTypes from 'prop-types'

import { MessageBubble } from 'component/shared/MessageBubble'

import { locals as styles } from '../style.scss'

const Text = props => {
  const { isVisitor, message } = props
  const userClasses = isVisitor ? styles.userMessage : styles.botMessage
  const userBackgroundStyle = isVisitor ? styles.userBackground : styles.botBackground

  return (
    <div className={`${styles.message} ${userClasses}`}>
      <MessageBubble
        className={`${styles.messageBubble} ${userBackgroundStyle}`}
        message={message}
      />
    </div>
  )
}

Text.propTypes = {
  isVisitor: PropTypes.bool.isRequired,
  message: PropTypes.string
}

Text.defaultProps = {
  message: ''
}

export default Text
