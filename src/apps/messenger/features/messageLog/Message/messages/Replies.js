import React from 'react'
import PropTypes from 'prop-types'

const Replies = ({ message: { replies } }) => {
  return replies.map(({ text, payload, iconUrl, _id }) => {
    return (
      <div style={{ backgroundColor: '#00a656' }} key={_id}>
        reply: text-{text} payload-{payload} iconUrl-{iconUrl}
      </div>
    )
  })
}

Replies.propTypes = {
  message: PropTypes.shape({
    text: PropTypes.string,
    replies: PropTypes.arrayOf(
      PropTypes.shape({
        iconUrl: PropTypes.string,
        payload: PropTypes.string,
        text: PropTypes.string,
        uri: PropTypes.string,
        _id: PropTypes.string
      })
    )
  })
}

export default Replies
