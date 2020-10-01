import React from 'react'
import PropTypes from 'prop-types'
import { Container, Plus } from './styles'

const max = 99

const UnreadIndicator = ({ unreadCount = 0 }) => {
  const countToDisplay = Math.min(unreadCount, max)

  return (
    <Container>
      {countToDisplay}

      {unreadCount > max && <Plus>+</Plus>}
    </Container>
  )
}

UnreadIndicator.propTypes = {
  unreadCount: PropTypes.number
}

export default UnreadIndicator
