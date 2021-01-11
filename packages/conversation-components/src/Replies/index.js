import PropTypes from 'prop-types'
import AnimatedReplies from './AnimatedReplies'
import { Button, Container } from './styles'

const Replies = ({ replies, isVisible = true, isFreshMessage = true, onReply = () => {} }) => {
  return (
    <AnimatedReplies isVisible={isVisible} isFreshMessage={isFreshMessage}>
      <Container>
        {replies.map(reply => (
          <Button key={reply._id} onClick={() => onReply(reply)} isPill={true}>
            {reply.text}
          </Button>
        ))}
      </Container>
    </AnimatedReplies>
  )
}

Replies.propTypes = {
  /**
  Array of reply actions to render
  */
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      payload: PropTypes.string,
      _id: PropTypes.string
    })
  ),
  /**
    Function to call when a reply is clicked
  */
  isVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool,
  onReply: PropTypes.func
}

export default Replies
