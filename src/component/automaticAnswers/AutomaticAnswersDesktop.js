import React, { Component, PropTypes } from 'react';

import { Button } from 'component/button/Button';
import { Container } from 'component/Container';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class AutomaticAnswersDesktop extends Component {
  constructor(props, context) {
    super(props, context);

    this.handleSolveClick = this.handleSolveClick.bind(this);
  }

  componentDidMount() {
    this.props.updateFrameSize();
  }

  handleSolveClick(e) {
    e.preventDefault();
    this.props.handleSolveTicket();
  }

  renderMasterIcon() {
    const props = {
      className: 'AutomaticAnswersDesktop-masterIcon u-posAbsolute u-paddingAN u-textCenter'
    };

    return (
      <Icon
        {...props}
        type='Icon--article' />
    );
  }

  renderContent() {
    return (
      <div>
        <p className='AutomaticAnswersDesktop-message u-paddingTL u-paddingBXL'
            dangerouslySetInnerHTML={{__html: this.renderIntroduction()}}>
        </p>
        <div className='AutomaticAnswersDesktop-footer u-posRelative'>
          <Button className='u-pullRight'
            onClick={this.handleSolveClick}
            label={this.buttonLabel()} />
        </div>
      </div>
    );
  }

  renderIntroduction() {
    // TODO - Add link to HC request page using zendeskHost
    return i18n.t('embeddable_framework.automaticAnswers.label.introduction', {
      fallback: `<span>Hi there,</span> If this article answers your question, ` +
                `please let us know and we'll close your request %(requestIdUrl)s.`,
      requestIdUrl: `#${this.props.ticketNiceId}`
    });
  }

  buttonLabel() {
    // TODO - Update to 'Submitting...' when button clicked
    return i18n.t('embeddable_framework.automaticAnswers.button.solve_v2', {
      fallback: 'Yes, close my request'
    });
  }

  render() {
    return (
      <Container card={true} className='AutomaticAnswersDesktop u-paddingHXL'>
        <div className='Container-content u-paddingBM'>
          {this.renderMasterIcon()}
          {this.renderContent()}
        </div>
      </Container>
    );
  }
}

AutomaticAnswersDesktop.propTypes = {
  updateFrameSize: PropTypes.func.isRequired,
  handleSolveTicket: PropTypes.func.isRequired,
  ticketNiceId: PropTypes.number
};

AutomaticAnswersDesktop.defaultProps = {
  updateFrameSize: () => {}
};
