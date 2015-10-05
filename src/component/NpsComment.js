import React from 'react/addons';

const classSet = React.addons.classSet;

import { Field } from 'component/FormField';
import { Button,
         ButtonSecondary } from 'component/Button';
import { LoadingSpinner } from 'component/Loading';
import { i18n } from 'service/i18n';

export const NpsComment = React.createClass({
  getDefaultProps() {
    return {
      className: ''
    };
  },

  focusField() {
    this.refs.commentField
      .refs.field.getDOMNode()
      .focus();
  },

  render() {
    const sendFeedbackLabel = i18n.t(
      'embeddable_framework.npsMobile.submitButton.label.sendFeedback',
      { fallback: 'Send Feedback' }
    );

    const sendButtonClasses = classSet({
      'u-marginTS': true,
      'u-marginBM u-sizeFull NpsComment-loadingButton--mobile': this.props.isMobile,
      'NpsComment-sendButton--desktop': !this.props.isMobile,
      'u-userBackgroundColor u-userBorderColor': this.props.isSubmittingComment,
      'NpsComment-loadingButton--desktop': this.props.isSubmittingComment && !this.props.isMobile
    });

    const loadingButtonClass = classSet({
      'NpsComment-loadingButton--desktop-loadingSpinner': !this.props.isMobile
    });

    const textAreaClasses = classSet({
      'NpsComment-textarea': true,
      'u-textSizeBaseMobile': this.props.isMobile
    });

    const labelClasses = 'NpsComment-label u-marginBN u-textCenter u-borderNone';

    /* jshint laxbreak: true */
    const commentSubmitButton = (this.props.isSubmittingComment)
                              ? <ButtonSecondary
                                  className={sendButtonClasses}
                                  label={<LoadingSpinner className={loadingButtonClass} />} />
                              : <Button
                                  type='submit'
                                  className={sendButtonClasses}
                                  label={sendFeedbackLabel}
                                  disabled={!this.props.comment || this.props.isSubmittingRating} />;

    const commentSubmitContent = (this.props.isMobile)
                               ? {commentSubmitButton}
                               : <div className='NpsComment-submitContainer'>
                                   {commentSubmitButton}
                                 </div>;

    const inputTextArea = <textarea
                            className={textAreaClasses}
                            placeholder={this.props.feedbackPlaceholder}
                            rows='1' />;

    return (
      <div className={this.props.className}>
        <form onSubmit={this.props.onSubmit}>
          <Field
            labelClasses={labelClasses}
            hasError={this.props.hasError}
            ref='commentField'
            placeholder={this.props.commentsQuestion}
            value={this.props.comment}
            name='comment'
            onChange={this.props.onChange}
            input={inputTextArea} />
          {commentSubmitContent}
        </form>
      </div>
    );
  }
});
