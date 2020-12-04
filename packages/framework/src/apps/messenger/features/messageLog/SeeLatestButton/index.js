import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'

import { getUnreadCount } from 'src/apps/messenger/store/unreadIndicator'

import { ArrowDown, Button, Text, Container } from './styles'

const SeeLatestButton = ({ onClick }) => {
  const unreadCount = useSelector(getUnreadCount)

  if (unreadCount === 0) {
    return null
  }

  return (
    <Container>
      <Button isPill={true} onClick={onClick}>
        <ArrowDown />
        <Text>See latest</Text>
      </Button>
    </Container>
  )
}

SeeLatestButton.propTypes = {
  onClick: PropTypes.func
}

export default SeeLatestButton
