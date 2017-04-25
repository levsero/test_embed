import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'component/button/Button';
import { automaticAnswersPersistence  } from 'service/automaticAnswersPersistence';
import { i18n } from 'service/i18n';
import { getHelpCenterArticleId } from 'utility/pages';

export const AutomaticAnswersScreen = {
  solveTicketQuestion: 'SOLVE_TICKET_QUESTION',
  ticketClosed: 'TICKET_CLOSED',
  thanksForFeedback: 'THANKS_FOR_FEEDBACK',
  markAsIrrelevant: 'MARK_AS_IRRELEVANT'
};

export class AutomaticAnswers extends Component {
  static propTypes = {
    solveTicket: PropTypes.func.isRequired,
    markArticleIrrelevant: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    mobile: PropTypes.bool.isRequired,
    closeFrame: PropTypes.func.isRequired,
    initialScreen: PropTypes.string
  };

  static defaultProps = {
    updateFrameSize: () => {},
    initialScreen: AutomaticAnswersScreen.solveTicketQuestion
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      ticket: {
        title: '',
        niceId: null,
        statusId: null
      },
      screen: props.initialScreen,
      errorMessage: '',
      isSubmitting: false,
      optionReasonClicked: null
    };
  }

  componentDidMount = () => {
    this.props.updateFrameSize();
  }

  componentDidUpdate = () => {
    this.props.updateFrameSize();
  }

  // irrelevent article reasons
  static notRelated = 1;
  static relatedButNotAnswered = 2;

  static irrelevantReasons = {
    [AutomaticAnswers.notRelated] :
      i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.not_related', {
        fallback: "It's not related to my question"
      }),
    [AutomaticAnswers.relatedButNotAnswered] :
      i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.related_no_answer', {
        fallback: "It's related but didn't answer my question"
      })
  }

  updateTicket = (ticket) => {
    this.setState({
      ticket: {
        title: ticket.title,
        niceId: ticket.nice_id,
        statusId: ticket.status_id
      }
    });
  }

  showCloseButton = () => this.state.screen !== AutomaticAnswersScreen.solveTicketQuestion

  handleSolveTicket = (e) => {
    e.preventDefault();
    const authToken = automaticAnswersPersistence.getContext();

    if (!authToken) return this.requestFailed();

    const articleId = getHelpCenterArticleId();
    const callbacks = {
      done: this.solveTicketDone,
      fail: this.requestFailed
    };

    this.setState({
      isSubmitting: true
    });

    if (authToken && articleId) {
      this.props.solveTicket(authToken, articleId, callbacks);
    } else {
      this.requestFailed();
    }
  }

  solveTicketDone = () => {
    this.setState({
      screen: AutomaticAnswersScreen.ticketClosed,
      isSubmitting: false,
      errorMessage: ''
    });
  }

  requestFailed = () => {
    const errorKey = 'embeddable_framework.automaticAnswers.label.error_mobile';

    this.setState({
      errorMessage: i18n.t(errorKey, {
        fallback: 'There was a problem. Please try again.'
      }),
      isSubmitting: false,
      optionReasonClicked: null
    });
  }

  handleMarkArticleAsIrrelevant = (reason, e) => {
    e.preventDefault();
    const authToken = automaticAnswersPersistence.getContext();

    if (!authToken) return this.requestFailed();

    const articleId = getHelpCenterArticleId();
    const callbacks = {
      done: this.markArticleIrrelevantDone,
      fail: this.requestFailed
    };

    this.setState({
      isSubmitting: true,
      optionReasonClicked: reason
    });

    if (authToken && articleId) {
      this.props.markArticleIrrelevant(authToken, articleId, reason, callbacks);
    } else {
      this.requestFailed();
    }
  }

  markArticleIrrelevantDone = () => {
    this.setState({
      screen: AutomaticAnswersScreen.thanksForFeedback,
      isSubmitting: false,
      optionReasonClicked: null,
      errorMessage: ''
    });
  }

  goToMarkAsIrrelevant = () => {
    this.setState({
      screen: AutomaticAnswersScreen.markAsIrrelevant,
      errorMessage: ''
    });
  }

  randomiseOptions = (options) => {
    const order = this.state.ticket.niceId % options.length;

    return options.slice(order).concat(options.slice(0, order));
  }

  handleDismissalContext = () => {
    if (this.state.screen === AutomaticAnswersScreen.markAsIrrelevant) {
      this.setState({
        screen: AutomaticAnswersScreen.solveTicketQuestion,
        errorMessage: ''
      });
    } else {
      this.props.closeFrame();
    }
  }

  optionWasClicked = (key) => {
    return this.state.optionReasonClicked === key;
  }

  irrelevantOption = (key, classNames) => {
    const submittingLabel = i18n.t('embeddable_framework.submitTicket.form.submitButton.label.sending');

    return (
      <Button key={key}
        className={classNames}
        disabled={this.state.isSubmitting}
        onClick={(e) => this.handleMarkArticleAsIrrelevant(key, e)}
        onTouchStartDisabled={true}
        label={(this.optionWasClicked(key)) ? submittingLabel: AutomaticAnswers.irrelevantReasons[key]}
        primary={false} />
    );
  }

  renderContent = () => {
    switch (this.state.screen) {
      case AutomaticAnswersScreen.solveTicketQuestion:
        return this.renderTicketContent();
      case AutomaticAnswersScreen.ticketClosed:
        return this.renderSuccessContent();
      case AutomaticAnswersScreen.markAsIrrelevant:
        return this.renderIrrelevantContent();
      case AutomaticAnswersScreen.thanksForFeedback :
        return this.renderThanksForFeedbackContent();
      default:
        return this.renderTicketContent();
    }
  }

  render = () => {
    return <div />;
  }
}
