import React from 'react'
import PropTypes from 'prop-types'
import {
  SlideMessage,
  Slide,
  Slides,
  Title,
  Description,
  Actions,
  Content,
  Action,
  BufferSlide,
  AvatarSlide,
  NextButton,
  PreviousButton,
  Heading
} from './styles'
import ArrowIcon from '@zendeskgarden/svg-icons/src/16/arrow-left-stroke.svg'
import Avatar from 'src/apps/messenger/features/sunco-components/Avatar'
import useCarousel from './use-carousel'
import Label from 'src/apps/messenger/features/sunco-components/Label'

const Carousel = ({ items, label, avatar }) => {
  const {
    containerRef,
    isFirstSlideVisible,
    isLastSlideVisible,
    goToNextPage,
    goToPreviousPage,
    onFocus
  } = useCarousel({ items })

  return (
    <SlideMessage data-slide-message={true}>
      {label && (
        <Heading>
          <Label>{label}</Label>
        </Heading>
      )}

      <Slides ref={containerRef} data-slides={true}>
        <AvatarSlide data-avatar-slide={true}>
          <Avatar src={avatar} />
        </AvatarSlide>

        {items.map((item, index) => (
          <Slide
            onFocus={onFocus}
            isFirstSlide={index === 0}
            isLastSlide={index === items.length - 1}
            key={item._id}
          >
            <Content>
              <Title>{item.title}</Title>
              <Description>{item.description}</Description>
            </Content>

            {item?.actions?.length > 0 && (
              <Actions>
                {item.actions.map((action, index) => (
                  <Action
                    key={action._id}
                    href={action.uri}
                    target="_blank"
                    isLastAction={index === item?.actions?.length - 1}
                  >
                    {action.text}
                  </Action>
                ))}
              </Actions>
            )}
          </Slide>
        ))}

        <BufferSlide />
      </Slides>

      {!isLastSlideVisible && (
        <NextButton onClick={goToNextPage}>
          <ArrowIcon />
        </NextButton>
      )}

      {!isFirstSlideVisible && (
        <PreviousButton onClick={goToPreviousPage}>
          <ArrowIcon />
        </PreviousButton>
      )}
    </SlideMessage>
  )
}

Carousel.propTypes = {
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      title: PropTypes.string,
      description: PropTypes.string,
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          _id: PropTypes.string,
          uri: PropTypes.string,
          text: PropTypes.string
        })
      )
    })
  ),
  label: PropTypes.string,
  avatar: PropTypes.string
}

export default Carousel
