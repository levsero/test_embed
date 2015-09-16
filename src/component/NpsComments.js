import React from 'react/addons';

import { Field } from 'component/FormField';
import { Button,
         ButtonSecondary } from 'component/Button';
import { LoadingSpinner } from 'component/Loading';
import { i18n } from 'service/i18n';
import { generateConstrastColor } from 'utility/utils';

const classSet = React.addons.classSet;

export const NpsComments = React.createClass({
  onSubmit(...args) {
    this.refs.commentField.setState({
      hasError: false
    });
    this.props.onSubmit.apply(null, args);
  },

  render() {
    /* jshint laxbreak: true */
    const commentClasses = classSet({
      'CommentsContainer': true,
      'u-isHidden': this.props.hidden
    });

    const sendButtonClasses = classSet({
      'u-marginTS u-marginBM u-sizeFull': true
    });

    const loadingSpinner = <LoadingSpinner
                             generateHighlightColor={generateConstrastColor}
                             highlightColor={this.props.highlightColor} />;

    const sendFeedbackLabel = i18n.t(
      'embeddable_framework.npsMobile.submitButton.label.sendFeedback',
      { fallback: 'Send Feedback' }
    );

    const buttonColor = (this.props.comment)
                      ? this.props.highlightColor
                      : null;

    const commentsSubmitButton = (this.props.isSubmittingComment)
                               ? <ButtonSecondary
                                   className={sendButtonClasses}
                                   label={loadingSpinner}
                                   style={{ backgroundColor: buttonColor }} />
                               : <Button
                                   type='submit'
                                   className={sendButtonClasses}
                                   label={sendFeedbackLabel}
                                   disabled={!this.props.comment}
                                   style={{ backgroundColor: buttonColor }} />;

    return (
      <div className={commentClasses}>
        <form onSubmit={this.onSubmit}>
          <Field
            hasError={this.props.hasError}
            ref='commentField'
            placeholder={this.props.commentsQuestion}
            value={this.props.comment}
            name='comment'
            onChange={this.props.onChange}
            input={
              <textarea
                placeholder={this.props.feedbackPlaceholder}
                rows='1'>
              </textarea>
            } />
          {commentsSubmitButton}
        </form>
      </div>
    );
  }
});
