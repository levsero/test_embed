import { Component } from 'react';

export class AutomaticAnswers extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      ticket: {
        title: '',
        niceId: null,
        statusId: null
      }
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

  render() {
    return false;
  }
}

AutomaticAnswers.defaultProps = {};
