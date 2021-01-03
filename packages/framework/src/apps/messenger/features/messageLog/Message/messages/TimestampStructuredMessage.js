import React from 'react'
import PropTypes from 'prop-types'
import { Timestamp } from '@zendesk/conversation-components'

const TimestampStructuredMessage = ({ message: { received } }) => {
  return <Timestamp millisecondsSinceEpoch={received} />
}

TimestampStructuredMessage.propTypes = {
  message: PropTypes.shape({
    received: PropTypes.number
  })
}

export default TimestampStructuredMessage
