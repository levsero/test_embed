import React from 'react'
import PropTypes from 'prop-types'
import { TEST_IDS } from 'src/constants/shared'
import ThumbsDownIcon from '@zendeskgarden/svg-icons/src/16/thumbs-down-stroke.svg'
import ThumbsUpIcon from '@zendeskgarden/svg-icons/src/16/thumbs-up-stroke.svg'
import useTranslate from 'src/hooks/useTranslate'
import { Container, RatingButton } from './styles'

const ratings = {
  GOOD: 'good',
  BAD: 'bad',
  NOT_SET: null,
}

const RatingGroup = ({ rating = ratings.NOT_SET, updateRating }) => {
  const translate = useTranslate()
  const onRatingClicked = (value) => {
    const newRating = rating === value ? ratings.NOT_SET : value
    updateRating(newRating)
  }

  return (
    <Container data-testid={TEST_IDS.CHAT_RATING_GROUP}>
      <RatingButton
        size="small"
        selected={rating === ratings.GOOD}
        aria-label={translate('embeddable_framework.chat.chatLog.rating.title.good')}
        onClick={() => onRatingClicked(ratings.GOOD)}
        data-testid={TEST_IDS.ICON_THUMB_UP}
        ignoreThemeOverride={true}
      >
        <ThumbsUpIcon />
      </RatingButton>
      <RatingButton
        isThumbsDown={true}
        selected={rating === ratings.BAD}
        size="small"
        aria-label={translate('embeddable_framework.chat.chatLog.rating.title.bad')}
        onClick={() => onRatingClicked(ratings.BAD)}
        data-testid={TEST_IDS.ICON_THUMB_DOWN}
        ignoreThemeOverride={true}
      >
        <ThumbsDownIcon />
      </RatingButton>
    </Container>
  )
}

RatingGroup.propTypes = {
  updateRating: PropTypes.func.isRequired,
  rating: PropTypes.string,
}

export default RatingGroup

export { ratings }
