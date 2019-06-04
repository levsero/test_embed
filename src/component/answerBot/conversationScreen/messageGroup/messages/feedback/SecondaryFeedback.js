import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { ButtonGroup } from 'component/button/ButtonGroup';
import { FeedbackButton } from 'component/answerBot/articleScreen/feedbackPopup/FeedbackButton';
import { i18n } from 'service/i18n';

import { articleDismissed } from 'src/redux/modules/answerBot/article/actions/';
import {
  botFeedbackMessage,
  botUserMessage,
  botFeedbackChannelChoice
} from 'src/redux/modules/answerBot/root/actions/bot';
import { getChannelAvailable } from 'src/redux/modules/selectors';
import { sessionFallback } from 'src/redux/modules/answerBot/sessions/actions/';

import { locals as styles } from './style.scss';

export class SecondaryFeedback extends Component {
  static propTypes = {
    channelAvailable: PropTypes.bool,
    actions: PropTypes.shape({
      articleDismissed: PropTypes.func.isRequired,
      botUserMessage: PropTypes.func.isRequired,
      botFeedbackMessage: PropTypes.func.isRequired,
      sessionFallback: PropTypes.func.isRequred,
      botFeedbackChannelChoice: PropTypes.func.isRequred
    })
  };

  handleReason = (reasonID, message) => {
    const messageKey = this.props.channelAvailable
      ? 'embeddable_framework.answerBot.msg.prompt_again'
      : 'embeddable_framework.answerBot.msg.prompt_again_no_channels_available';

    return () => {
      this.props.actions.botUserMessage(message);
      this.props.actions.articleDismissed(reasonID);
      this.props.actions.sessionFallback();
      this.props.actions.botFeedbackMessage(i18n.t('embeddable_framework.answerBot.msg.no_acknowledgement'));
      this.props.actions.botFeedbackChannelChoice(
        i18n.t('embeddable_framework.answerBot.msg.channel_choice.title'),
        true
      );
      this.props.actions.botFeedbackMessage(
        i18n.t(messageKey),
      );
    };
  }

  render() {
    return (
      <div className={styles.container}>
        <ButtonGroup>
          <FeedbackButton
            className={styles.option}
            label={i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.related')}
            onClick={this.handleReason(
              2,
              i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.related')
            )}
          />
          <FeedbackButton
            label={i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')}
            className={styles.option}
            onClick={this.handleReason(
              1,
              i18n.t('embeddable_framework.answerBot.article.feedback.no.reason.unrelated')
            )}
          />
        </ButtonGroup>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  channelAvailable: getChannelAvailable(state)
});

const actionCreators = (dispatch) => ({
  actions: bindActionCreators({
    articleDismissed,
    botUserMessage,
    botFeedbackMessage,
    sessionFallback,
    botFeedbackChannelChoice
  }, dispatch)
});

const connectedComponent = connect(mapStateToProps, actionCreators, null, { withRef: true })(SecondaryFeedback);

export {
  connectedComponent as default,
  SecondaryFeedback as Component
};
