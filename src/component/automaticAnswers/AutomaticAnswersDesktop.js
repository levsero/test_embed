import React from 'react';
import classNames from 'classnames';

import { Button } from 'component/button/Button';
import { Container } from 'component/container/Container';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';
import { AutomaticAnswers } from 'component/automaticAnswers/AutomaticAnswers';

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
    const messageClasses = classNames({
      'AutomaticAnswersDesktop-message AutomaticAnswersDesktop-solve u-paddingBM u-marginBN': true,
      'u-borderBottom': !this.state.errorMessage
    });
    const solveQuestion = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.question', {
      fallback: 'Does this article answer your question?'
    });
    const requestUrl = i18n.t('embeddable_framework.automaticAnswers.desktop.request_url', {
      fallback: `/hc/requests/%(requestId)s`,
      requestId: this.state.ticket.niceId
    });
    const solveQuestionSubtext = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.subtext_v2', {
      fallback: 'If it does, we can close your recent request %(requestLink)s',
      requestLink: `<a target="_blank" href="${requestUrl}">#${this.state.ticket.niceId}</a>`
    });

    return (
      <p className={messageClasses}>
        <strong>{solveQuestion}</strong>
        <span className={'u-paddingTT'} dangerouslySetInnerHTML={{__html: solveQuestionSubtext}} />
      </p>
    );
  }

  renderErrorMessage = (classes = '') => {
    const errorClasses = classNames({
      'Error': true,
      'u-isHidden': !this.state.errorMessage
    }) + ` ${classes}`;

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
    const irrelevantQuestion = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.question_v2', {
      fallback: "Why didn't it answer your question?"
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
    const className='AutomaticAnswersBtn c-btn--fullWidth u-marginVT Anim-all--fast';
    const notRelated = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.not_related', {
      fallback: "It's not related to my question"
    });
    const relatedButNotAnswered = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.related_no_answer', {
      fallback: "It's related but didn't answer my question"
    });

    return this.randomiseOptions([
      <Button key={AutomaticAnswers.notRelated}
        className={className}
        disabled={this.state.isSubmitting}
        onClick={(e) => this.handleMarkArticleAsIrrelevant(AutomaticAnswers.notRelated, e)}
        onTouchStartDisabled={true}
        label={notRelated}
        primary={false} />,
      <Button key={AutomaticAnswers.relatedButNotAnswered}
        className={className}
        disabled={this.state.isSubmitting}
        onClick={(e) => this.handleMarkArticleAsIrrelevant(AutomaticAnswers.relatedButNotAnswered, e)}
        onTouchStartDisabled={true}
        label={relatedButNotAnswered}
        primary={false} />
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
      ? (<Icon type="Icon--close" onClick={() => this.props.closeFrame(0)} />)
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
