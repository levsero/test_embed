import { CHAT_MESSAGE_EVENTS } from 'classicSrc/constants/chat'
import sharedPropTypes from 'classicSrc/types/shared'
import _ from 'lodash'
import PropTypes from 'prop-types'

const chatMessage = PropTypes.shape({
  type: PropTypes.oneOf(_.values(CHAT_MESSAGE_EVENTS)).isRequired,
  timestamp: PropTypes.number.isRequired,
  nick: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired, // eslint-disable-line camelcase
  msg: PropTypes.string,
  options: PropTypes.arrayOf(PropTypes.string),
  file: sharedPropTypes.file,
  attachment: PropTypes.shape({
    mime_type: PropTypes.string, // eslint-disable-line camelcase
    name: PropTypes.string,
    size: PropTypes.number,
    url: PropTypes.string,
  }),
})

const chatLogEntry = PropTypes.shape({
  type: PropTypes.oneOf(['message', 'event']).isRequired,
  author: PropTypes.string.isRequired,
  messages: PropTypes.arrayOf(PropTypes.number),
})

export default {
  chatMessage,
  chatLogEntry,
}
