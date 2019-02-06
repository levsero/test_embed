import { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import _ from 'lodash';

import * as sessionActions from 'src/redux/modules/answerBot/sessions/actions';
import * as sessionSelectors from 'src/redux/modules/answerBot/sessions/selectors';
import * as rootActions from 'src/redux/modules/answerBot/root/actions';
import * as rootSelectors from 'src/redux/modules/answerBot/root/selectors';
import * as botActions from 'src/redux/modules/answerBot/root/actions/bot';
import * as channelSelectors from 'src/redux/modules/selectors';
import { getBrand } from 'src/redux/modules/base/base-selectors';

import { ARTICLE_SCREEN, CONVERSATION_SCREEN } from 'src/constants/answerBot';
import { i18n } from 'service/i18n';

const INITIAL_FALLBACK_DELAY = 5000;
const FALLBACK_DELAY = 5000;

class AnswerBotContainer extends Component {
  static propTypes = {
    brand: PropTypes.string,
    children: PropTypes.node.isRequired,
    currentScreen: PropTypes.string.isRequired,
    currentSessionID: PropTypes.number,
    currentSessionResolved: PropTypes.bool.isRequired, // eslint-disable-line
    currentRequestStatus: PropTypes.string, // eslint-disable-line
    sessionFallbackSuggested: PropTypes.bool.isRequired, // eslint-disable-line
    sessionArticlesLength: PropTypes.number.isRequired, // eslint-disable-line
    currentMessage: PropTypes.string.isRequired,
    isInitialSession: PropTypes.bool.isRequired, // eslint-disable-line
    greeted: PropTypes.bool.isRequired, // eslint-disable-line
    initialFallbackSuggested: PropTypes.bool.isRequired, // eslint-disable-line
    restoreConversationScroll: PropTypes.func,
    saveConversationScroll: PropTypes.func,
    channelAvailable: PropTypes.bool,
    isFeedbackRequired: PropTypes.bool.isRequired, // eslint-disable-line
    sessions: PropTypes.any.isRequired, // eslint-disable-line
    actions: PropTypes.shape({
      sessionStarted: PropTypes.func.isRequired,
      sessionFallback: PropTypes.func.isRequired,
      botMessage: PropTypes.func.isRequired,
      botChannelChoice: PropTypes.func.isRequired,
      botGreeted: PropTypes.func.isRequired,
      botInitialFallback: PropTypes.func.isRequired,
      inputDisabled: PropTypes.func.isRequired,
      botFeedback: PropTypes.func.isRequired,
      botFeedbackRequested: PropTypes.func.isRequired,
      botFeedbackMessage: PropTypes.func.isRequired
    })
  };

  static defaultProps = {
    currentSessionID: null,
    currentRequestStatus: null,
    restoreConversationScroll: () => {},
    saveConversationScroll: () => {},
    channelAvailable: true
  };

  constructor(props) {
    super(props);

    this.lastMessage = props.currentMessage;
    this.runningFlow = null;
    this.initialFallbackTimer = null;
    this.fallbackTimer = null;
  }

  componentDidMount() {
    // Kickstart the initial session
    if (!this.props.currentSessionID) {
      this.props.actions.sessionStarted();
    }

    this.refreshFlow(this.props);
  }

  componentWillReceiveProps(nextProps) {
    if (!_.isEqual(this.props, nextProps)) {
      this.refreshFlow(nextProps);
    }
  }

  componentWillUnmount() {
    this.stopTimers();
  }

  refreshFlow(props) {
    let args = {
      props,
      shouldStopTimer: {}
    };

    this.runningFlow = true;

    this
      .runNext(() => this.checkCurrentScreen(args))
      .runNext(() => this.checkSessionSolved(args))
      .runNext(() => this.checkRequestFeedback(args))
      .runNext(() => this.checkRequestStatus(args));

    this.runningFlow = false;
    this.lastMessage = args.props.currentMessage;
    this.stopTimers(args.shouldStopTimer);
  }

  runNext = fn => {
    if (this.runningFlow && _.isFunction(fn)) {
      this.runningFlow = fn();
    }

    return this;
  }

  checkCurrentScreen = ({ props }) => {
    if (props.currentScreen === ARTICLE_SCREEN) {
      // Switching from Conversation to Article screen
      // Note: we do this here instead of in ConversationScreen's componentWillUnmount
      // because the ref to scrollContainer would have been removed by then
      if (this.props.currentScreen === CONVERSATION_SCREEN) {
        this.props.saveConversationScroll();
      }

      return false;
    }

    // Switching from Article to Conversation screen
    // Note: we do this here instead of in ConversationScreen's componentDidMount
    // because the ref to scrollContainer would not have been created by then
    if (this.props.currentScreen === ARTICLE_SCREEN) {
      this.props.restoreConversationScroll();
    }

    return true;
  }

  checkSessionSolved = ({ props }) => {
    if (!props.currentSessionID) {
      return false;
    }

    if (props.currentSessionResolved) {
      return false;
    }

    return true;
  }

  checkRequestFeedback = ({ props }) => {
    if (this.props.currentScreen === ARTICLE_SCREEN
      && props.currentScreen === CONVERSATION_SCREEN
      && props.isFeedbackRequired
    ) {
      this.props.actions.inputDisabled(true);
      this.props.actions.botFeedbackRequested();
      this.props.actions.botFeedbackMessage(
        i18n.t('embeddable_framework.answerBot.msg.feedback.question')
      );
      this.props.actions.botFeedback();
      return false;
    }

    return true;
  }

  checkRequestStatus = (args) => {
    const { props } = args;

    switch (props.currentRequestStatus) {
      case 'PENDING':
        return false;

      case 'COMPLETED':
      case 'REJECTED':
        return this.onRequestFinished(args);

      default:
        return this.onRequestNotStarted(args);
    }
  }

  onRequestFinished = (args) => {
    this
      .runNext(() => this.checkSessionFallbackSuggested(args))
      .runNext(() => this.suggestSessionFallback(args));

    return this.runningFlow;
  }

  checkSessionFallbackSuggested = ({ props }) => {
    if (props.sessionFallbackSuggested) {
      return false;
    }

    return true;
  }

  suggestSessionFallback = ({ props, shouldStopTimer }) => {
    if (props.currentRequestStatus === 'REJECTED' || props.sessionArticlesLength === 0) {
      this.runSessionFallback(i18n.t('embeddable_framework.answerBot.msg.no_articles_fallback'), true);
      return false;
    }

    shouldStopTimer.fallback = false;

    if (!this.fallbackTimer) {
      this.startSessionFallbackTimer();
    }

    return false;
  }

  onRequestNotStarted = (args) => {
    this
      .runNext(() => this.checkInitialSession(args))
      .runNext(() => this.checkGreetings(args))
      .runNext(() => this.checkInitialFallbackSuggested(args))
      .runNext(() => this.checkQuestionValueChanged(args));

    return this.runningFlow;
  }

  checkInitialSession = ({ props }) => {
    if (!props.isInitialSession) {
      return false;
    }

    return true;
  }

  checkGreetings = ({ props }) => {
    if (!props.greeted) {
      props.actions.botGreeted();
      props.actions.botMessage(this.greetingMessage());
      props.actions.botMessage(
        i18n.t('embeddable_framework.answerBot.msg.prompt'),
        () => props.actions.inputDisabled(false)
      );

      return false;
    }

    return true;
  }

  checkInitialFallbackSuggested = ({ props }) => {
    if (props.initialFallbackSuggested) {
      return false;
    }

    return true;
  }

  checkQuestionValueChanged = ({ props, shouldStopTimer }) => {
    if (this.lastMessage !== props.currentMessage) {
      this.initialFallbackTimer = window.clearTimeout(this.initialFallbackTimer);
    }

    if (!this.initialFallbackTimer) {
      this.startInitialFallbackTimer();
    }

    shouldStopTimer.initialFallback = false;
    return false;
  }

  greetingMessage = () => {
    const { brand } = this.props;

    if (brand) {
      return i18n.t('embeddable_framework.answerBot.msg.greetings_with_brand', { brand });
    } else {
      return i18n.t('embeddable_framework.answerBot.msg.greetings');
    }
  }

  startInitialFallbackTimer = () => {
    this.initialFallbackTimer = window.setTimeout(() => {
      this.props.actions.botChannelChoice(i18n.t('embeddable_framework.answerBot.msg.initial_fallback'));
      this.props.actions.botInitialFallback();
    }, INITIAL_FALLBACK_DELAY);
  }

  startSessionFallbackTimer = () => {
    this.fallbackTimer = window.setTimeout(() => {
      this.runSessionFallback(i18n.t('embeddable_framework.answerBot.msg.no_interaction_fallback'));
    }, FALLBACK_DELAY);
  }

  runSessionFallback = (message, fallback = false) => {
    const messageKey = this.props.channelAvailable
      ? 'embeddable_framework.answerBot.msg.prompt_again'
      : 'embeddable_framework.answerBot.msg.prompt_again_no_channels_available';

    this.props.actions.sessionFallback();
    this.props.actions.botChannelChoice(message, fallback);
    this.props.actions.botMessage(
      i18n.t(messageKey),
      () => this.props.actions.inputDisabled(false)
    );
  }

  stopTimers = (shouldStopTimer) => {
    shouldStopTimer = {
      initialFallback: true,
      fallback: true,
      ...shouldStopTimer
    };

    if (shouldStopTimer.initialFallback && this.initialFallbackTimer) {
      this.initialFallbackTimer = window.clearTimeout(this.initialFallbackTimer);
    }

    if (shouldStopTimer.fallback && this.fallbackTimer) {
      this.fallbackTimer = window.clearTimeout(this.fallbackTimer);
    }
  }

  render() {
    return this.props.children;
  }
}

const mapStateToProps = (state) => ({
  currentScreen: rootSelectors.getCurrentScreen(state),
  currentSessionID: rootSelectors.getCurrentSessionID(state),
  currentSessionResolved: rootSelectors.isCurrentSessionResolved(state),
  currentRequestStatus: rootSelectors.getCurrentRequestStatus(state),
  sessionFallbackSuggested: sessionSelectors.getSessionFallbackSuggested(state),
  sessionArticlesLength: sessionSelectors.getSessionArticlesLength(state),
  currentMessage: rootSelectors.getCurrentMessage(state),
  isInitialSession: sessionSelectors.isInitialSession(state),
  greeted: rootSelectors.getGreeted(state),
  initialFallbackSuggested: rootSelectors.getInitialFallbackSuggested(state),
  channelAvailable: channelSelectors.getChannelAvailable(state),
  isFeedbackRequired: rootSelectors.isFeedbackRequired(state),
  sessions: sessionSelectors.getSessions(state),
  brand: getBrand(state)
});

const actionCreators = (dispatch) => ({
  actions: bindActionCreators({
    sessionStarted: sessionActions.sessionStarted,
    sessionFallback: sessionActions.sessionFallback,
    botMessage: botActions.botMessage,
    botChannelChoice: botActions.botChannelChoice,
    botGreeted: botActions.botGreeted,
    botFeedback: botActions.botFeedback,
    botFeedbackRequested: botActions.botFeedbackRequested,
    botFeedbackMessage: botActions.botFeedbackMessage,
    botInitialFallback: botActions.botInitialFallback,
    inputDisabled: rootActions.inputDisabled
  }, dispatch)
});

const connectedComponent = connect(
  mapStateToProps, actionCreators, null, { withRef: true }
)(AnswerBotContainer);

export {
  connectedComponent as default,
  AnswerBotContainer as Component
};