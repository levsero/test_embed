import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Container } from 'component/Container';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class AutomaticAnswersMobile extends Component {
  componentDidMount = () => {
    this.props.updateFrameSize();
  }

  componentDidUpdate = () => {
    this.props.updateFrameSize();
  }

  handleSolveClick = (e) => {
    e.preventDefault();
    this.props.handleSolveTicket();
  }

  renderContent = () => {
    return (!this.props.solveSuccess) ? this.renderTicketContent() : this.renderSuccessContent();
  }

  renderTicketContent = () => {
    const messageClasses =
      'AutomaticAnswersMobile-message u-flex u-flexAlignItemsCenter u-flexJustifyBetween u-marginHL u-paddingVL';

    return (
      <div className='u-hsizeAll'>
        {this.renderErrorMessage()}
        <div className={messageClasses}>
          {this.renderIntroduction()}
          {this.renderButton()}
        </div>
      </div>
    );
  }

  renderIntroduction = () => {
    const messageClasses = 'AutomaticAnswersMobile-message u-marginBN';
    const introduction = i18n.t('embeddable_framework.automaticAnswers.label.prompt_mobile', {
      fallback: 'Does this article answer your question?'
    });

    return (
      <p className={messageClasses}>
        {introduction}
      </p>
    );
  }

  renderErrorMessage = () => {
    const errorClasses = classNames({
      'u-backgroundWhite u-textCenter u-marginBN u-paddingVM u-isError u-borderBottom': true,
      'u-isHidden': !this.props.errorMessage
    });

    return (
      <p className={errorClasses}>
        {this.props.errorMessage}
      </p>
    );
  }

  renderButton = () => {
    const ctaLabel = i18n.t('embeddable_framework.automaticAnswers.button_mobile', {
      fallback: 'Yes'
    });
    const submittingLabel = '...';
    const buttonClasses = 'c-btn c-btn--medium c-btn--primary--icon ' +
      'Anim-color u-textNoWrap u-borderTransparent u-userBackgroundColor u-marginLS is-mobile';

    // TODO - Create a reusable ButtonWithIcon component to replace this.
    return (
      <button className={buttonClasses}
        disabled={this.props.isSubmitting}
        onTouchStart={this.handleSolveClick}
        onClick={this.handleSolveClick} >
        <Icon type='Icon--tick-inline' />
        {(this.props.isSubmitting) ? submittingLabel : ctaLabel}
      </button>
    );
  }

  renderSuccessContent = () => {
    const successMessage = i18n.t('embeddable_framework.automaticAnswers.label.success_v2', {
      fallback: 'Thank you, your request has been closed.'
    });

    return (
      <p className={'u-isSuccessful u-textBold u-textCenter u-marginBN u-marginHL u-marginVXL'}>
        <Icon type='Icon--tick-inline' />
        {successMessage}
      </p>
    );
  }

  render = () => {
    const containerClasses =
      'AutomaticAnswersMobile u-backgroundWhiteSmoke u-flex u-flexJustifyCenter u-flexAlignItemsCenter';

    return (
      <Container className={containerClasses}>
        {this.renderContent()}
      </Container>
    );
  }
}

AutomaticAnswersMobile.propTypes = {
  solveSuccess: PropTypes.bool.isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  updateFrameSize: PropTypes.func,
  handleSolveTicket: PropTypes.func.isRequired,
  errorMessage: PropTypes.string.isRequired
};

AutomaticAnswersMobile.defaultProps = {
  updateFrameSize: () => {}
};
