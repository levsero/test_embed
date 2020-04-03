import React from 'react'
import { useDispatch } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { ButtonGroup } from 'component/button/ButtonGroup'
import PillButton from 'src/embeds/answerBot/components/PillButton'
import { sessionResolved } from 'src/embeds/answerBot/actions/sessions'
import {
  botFeedback,
  botFeedbackMessage,
  botUserMessage
} from 'src/embeds/answerBot/actions/root/bot'

import { Container } from './styles'

const PrimaryFeedback = () => {
  const translate = useTranslate()
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
          label={translate('embeddable_framework.answerBot.article.feedback.yes')}
          onClick={handleYes}
        />
        <PillButton
          label={translate('embeddable_framework.answerBot.article.feedback.no.need_help')}
          onClick={handleNo}
        />
      </ButtonGroup>
    </Container>
  )
}

export default PrimaryFeedback
