import { ratings } from 'classicSrc/embeds/chat/components/RatingGroup'
import PropTypes from 'prop-types'

const chatRating = PropTypes.shape({
  value: PropTypes.oneOf(Object.values(ratings)),
  disableEndScreen: PropTypes.bool,
  comment: PropTypes.string,
})

const ChatPropTypes = {
  chatRating,
}

export default ChatPropTypes
