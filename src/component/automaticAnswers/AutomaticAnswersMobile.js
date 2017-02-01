import React from 'react';
import classNames from 'classnames';

import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';
import { Container } from 'component/container/Container';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class AutomaticAnswersMobile extends AutomaticAnswers {
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
      'u-isHidden': !this.state.errorMessage
    });

    return (
      <p className={errorClasses}>
        {this.state.errorMessage}
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
        disabled={this.state.isSubmitting}
        onTouchStart={(e) => this.handleSolveClick(e)}
        onClick={(e) => this.handleSolveTicket(e)} >
        <Icon type='Icon--tick-inline' />
        {(this.state.isSubmitting) ? submittingLabel : ctaLabel}
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
