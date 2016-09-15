import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

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

  componentDidUpdate() {
    this.props.updateFrameSize();
  }

  handleSolveClick(e) {
    e.preventDefault();
    this.props.handleSolveTicket();
  }

  renderMasterIcon() {
    const type = this.props.solveSuccess ? 'tick' : 'article';
    const props = {
      className: 'AutomaticAnswersDesktop-masterIcon u-posAbsolute u-paddingAN u-textCenter'
    };

    return (
      <Icon
        {...props}
        type={`Icon--${type}`} />
    );
  }

  renderContent() {
    return (!this.props.solveSuccess) ? this.renderTicketContent() : this.renderSuccessContent();
  }

  renderTicketContent() {
    return (
      <div>
        {this.renderIntroduction()}
        {this.renderErrorMessage()}
        {this.renderButton()}
      </div>
    );
  }

  renderIntroduction() {
    const messageClasses = classNames({
      'AutomaticAnswersDesktop-message u-paddingTL u-paddingBXL u-marginBN': true,
      'u-borderBottom': !this.props.errorMessage
    });
    const introduction = i18n.t('embeddable_framework.automaticAnswers.label.introduction', {
      fallback: `<span>Hi there,</span> If this article answers your question, ` +
                `please let us know and we'll close your request %(requestIdUrl)s.`,
      requestIdUrl: `#${this.props.ticketNiceId}`
    });

    return (
      <p className={messageClasses}
        dangerouslySetInnerHTML={{__html: introduction}}>
      </p>
    );
  }

  renderErrorMessage() {
    const errorClasses = classNames({
      'Error': true,
      'u-isHidden': !this.props.errorMessage
    });

    return (
      <p className={errorClasses}>
        {this.props.errorMessage}
      </p>
    );
  }

  renderButton() {
    const submittingLabel = i18n.t('embeddable_framework.submitTicket.form.submitButton.label.sending');
    const ctaLabel = i18n.t('embeddable_framework.automaticAnswers.button.solve_v2', {
      fallback: 'Yes, close my request'
    });

    return (
      <div className='AutomaticAnswersDesktop-footer u-posRelative u-marginTM'>
        <Button className='u-pullRight'
          disabled={this.props.isSubmitting}
          onClick={this.handleSolveClick}
          label={(this.props.isSubmitting) ? submittingLabel : ctaLabel} />
      </div>
    );
  }

  renderSuccessContent() {
    const successMessage = i18n.t('embeddable_framework.automaticAnswers.label.success_v2', {
      fallback: 'Thank you, your request has been closed.'
    });

    return (
      <p className={'AutomaticAnswersDesktop-message u-isSuccessful u-textCenter u-paddingVXL u-marginVXL'}>
        {successMessage}
      </p>
    );
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
  solveSuccess: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  updateFrameSize: PropTypes.func,
  handleSolveTicket: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired,
  ticketNiceId: PropTypes.number
};

AutomaticAnswersDesktop.defaultProps = {
  updateFrameSize: () => {}
};
