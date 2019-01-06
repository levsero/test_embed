import PropTypes from 'prop-types';
import sharedPropTypes from 'types/shared';
import { CHAT_MESSAGE_EVENTS } from 'constants/chat';
import _ from 'lodash';

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
    url: PropTypes.string
  })
});

export default {
  chatMessage
};
