import React from 'react'
import PropTypes from 'prop-types'
import Carousel from 'src/apps/messenger/features/sunco-components/Carousel'

const CarouselStructuredMessage = ({ message }) => {
  return (
    <Carousel
      items={message.items}
      label={message.isFirstMessageInAuthorGroup ? message.name : undefined}
      avatar={message.isLastMessageInAuthorGroup ? message.avatarUrl : undefined}
    />
  )
}

CarouselStructuredMessage.propTypes = {
  message: PropTypes.shape({
    items: Carousel.propTypes.items,
    label: Carousel.propTypes.label,
    avatarUrl: Carousel.propTypes.avatar
  })
}

export default CarouselStructuredMessage
