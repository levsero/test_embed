import React from 'react'
import { useDispatch } from 'react-redux'

import { ButtonGroup } from 'component/button/ButtonGroup'
import { PillButton } from 'src/embeds/answerBot/components/PillButton'
import { i18n } from 'service/i18n'

import { sessionResolved } from 'src/redux/modules/answerBot/sessions/actions'
import {
  botFeedback,
  botFeedbackMessage,
  botUserMessage
} from 'src/redux/modules/answerBot/root/actions/bot'

import { Container } from './styles'

const PrimaryFeedback = () => {
  const dispatch = useDispatch()
  const handleYes = () => {
    dispatch(sessionResolved())
    dispatch(botUserMessage('embeddable_framework.answerBot.article.feedback.yes'))
    dispatch(botFeedbackMessage('embeddable_framework.answerBot.msg.yes_acknowledgement'))
    dispatch(botFeedbackMessage('embeddable_framework.answerBot.msg.prompt_again_after_yes'))
  }

  const handleNo = () => {
    dispatch(botUserMessage('embeddable_framework.answerBot.article.feedback.no.need_help'))
    dispatch(botFeedbackMessage('embeddable_framework.answerBot.article.feedback.no.reason.title'))
    dispatch(botFeedback('secondary'))
  }

  return (
    <Container>
      <ButtonGroup>
        <PillButton
          label={i18n.t('embeddable_framework.answerBot.article.feedback.yes')}
          onClick={handleYes}
        />
        <PillButton
          label={i18n.t('embeddable_framework.answerBot.article.feedback.no.need_help')}
          onClick={handleNo}
        />
      </ButtonGroup>
    </Container>
  )
}

export default PrimaryFeedback
