import React from 'react'
import PropTypes from 'prop-types'
import { Button, Container } from './styles'

const Replies = ({ replies, submitReply }) => {
  return (
    <Container>
      {replies.map(({ text, _id }) => (
        <Button key={_id} onClick={() => submitReply(text)} isPill={true}>
          {text}
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
  submitReply: PropTypes.func
}

export default Replies
