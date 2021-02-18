import PropTypes from 'prop-types'

import { ratings } from 'embeds/chat/components/RatingGroup'

const chatRating = PropTypes.shape({
  value: PropTypes.oneOf(Object.values(ratings)),
  disableEndScreen: PropTypes.bool,
  comment: PropTypes.string,
})

const ChatPropTypes = {
  chatRating,
}

export default ChatPropTypes
