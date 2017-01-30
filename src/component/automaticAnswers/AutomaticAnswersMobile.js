import React from 'react';
import classNames from 'classnames';

import { AutomaticAnswers,
         NOT_RELATED,
         RELATED_BUT_NOT_ANSWERED } from 'component/automaticAnswers/AutomaticAnswers';
import { Button } from 'component/button/Button';
import { Container } from 'component/container/Container';
import { Icon } from 'component/Icon';
import { i18n } from 'service/i18n';

export class AutomaticAnswersMobile extends AutomaticAnswers {
  renderTicketContent = () => {
    return (
      <div className='u-hsizeAll'>
        {this.renderErrorMessage()}
        <div className='AutomaticAnswersMobile-message'>
          {this.renderSolveQuestion()}
          {this.renderButtons()}
        </div>
      </div>
    );
  }

  renderSolveQuestion = () => {
    const messageClasses = 'u-marginBT';
    const introduction = i18n.t('embeddable_framework.automaticAnswers.label.prompt_mobile', {
      fallback: 'Does this article answer your question?'
    });

    return (
      <p className={messageClasses}>
        <strong>{introduction}</strong>
      </p>
    );
  }

  renderErrorMessage = () => {
    const errorClasses = classNames({
      'u-backgroundWhite u-textCenter u-marginBN u-paddingBM u-isError u-borderBottom': true,
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
      <div className='AutomaticAnswersDesktop-footer'>
        <Button className='AutomaticAnswersBtn AutomaticAnswersBtn--cta u-marginHT'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.handleSolveTicket(e)}
          label={ctaLabel} />
        <Button className='AutomaticAnswersBtn AutomaticAnswersBtn--no u-marginHT'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.goToMarkAsIrrelevant(e)}
          primary={false}
          label={noLabel} />
      </div>
    );
  }

  renderIrrelevantContent = () => {
    const irrelevantQuestion = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.question_v2', {
      fallback: "Why didn't it answer your question?"
    });

    return (
      <div className={'AutomaticAnswersDesktop-message u-textCenter u-textSizeSml'}>
        <strong className="u-marginBS u-marginTS u-inlineBlock">{irrelevantQuestion}</strong>
        {this.renderErrorMessage()}
        {this.renderIrrelevantOptions()}
      </div>
    );
  }

  renderIrrelevantOptions = () => {
    const notRelated = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.not_related', {
      fallback: "It's not related to my question"
    });
    const relatedButNotAnswered = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.related_no_answer', {
      fallback: "It's related but didn't answer my question"
    });

    return (
      <div className="u-marginBT">
        <Button key="notRelated"
          className='AutomaticAnswersBtn c-btn--fullWidth Anim-all--fast'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.handleMarkArticleAsIrrelevant(NOT_RELATED, e)}
          label={notRelated}
          primary={false} />
        <Button key="relatedButNotAnswered"
          className='AutomaticAnswersBtn c-btn--fullWidth u-marginTS Anim-all--fast'
          disabled={this.state.isSubmitting}
          onClick={(e) => this.handleMarkArticleAsIrrelevant(RELATED_BUT_NOT_ANSWERED, e)}
          label={relatedButNotAnswered}
          primary={false} />
      </div>
    );
  }

  renderSuccessContent = () => {
    const successMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.solve.closed', {
      fallback: 'Nice! Your request has been closed'
    });

    return (
      <p className={'AutomaticAnswersMobile-message u-textCenter u-posRelative u-marginVS'}>
        <Icon type='Icon--circleTick-small' className='u-paddingAN u-posRelative u-marginRS u-inlineBlock u-isSuccessful'/>
        <span>{successMessage}</span>
      </p>
    );
  }

  renderThanksForFeedbackContent = () => {
    const feedbackMessage = i18n.t('embeddable_framework.automaticAnswers.desktop.irrelevant.thanks_for_feedback_v2', {
      fallback: 'Thanks for your feedback'
    });

    return (
      <p className={'AutomaticAnswersMobile-message u-textCenter u-posRelative u-marginVS'}>
        <Icon type='Icon--circleTick-small' className='u-paddingAN u-posRelative u-marginRS u-inlineBlock u-isSuccessful'/>
        <span>{feedbackMessage}</span>
      </p>
    );
  }

  render = () => {
    const containerClasses = 'AutomaticAnswersMobile u-block u-textCenter u-paddingHS u-paddingVS';
    const closeButton = (this.showCloseButton())
      ? (<Icon type="Icon--close" onClick={() => this.props.closeFrame(0)} />)
      : null;

    return (
      <Container className={containerClasses}>
        {closeButton}
        {this.renderContent()}
      </Container>
    );
  }
}
