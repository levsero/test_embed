import PropTypes from 'prop-types';
import { CHAT_MESSAGE_EVENTS } from 'constants/chat';

const chatMessage = PropTypes.shape({
  type: PropTypes.oneOf(CHAT_MESSAGE_EVENTS).isRequired,
  nick: PropTypes.string.isRequired,
  display_name: PropTypes.string.isRequired, // eslint-disable-line camelcase
  msg: PropTypes.string,
  attachment: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      mime_type: PropTypes.string, // eslint-disable-line camelcase
      name: PropTypes.string,
      size: PropTypes.number,
      url: PropTypes.string
    })
  ]),
  uploading: PropTypes.bool,
  timestamp: PropTypes.number.isRequired
});

export default {
  chatMessage
};
