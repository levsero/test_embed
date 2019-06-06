import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ButtonGroup } from 'component/button/ButtonGroup';
import { PillButton } from 'src/component/shared/PillButton';
import { i18n } from 'service/i18n';

import { sessionResolved } from 'src/redux/modules/answerBot/sessions/actions';
import {
  botFeedback,
  botFeedbackMessage,
  botUserMessage
} from 'src/redux/modules/answerBot/root/actions/bot';

import { locals as styles } from './style.scss';

export class PrimaryFeedback extends Component {
  static propTypes = {
    actions: PropTypes.shape({
      sessionResolved: PropTypes.func.isRequired,
      botUserMessage: PropTypes.func.isRequired,
      botFeedbackMessage: PropTypes.func.isRequired,
      botFeedback: PropTypes.func.isRequired
    })
  };

  renderOptions = () => {
    return (
      <ButtonGroup>
        <PillButton
          label={i18n.t('embeddable_framework.answerBot.article.feedback.yes')}
          onClick={this.handleYes}
        />
        <PillButton
          label={i18n.t('embeddable_framework.answerBot.article.feedback.no.need_help')}
          onClick={this.handleNo}
        />
      </ButtonGroup>
    );
  }

  handleYes = () => {
    this.props.actions.sessionResolved();
    this.props.actions.botUserMessage(i18n.t('embeddable_framework.answerBot.article.feedback.yes'));
    this.props.actions.botFeedbackMessage(
      i18n.t('embeddable_framework.answerBot.msg.yes_acknowledgement')
    );
    this.props.actions.botFeedbackMessage(
      i18n.t('embeddable_framework.answerBot.msg.prompt_again_after_yes'),
    );
  }

  handleNo = () => {
    this.props.actions.botUserMessage(i18n.t('embeddable_framework.answerBot.article.feedback.no.need_help'));
    this.props.actions.botFeedbackMessage(
      i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.title')
    );
    this.props.actions.botFeedback('secondary');
  }

  render() {
    return (
      <div className={styles.container}>
        {this.renderOptions()}
      </div>
    );
  }
}

const actionCreators = (dispatch) => ({
  actions: bindActionCreators({
    sessionResolved,
    botUserMessage,
    botFeedbackMessage,
    botFeedback
  }, dispatch)
});

const connectedComponent = connect(null, actionCreators, null, { withRef: true })(PrimaryFeedback);

export {
  connectedComponent as default,
  PrimaryFeedback as Component
};
