import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'

import { ButtonGroup } from 'component/button/ButtonGroup'
import { PillButton } from 'src/component/shared/PillButton'
import { i18n } from 'service/i18n'

import { articleDismissed } from 'src/redux/modules/answerBot/article/actions/'
import {
  botFeedbackMessage,
  botUserMessage,
  botFallbackMessage
} from 'src/redux/modules/answerBot/root/actions/bot'
import { sessionFallback } from 'src/redux/modules/answerBot/sessions/actions/'
import { getInTouchShown } from 'src/redux/modules/answerBot/conversation/actions'

import { locals as styles } from './style.scss'

export class SecondaryFeedback extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      articleDismissed: PropTypes.func.isRequired,
      botUserMessage: PropTypes.func.isRequired,
      botFeedbackMessage: PropTypes.func.isRequired,
      botFallbackMessage: PropTypes.func.isRequired,
      sessionFallback: PropTypes.func.isRequred,
      getInTouchShown: PropTypes.func.isRequred
    })
  }

  handleReason = (reasonID, message) => {
    const { actions } = this.props

    return () => {
      actions.botUserMessage(message)
      actions.articleDismissed(reasonID)
      actions.sessionFallback()
      actions.botFeedbackMessage(i18n.t('embeddable_framework.answerBot.msg.no_acknowledgement'))
      actions.botFallbackMessage(true)
    }
  }

  render() {
    return (
      <div className={styles.container}>
        <ButtonGroup>
          <PillButton
            className={styles.option}
            label={i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.related')}
            onClick={this.handleReason(
              2,
              i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.related')
            )}
          />
          <PillButton
            label={i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')}
            className={styles.option}
            onClick={this.handleReason(
              1,
              i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')
            )}
          />
        </ButtonGroup>
      </div>
    )
  }
}

const actionCreators = dispatch => ({
  actions: bindActionCreators(
    {
      articleDismissed,
      botUserMessage,
      botFeedbackMessage,
      botFallbackMessage,
      sessionFallback,
      getInTouchShown
    },
    dispatch
  )
})

const connectedComponent = connect(
  null,
  actionCreators,
  null,
  { forwardRef: true }
)(SecondaryFeedback)

export { connectedComponent as default, SecondaryFeedback as Component }
