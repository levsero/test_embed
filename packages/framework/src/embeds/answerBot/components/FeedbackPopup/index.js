import React, { useState } from 'react'
import PropTypes from 'prop-types'

import useTranslate from 'src/hooks/useTranslate'
import InitialOptions from './InitialOptions'
import ReasonOptions from './ReasonOptions'
import { Container, Title } from './styles'

const FeedbackPopup = ({ onYesClick, onNoClick, onReasonClick }) => {
  const translate = useTranslate()
  const [showRejectReasons, setShowRejectReasons] = useState(false)

  const initial = !showRejectReasons
  const titleKey = initial ? 'title' : 'no.reason.title'

  return (
    <Container>
      <Title>{translate(`embeddable_framework.answerBot.article.feedback.${titleKey}`)}</Title>
      {initial ? (
        <InitialOptions
          onYesClick={onYesClick}
          onNoClick={() => {
            setShowRejectReasons(true)
            onNoClick()
          }}
        />
      ) : (
        <ReasonOptions onReasonClick={onReasonClick} />
      )}
    </Container>
  )
}

FeedbackPopup.propTypes = {
  onYesClick: PropTypes.func.isRequired,
  onNoClick: PropTypes.func.isRequired,
  onReasonClick: PropTypes.func.isRequired,
}

export default FeedbackPopup
