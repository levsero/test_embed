import React from 'react'
import PropTypes from 'prop-types'
import { getClient } from 'src/apps/messenger/suncoClient'

const Replies = ({ replies }) => {
  return (
    <div>
      {replies.map(({ payload, text }) => (
        <button
          onClick={() => {
            const client = getClient()
            client.sendMessage(payload)
          }}
        >
          {text}
        </button>
      ))}
    </div>
  )
}

Replies.propTypes = {
  replies: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string,
      text: PropTypes.string
    })
  )
}

export default Replies
