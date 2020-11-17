import React from 'react'
import PropTypes from 'prop-types'
import { Button, Container } from './styles'
import AnimatedReplies from 'src/apps/messenger/features/sunco-components/Replies/AnimatedReplies'

const Replies = ({ replies, onReply, isVisible, isFreshMessage }) => {
  return (
    <AnimatedReplies isVisible={isVisible} isFreshMessage={isFreshMessage}>
      <Container isVisible={isVisible}>
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
  onReply: PropTypes.func,
  isVisible: PropTypes.bool,
  isFreshMessage: PropTypes.bool
}

export default Replies
