import React from 'react'
import PropTypes from 'prop-types'

import { useTranslate } from 'src/hooks/useTranslation'

import { PillButton } from 'src/component/shared/PillButton'
import { ButtonGroup } from 'src/component/button/ButtonGroup'

const InitialOptions = ({ onYesClick, onNoClick }) => {
  const translate = useTranslate()

  return (
    <ButtonGroup center={true}>
      <PillButton
        label={translate('embeddable_framework.answerBot.article.feedback.yes')}
        onClick={onYesClick}
      />
      <PillButton
        label={translate('embeddable_framework.answerBot.article.feedback.no.need_help')}
        onClick={onNoClick}
      />
    </ButtonGroup>
  )
}

InitialOptions.propTypes = {
  onNoClick: PropTypes.func,
  onYesClick: PropTypes.func
}

export default InitialOptions
