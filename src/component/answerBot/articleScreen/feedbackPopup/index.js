import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { i18n } from 'service/i18n'

import { PillButton } from 'src/component/shared/PillButton'
import { ButtonGroup } from 'component/button/ButtonGroup'

import { locals as styles } from './FeedbackPopup.scss'

class FeedbackPopup extends Component {
  static propTypes = {
    onYesClick: PropTypes.func.isRequired,
    onNoClick: PropTypes.func.isRequired,
    onReasonClick: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)
    this.state = { showRejectReasons: false }
  }

  handleNoClicked = () => {
    this.setState({ showRejectReasons: true })
    this.props.onNoClick()
  }

  initialOptions = () => {
    return (
      <ButtonGroup containerClasses={styles.optionButtons}>
        <PillButton
          label={i18n.t('embeddable_framework.answerBot.article.feedback.yes')}
          onClick={this.props.onYesClick}
        />
        <PillButton
          className={styles.noBtn}
          label={i18n.t('embeddable_framework.answerBot.article.feedback.no.need_help')}
          onClick={this.handleNoClicked}
        />
      </ButtonGroup>
    )
  }

  reasonOptions = () => {
    return (
      <div className={styles.reasonButtons}>
        <PillButton
          className={styles.relatedBtn}
          label={i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.related')}
          onClick={() => this.props.onReasonClick(2)}
        />
        <PillButton
          className={styles.unrelatedBtn}
          label={i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')}
          onClick={() => this.props.onReasonClick(1)}
        />
      </div>
    )
  }

  render = () => {
    const initialOptions = !this.state.showRejectReasons
    const titleKey = initialOptions ? 'title' : 'no.reason.title'

    return (
      <div className={styles.container}>
        <h3 className={styles.title}>
          {i18n.t(`embeddable_framework.answerBot.article.feedback.${titleKey}`)}
        </h3>
        {initialOptions ? this.initialOptions() : this.reasonOptions()}
      </div>
    )
  }
}

export default FeedbackPopup
