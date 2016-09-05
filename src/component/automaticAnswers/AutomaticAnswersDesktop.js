import{ Component, PropTypes } from 'react';

export class AutomaticAnswersDesktop extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSolveClick = this.handleSolveClick.bind(this);
  }

  handleSolveClick(e) {
    e.preventDefault();
    this.props.handleSolveTicket();
  }

  render() {
    return false;
  }
}

AutomaticAnswersDesktop.propTypes = {
  handleSolveTicket: PropTypes.func.isRequired
};
