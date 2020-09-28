import React from 'react'
import PropTypes from 'prop-types'
import { Button, Container } from './styles'

const Replies = ({ replies, onReply }) => {
  return (
    <Container>
      {replies.map(reply => (
        <Button key={reply._id} onClick={() => onReply(reply)} isPill={true}>
          {reply.text}
        </Button>
      ))}
    </Container>
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
  onReply: PropTypes.func
}

export default Replies
