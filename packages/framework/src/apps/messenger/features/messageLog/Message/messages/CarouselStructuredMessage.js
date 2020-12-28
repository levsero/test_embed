import React from 'react'
import PropTypes from 'prop-types'
import { CarouselMessage } from '@zendesk/conversation-components'

const CarouselStructuredMessage = ({ message }) => {
  return (
    <CarouselMessage
      items={message.items}
      label={message.isFirstMessageInAuthorGroup ? message.name : undefined}
      avatar={message.isLastMessageInAuthorGroup ? message.avatarUrl : undefined}
    />
  )
}

CarouselStructuredMessage.propTypes = {
  message: PropTypes.shape({
    items: CarouselMessage.propTypes.items,
    label: CarouselMessage.propTypes.label,
    avatarUrl: CarouselMessage.propTypes.avatar
  })
}

export default CarouselStructuredMessage
