import React, { Component, PropTypes } from 'react';

import { AutomaticAnswersDesktop } from 'component/automaticAnswers/AutomaticAnswersDesktop';
import { i18n } from 'service/i18n';
import { getURLParameterByName } from 'utility/pages';
import { bindMethods } from 'utility/utils';

export class AutomaticAnswers extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, AutomaticAnswers.prototype);

    this.state = {
      ticket: {
        title: '',
        niceId: null,
        statusId: null
      },
      solveSuccess: false,
      errorMessage: ''
    };
  }

  updateTicket(ticket) {
    this.setState({
      ticket: {
        title: ticket.title,
        niceId: ticket.nice_id,
        statusId: ticket.status_id
      }
    });
  }

  handleSolveTicket() {
    const ticketId = getURLParameterByName('ticket_id');
    const token = getURLParameterByName('token');
    const callbacks = {
      done: this.solveTicketDone,
      fail: this.solveTicketFail
    };

    if (ticketId && token) {
      this.props.solveTicket(ticketId, token, callbacks);
    } else {
      // TODO - Handle edge case where Embed is visible but user changes the URL.
    }
  }

  solveTicketDone() {
    this.setState({
      solveSuccess: true
    });
  }

  solveTicketFail() {
    this.setState({
      errorMessage: i18n.t('embeddable_framework.automaticAnswers.label.error')
    });
  }

  render() {
    return (
      <AutomaticAnswersDesktop
        {...this.state}
        handleSolveTicket={this.handleSolveTicket} />
    );
  }
}

AutomaticAnswers.propTypes = {
  solveTicket: PropTypes.func.isRequired
};

AutomaticAnswers.defaultProps = {};
