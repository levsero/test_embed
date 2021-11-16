import PropTypes from 'prop-types'
import { Timestamp } from '@zendesk/conversation-components'

const TimestampStructuredMessage = ({ message: { received } }) => {
  const receivedInMs = received * 1000
  return <Timestamp timestamp={receivedInMs} />
}

TimestampStructuredMessage.propTypes = {
  message: PropTypes.shape({
    received: PropTypes.number,
  }),
}

export default TimestampStructuredMessage
