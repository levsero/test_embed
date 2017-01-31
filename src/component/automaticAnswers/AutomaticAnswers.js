import React, { Component, PropTypes } from 'react';

import { automaticAnswersPersistence  } from 'service/automaticAnswersPersistence';
import { i18n } from 'service/i18n';
import { getHelpCenterArticleId } from 'utility/pages';

const closeFrameDelay = 5000;

export class AutomaticAnswers extends Component {
  static propTypes = {
    solveTicket: PropTypes.func.isRequired,
    markArticleIrrelevant: PropTypes.func.isRequired,
    updateFrameSize: PropTypes.func,
    mobile: PropTypes.bool.isRequired,
    closeFrame: PropTypes.func.isRequired
  };

  static defaultProps = {
    updateFrameSize: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      ticket: {
        title: '',
        niceId: null,
        statusId: null
      },
      screen: AutomaticAnswers.solveTicketQuestion,
      errorMessage: '',
      isSubmitting: false
    };
  }

  componentDidMount = () => {
    this.props.updateFrameSize();
  }

  componentDidUpdate = () => {
    this.props.updateFrameSize();

    if (this.isFinalScreen()) this.props.closeFrame(closeFrameDelay);
  }

  // screen states
  static solveTicketQuestion = 'SOLVE_TICKET_QUESTION';
  static ticketClosed = 'TICKET_CLOSED';
  static thanksForFeedback = 'THANKS_FOR_FEEDBACK';
  static markAsIrrelevant = 'MARK_AS_IRRELEVANT';

  // irrelevent article reasons
  static notRelated = 1;
  static relatedButNotAnswered = 2;

  updateTicket = (ticket) => {
    this.setState({
      ticket: {
        title: ticket.title,
        niceId: ticket.nice_id,
        statusId: ticket.status_id
      }
    });
  }

  showCloseButton = () => this.state.screen !== AutomaticAnswers.solveTicketQuestion

  isFinalScreen = () => {
    const screen = this.state.screen;

    return screen === AutomaticAnswers.ticketClosed ||
           screen === AutomaticAnswers.thanksForFeedback;
  }

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
      screen: AutomaticAnswers.ticketClosed,
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
      isSubmitting: false
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
      isSubmitting: true
    });

    if (authToken && articleId) {
      this.props.markArticleIrrelevant(authToken, articleId, reason, callbacks);
    } else {
      this.requestFailed();
    }
  }

  markArticleIrrelevantDone = () => {
    this.setState({
      screen: AutomaticAnswers.thanksForFeedback,
      isSubmitting: false,
      errorMessage: ''
    });
  }

  goToMarkAsIrrelevant = () => {
    this.setState({
      screen: AutomaticAnswers.markAsIrrelevant,
      errorMessage: ''
    });
  }

  randomiseOptions = (options) => {
    const order = this.state.ticket.niceId % options.length;

    return options.slice(order).concat(options.slice(0, order));
  }

  renderContent = () => {
    switch (this.state.screen) {
      case AutomaticAnswers.solveTicketQuestion:
        return this.renderTicketContent();
      case AutomaticAnswers.ticketClosed:
        return this.renderSuccessContent();
      case AutomaticAnswers.markAsIrrelevant:
        return this.renderIrrelevantContent();
      case AutomaticAnswers.thanksForFeedback :
        return this.renderThanksForFeedbackContent();
      default:
        return this.renderTicketContent();
    }
  }

  render = () => {
    return <div />;
  }
}
