import React, { Component, PropTypes } from 'react';

import { AutomaticAnswersDesktop } from 'component/automaticAnswers/AutomaticAnswersDesktop';
import { AutomaticAnswersMobile } from 'component/automaticAnswers/AutomaticAnswersMobile';
import { automaticAnswersPersistence  } from 'service/automaticAnswersPersistence';
import { i18n } from 'service/i18n';
import { getHelpCenterArticleId } from 'utility/pages';

const closeFrameDelay = 4000;

export class AutomaticAnswers extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      ticket: {
        title: '',
        niceId: null,
        statusId: null
      },
      solveSuccess: false,
      errorMessage: '',
      isSubmitting: false
    };
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

  handleSolveTicket = () => {
    const jwtBody = automaticAnswersPersistence.getContext();

    if (!jwtBody)  {
      return this.solveTicketFail();
    }

    const ticketId = jwtBody.ticket_id;
    const token = jwtBody.token;
    const articleId = getHelpCenterArticleId();
    const callbacks = {
      done: this.solveTicketDone,
      fail: this.solveTicketFail
    };

    this.setState({
      errorMessage: '',
      isSubmitting: true
    });

    if (ticketId && token && articleId) {
      this.props.solveTicket(ticketId, token, articleId, callbacks);
    } else {
      this.solveTicketFail();
    }
  }

  solveTicketDone = () => {
    this.setState({
      solveSuccess: true,
      isSubmitting: false
    });

    this.props.closeFrame(closeFrameDelay);
  }

  solveTicketFail = () => {
    const errorKey = (this.props.mobile)
                     ? 'embeddable_framework.automaticAnswers.label.error_mobile'
                     : 'embeddable_framework.automaticAnswers.label.error_v2';

    this.setState({
      errorMessage: i18n.t(errorKey, {
        fallback: 'There was a problem. Please try again.'
      }),
      isSubmitting: false
    });
  }

  renderMobile = () => {
    return (
      <AutomaticAnswersMobile
        solveSuccess={this.state.solveSuccess}
        errorMessage={this.state.errorMessage}
        isSubmitting={this.state.isSubmitting}
        handleSolveTicket={this.handleSolveTicket}
        updateFrameSize={this.props.updateFrameSize} />
    );
  }

  renderDesktop = () => {
    return (
      <AutomaticAnswersDesktop
        ticketNiceId={this.state.ticket.niceId}
        solveSuccess={this.state.solveSuccess}
        errorMessage={this.state.errorMessage}
        isSubmitting={this.state.isSubmitting}
        handleSolveTicket={this.handleSolveTicket}
        updateFrameSize={this.props.updateFrameSize} />
    );
  }

  render = () => {
    return (this.props.mobile) ? this.renderMobile() : this.renderDesktop();
  }
}

AutomaticAnswers.propTypes = {
  solveTicket: PropTypes.func.isRequired,
  updateFrameSize: PropTypes.func,
  mobile: PropTypes.bool.isRequired,
  closeFrame: PropTypes.func.isRequired
};

AutomaticAnswers.defaultProps = {};
