import { useDispatch } from 'react-redux'
import { ButtonGroup } from 'src/component/button/ButtonGroup'
import {
  botFeedback,
  botFeedbackMessage,
  botUserMessage,
} from 'src/embeds/answerBot/actions/root/bot'
import { sessionResolved } from 'src/embeds/answerBot/actions/sessions'
import PillButton from 'src/embeds/answerBot/components/PillButton'
import useTranslate from 'src/hooks/useTranslate'
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
