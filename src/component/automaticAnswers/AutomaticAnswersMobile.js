import React from 'react';
import classNames from 'classnames';

import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';
import { Button } from 'component/button/Button';
import { Container } from 'component/container/Container';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class AutomaticAnswersMobile extends AutomaticAnswers {
  renderTicketContent = () => {
    return (
      <div className='u-hsizeAll'>
        <div className='AutomaticAnswersMobile-message'>
          {this.renderSolveQuestion()}
          {this.renderErrorMessage()}
          {this.renderButtons()}
        </div>
      </div>
    );
  }

  renderSolveQuestion = () => {
    const introduction = i18n.t('embeddable_framework.automaticAnswers.label.prompt_mobile', {
      fallback: 'Does this article answer your question?'
    });

    return (
      <p className='u-marginBS'>
        <strong>{introduction}</strong>
      </p>
    );
  }

  renderErrorMessage = () => {
    const errorClasses = classNames({
      'Error': true,
      'u-isHidden': !this.state.errorMessage
    });

    return (
      <p className={errorClasses}>
        {this.state.errorMessage}
      </p>
    );
  }

  renderButtons = () => {
    const ctaLabel = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.yes', {
      fallback: 'Yes'
    });
    const noLabel = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.no', {
      fallback: 'No'
    });

    return (
      <div>
        <Button className='AutomaticAnswersBtn--mobile AutomaticAnswersBtn--cta u-marginHT Anim-none'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.handleSolveTicket(e)}
          onTouchStartDisabled={true}
          label={ctaLabel} />
        <Button className='AutomaticAnswersBtn--mobile AutomaticAnswersBtn--no u-marginHT Anim-none'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.goToMarkAsIrrelevant(e)}
          onTouchStartDisabled={true}
          primary={false}
          label={noLabel} />
      </div>
    );
  }

  renderIrrelevantContent = () => {
    const irrelevantQuestion = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.question_v3', {
      fallback: 'Please tell us why:'
    });

    return (
      <div className={'u-textCenter'}>
        <strong className="u-marginBS u-marginTM u-inlineBlock">{irrelevantQuestion}</strong>
        {this.renderErrorMessage()}
        {this.renderIrrelevantOptions()}
      </div>
    );
  }

  renderIrrelevantOptions = () => {
    const classNames = 'AutomaticAnswersBtn--mobile c-btn--fullWidth u-marginVT Anim-none';

    return this.randomiseOptions([
      this.irrelevantOption(AutomaticAnswers.notRelated, classNames),
      this.irrelevantOption(AutomaticAnswers.relatedButNotAnswered, classNames)
    ]);
  }

  renderSuccessContent = () => {
    const successMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.closed', {
      fallback: 'Nice! Your request has been closed'
    });

    return (
      <p className={'AutomaticAnswersMobile-message u-textCenter u-posRelative u-marginVL'}>
        <Icon
          type='Icon--circleTick-small'
          className='u-paddingAN u-posRelative u-marginRS u-inlineBlock u-isSuccessful' />
        <span>{successMessage}</span>
      </p>
    );
  }

  renderThanksForFeedbackContent = () => {
    const feedbackMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.thanks_for_feedback_v2', {
      fallback: 'Thanks for your feedback'
    });

    return (
      <p className='AutomaticAnswersMobile-message u-textCenter u-posRelative u-marginVL'>
        <Icon
          type='Icon--circleTick-small'
          className='u-paddingAN u-posRelative u-marginRS u-inlineBlock u-isSuccessful'/>
        <span>{feedbackMessage}</span>
      </p>
    );
  }

  render = () => {
    const containerClasses = 'AutomaticAnswersMobile u-textSizeMed u-block u-textCenter u-paddingHS u-paddingVS';
    const closeButton = (this.showCloseButton())
      ? (<Icon type="Icon--close" onClick={() => this.handleDismissalContext()} />)
      : null;

    return (
      <Container className={containerClasses}>
        {this.renderContent()}
        {closeButton}
      </Container>
    );
  }
}
