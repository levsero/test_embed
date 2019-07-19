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
import { getLocale } from 'src/redux/modules/base/base-selectors'

import { locals as styles } from './style.scss'

export class SecondaryFeedback extends Component {
  static propTypes = {
    locale: PropTypes.string.isRequired, // eslint-disable-line react/no-unused-prop-types
    actions: PropTypes.shape({
      articleDismissed: PropTypes.func.isRequired,
      botUserMessage: PropTypes.func.isRequired,
      botFeedbackMessage: PropTypes.func.isRequired,
      botFallbackMessage: PropTypes.func.isRequired,
      sessionFallback: PropTypes.func.isRequired
    })
  }

  handleReason = (reasonID, message) => {
    const { actions } = this.props

    return () => {
      actions.botUserMessage(message)
      actions.articleDismissed(reasonID)
      actions.sessionFallback()
      actions.botFeedbackMessage('embeddable_framework.answerBot.msg.no_acknowledgement')
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
              'embeddable_framework.answerBot.article.feedback.no.reason.related'
            )}
          />
          <PillButton
            label={i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')}
            className={styles.option}
            onClick={this.handleReason(
              1,
              'embeddable_framework.answerBot.article.feedback.no.reason.unrelated'
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
      sessionFallback
    },
    dispatch
  )
})

const mapStateToProps = state => {
  return { locale: getLocale(state) }
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(SecondaryFeedback)

export { connectedComponent as default, SecondaryFeedback as Component }
