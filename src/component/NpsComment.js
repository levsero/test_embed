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
      'NpsComment-loadingButton--desktop': !this.props.isMobile,
      'u-userBackgroundColor u-userBorderColor': this.props.isSubmittingComment
    });

    const textAreaClasses = classSet({
      'NpsComment-textarea': true,
      'u-textSizeBaseMobile': this.props.isMobile
    });

    const labelClasses = classSet({
      'NpsComment-label u-marginBN u-textCenter u-borderNone': true,
      'is-mobile': this.props.isMobile
    });

    /* jshint laxbreak: true */
    const commentsSubmitButton = (this.props.isSubmittingComment)
                               ? <ButtonSecondary
                                   className={sendButtonClasses}
                                   label={<LoadingSpinner />} />
                               : <Button
                                   type='submit'
                                   className={sendButtonClasses}
                                   label={sendFeedbackLabel}
                                   disabled={!this.props.comment || this.props.isSubmittingRating} />;

    const commentsSubmitContents = (this.props.isMobile)
                                  ? {commentsSubmitButton}
                                  : <div className='NpsComment-submitContainer'>
                                      {commentsSubmitButton}
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
          {commentsSubmitContents}
        </form>
      </div>
    );
  }
});
