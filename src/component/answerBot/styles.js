import AnswerBotStyles from './AnswerBot.scss'

import { articlePageStyles } from 'src/embeds/answerBot/pages/ArticlePage/styles'
import { conversationScreenStyles } from './conversationScreen/styles'

const answerBotStyles = `
  ${AnswerBotStyles}
  ${articlePageStyles}
  ${conversationScreenStyles}
`

export default answerBotStyles
