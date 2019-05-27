import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import FeedbackPopup from './feedbackPopup';

import { HelpCenterArticle } from 'component/helpCenter/HelpCenterArticle';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SlideAppear } from 'component/transition/SlideAppear';

import { articleDismissed } from 'src/redux/modules/answerBot/article/actions/';
import * as sessionActions from 'src/redux/modules/answerBot/sessions/actions/';
import {
  botMessage,
  botFeedbackMessage,
  botFeedbackChannelChoice,
  botFeedbackRequested
} from 'src/redux/modules/answerBot/root/actions/bot';

import * as rootActions from 'src/redux/modules/answerBot/root/actions/';
import * as rootSelectors from 'src/redux/modules/answerBot/root/selectors';
import * as channelSelectors from 'src/redux/modules/selectors';

import { CONVERSATION_SCREEN } from 'src/constants/answerBot';

import { i18n } from 'service/i18n';
import { locals as styles } from './ArticleScreen.scss';

class ArticleScreen extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    scrollContainerClasses: PropTypes.string,
    articleTitleKey: PropTypes.string,
    article: PropTypes.object.isRequired,
    isFeedbackRequired: PropTypes.bool.isRequired,
    saveConversationScroll: PropTypes.func,
    channelAvailable: PropTypes.bool,
    actions: PropTypes.shape({
      screenChanged: PropTypes.func.isRequired,
      articleDismissed: PropTypes.func.isRequired,
      sessionResolved: PropTypes.func.isRequired,
      sessionFallback: PropTypes.func.isRequired,
      botMessage: PropTypes.func.isRequired,
      botFeedbackChannelChoice: PropTypes.func.isRequired,
      botFeedbackMessage: PropTypes.func.isRequired,
      botFeedbackRequested: PropTypes.func.isRequired
    })
  };

  static defaultProps = {
    articleTitleKey: 'help',
    isMobile: false,
    scrollContainerClasses: '',
    saveConversationScroll: () => {},
    channelAvailable: true
  };

  constructor(props) {
    super(props);

    this.state = {
      showPopup: false,
      popupDisplayed: false,
      initialOptions: true
    };
    this.showPopupTimer = null;
  }

  componentDidMount = () => {
    this.showPopupTimer = setTimeout(() => {
      if (this.props.isFeedbackRequired && !this.state.showPopup) {
        this.setState({ showPopup: true });
      }
    }, 1000);
  }

  componentWillUnmount() {
    this.showPopupTimer = clearTimeout(this.showPopupTimer);
  }

  onYesFeedback = () => {
    const { actions, saveConversationScroll } = this.props;

    actions.sessionResolved();

    // Clear previous feedback
    actions.botFeedbackRequested();

    actions.botMessage(
      i18n.t('embeddable_framework.answerBot.msg.yes_acknowledgement')
    );
    actions.botMessage(
      i18n.t('embeddable_framework.answerBot.msg.prompt_again_after_yes'),
    );

    this.setState({ showPopup: false, popupDisplayed: false });

    // Scroll to bottom when user switches back to conversation screen
    saveConversationScroll({ scrollToBottom: true });
  }

  onNoFeedback = (reasonID) => {
    const { actions, saveConversationScroll, channelAvailable } = this.props;
    const messageKey = channelAvailable
      ? 'embeddable_framework.answerBot.msg.prompt_again'
      : 'embeddable_framework.answerBot.msg.prompt_again_no_channels_available';

    actions.articleDismissed(reasonID);
    actions.sessionFallback();

    // Clear previous feedback
    actions.botFeedbackRequested();

    actions.botFeedbackMessage(i18n.t('embeddable_framework.answerBot.msg.no_acknowledgement'));
    actions.botFeedbackChannelChoice(i18n.t('embeddable_framework.answerBot.msg.channel_choice.title'), true);
    actions.botFeedbackMessage(
      i18n.t(messageKey),
    );

    // Scroll to bottom when user switches back to conversation screen
    saveConversationScroll({ scrollToBottom: true });
    actions.screenChanged(CONVERSATION_SCREEN);
  }

  handlePopupAppeared = () => {
    this.setState({ popupDisplayed: true });
  }

  handleNoClick = () => {
    this.setState({ initialOptions: false });
  }

  feedbackPopup = () => {
    return (
      <SlideAppear
        className={styles.popupWrapper}
        trigger={this.state.showPopup}
        startPosHeight={'-100px'}
        endPosHeight={'0px'}
        duration={400}
        onEntered={this.handlePopupAppeared}>
        <FeedbackPopup
          onYesClick={this.onYesFeedback}
          onNoClick={this.handleNoClick}
          onReasonClick={this.onNoFeedback}
        />
      </SlideAppear>
    );
  }

  render = () => {
    let popupStyles = '';

    if (this.state.popupDisplayed) {
      popupStyles = this.state.initialOptions ? styles.optionsPopupSpacing : styles.reasonsPopupSpacing;
    }

    return (
      <div className={styles.container}>
        <ScrollContainer
          containerClasses={`${this.props.scrollContainerClasses} ${styles.scrollContainer} ${popupStyles}`}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.articleTitleKey}`)}
          isMobile={this.props.isMobile}
          footerClasses={styles.footer}>
          <HelpCenterArticle
            activeArticle={this.props.article}
            originalArticleButton={false}
            isMobile={this.props.isMobile}
          />
        </ScrollContainer>
        {this.feedbackPopup()}
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  article: rootSelectors.getCurrentArticle(state),
  isFeedbackRequired: rootSelectors.isFeedbackRequired(state),
  channelAvailable: channelSelectors.getChannelAvailable(state)
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({
    screenChanged: rootActions.screenChanged,
    articleDismissed,
    sessionResolved: sessionActions.sessionResolved,
    sessionFallback: sessionActions.sessionFallback,
    botMessage,
    botFeedbackMessage,
    botFeedbackChannelChoice,
    botFeedbackRequested
  }, dispatch)
});

const connectedComponent = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(ArticleScreen);

export {
  connectedComponent as default,
  ArticleScreen as Component
};
