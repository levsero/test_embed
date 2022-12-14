import { ButtonGroup } from 'classicSrc/component/button/ButtonGroup'
import { articleDismissed } from 'classicSrc/embeds/answerBot/actions/article'
import {
  botFeedbackMessage,
  botUserMessage,
  botFallbackMessage,
} from 'classicSrc/embeds/answerBot/actions/root/bot'
import { sessionFallback } from 'classicSrc/embeds/answerBot/actions/sessions'
import useTranslate from 'classicSrc/hooks/useTranslate'
import { useDispatch } from 'react-redux'
import { Container, Option } from './styles'

const SecondaryFeedback = () => {
  const dispatch = useDispatch()
  const translate = useTranslate()

  const handleReason = (reasonID, message) => {
    return () => {
      dispatch(botUserMessage(message))
      dispatch(articleDismissed(reasonID))
      dispatch(sessionFallback())
      dispatch(botFeedbackMessage('embeddable_framework.answerBot.msg.no_acknowledgement'))
      dispatch(botFallbackMessage(true))
    }
  }

  return (
    <Container>
      <ButtonGroup>
        <Option
          label={translate('embeddable_framework.answerBot.article.feedback.no.reason.related')}
          onClick={handleReason(
            2,
            'embeddable_framework.answerBot.article.feedback.no.reason.related'
          )}
        />
        <Option
          label={translate('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')}
          onClick={handleReason(
            1,
            'embeddable_framework.answerBot.article.feedback.no.reason.unrelated'
          )}
        />
      </ButtonGroup>
    </Container>
  )
}

export default SecondaryFeedback
