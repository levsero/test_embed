import React from 'react';

import { Button } from 'component/button/Button';
import { Container } from 'component/container/Container';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';

import ClosedWithUndo from './Desktop/ClosedWithUndo';
import Reopened from './Desktop/Reopened';
import UndoError from './Desktop/UndoError';

export class AutomaticAnswersDesktop extends AutomaticAnswers {
  renderTicketContent = () => {
    return (
      <div>
        {this.renderSolveQuestion()}
        {this.renderErrorMessage()}
        {this.renderButtons()}
      </div>
    );
  }

  renderSolveQuestion = () => {
    const borderStyles = (!this.state.errorMessage) ? 'u-borderBottom' : '';
    const messageClasses = `
      AutomaticAnswersDesktop-message
      AutomaticAnswersDesktop-solve
      u-paddingBM
      u-marginBN
      ${borderStyles}
    `;
    const solveQuestion = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.question', {
      fallback: 'Does this article answer your question?'
    });
    const solveQuestionSubtext = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.subtext_v2', {
      fallback: 'If it does, we can close your recent request %(requestLink)s',
      requestLink: `<strong>#${this.state.ticket.niceId}</strong>`
    });

    return (
      <p className={messageClasses}>
        <strong>{solveQuestion}</strong>
        <span className={'u-paddingTT'} dangerouslySetInnerHTML={{__html: solveQuestionSubtext}} />
      </p>
    );
  }

  renderErrorMessage = (classes = '') => {
    const visibilityStyles = !this.state.errorMessage ? 'u-isHidden' : '';
    const errorClasses = `Error ${visibilityStyles} ${classes}`;

    return (
      <p className={errorClasses}>
        {this.state.errorMessage}
      </p>
    );
  }

  renderButtons = () => {
    const submittingLabel = i18n.t('embeddable_framework.submitTicket.form.submitButton.label.sending');
    const ctaLabel = i18n.t('embeddable_framework.automaticAnswers.button.solve_v2', {
      fallback: 'Yes, close my request'
    });
    const noLabel = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.no', {
      fallback: 'No'
    });

    return (
      <div className='AutomaticAnswersDesktop-footer u-posRelative u-marginTM'>
        <Button className='AutomaticAnswersBtn AutomaticAnswersBtn--no u-pullRight u-marginLS Anim-all--fast'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.goToMarkAsIrrelevant(e)}
          onTouchStartDisabled={true}
          primary={false}
          label={noLabel} />
        <Button className='AutomaticAnswersBtn AutomaticAnswersBtn--cta u-pullRight Anim-all--fast'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.handleSolveTicket(e)}
          onTouchStartDisabled={true}
          label={(this.state.isSubmitting) ? submittingLabel : ctaLabel} />
      </div>
    );
  }

  renderIrrelevantContent = () => {
    const irrelevantQuestion = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.question_v3', {
      fallback: 'Please tell us why:'
    });

    return (
      <div className={'AutomaticAnswersDesktop-message u-textCenter u-textSizeSml'}>
        <strong className="u-marginBS u-inlineBlock">{irrelevantQuestion}</strong>
        {this.renderErrorMessage('u-marginTT u-marginBS')}
        {this.renderIrrelevantOptions()}
      </div>
    );
  }

  renderIrrelevantOptions = () => {
    const classNames = 'AutomaticAnswersBtn c-btn--fullWidth u-marginVT Anim-all--fast';

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
      <p className={'AutomaticAnswersDesktop-message u-textCenter u-marginVL'}>
        <Icon type='Icon--circleTick-large' className='u-paddingAN u-isSuccessful u-paddingBS'/>
        <span>{successMessage}</span>
      </p>
    );
  }

  renderClosedWithUndo = () => {
    return (
      <ClosedWithUndo
        isSubmitting={this.state.isSubmitting}
        handleUndo={this.handleUndo}
        closeFrameAfterDelay={this.props.closeFrameAfterDelay}
      />
    );
  }

  renderReopened = () => <Reopened />;

  renderUndoError = () => <UndoError />;

  renderThanksForFeedbackContent = () => {
    const feedbackMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.thanks_for_feedback_v2', {
      fallback: 'Thanks for your feedback'
    });

    return (
      <p className={'AutomaticAnswersDesktop-message u-textCenter u-marginVL'}>
        <Icon type='Icon--circleTick-large' className='u-paddingAN u-isSuccessful u-paddingBS'/>
        <span>{feedbackMessage}</span>
      </p>
    );
  }

  render = () => {
    const closeButton = (this.showCloseButton()
      ? (<Icon type="Icon--close" onClick={() => this.handleDismissalContext()} />)
      : null);

    return (
      <Container card={true} className='AutomaticAnswersDesktop u-paddingHL'>
        <div className='Container-content u-paddingBM'>
          {this.renderContent()}
        </div>
        {closeButton}
      </Container>
    );
  }
}
