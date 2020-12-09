import React from 'react'
import PropTypes from 'prop-types'
import useTranslate from 'src/hooks/useTranslate'
import { ReasonButtons, RelatedButton, UnrelatedButton } from './styles'

const ReasonOptions = ({ onReasonClick }) => {
  const translate = useTranslate()
  return (
    <ReasonButtons>
      <RelatedButton
        label={translate('embeddable_framework.answerBot.article.feedback.no.reason.related')}
        onClick={() => onReasonClick(2)}
      />
      <UnrelatedButton
        label={translate('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')}
        onClick={() => onReasonClick(1)}
      />
    </ReasonButtons>
  )
}

ReasonOptions.propTypes = {
  onReasonClick: PropTypes.func
}

export default ReasonOptions
