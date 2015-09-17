import React from 'react/addons';

import { Field } from 'component/FormField';
import { Button,
         ButtonSecondary } from 'component/Button';
import { LoadingSpinner } from 'component/Loading';
import { i18n } from 'service/i18n';
import { generateConstrastColor } from 'utility/utils';

const classSet = React.addons.classSet;

const sendFeedbackLabel = i18n.t(
  'embeddable_framework.npsMobile.submitButton.label.sendFeedback',
  { fallback: 'Send Feedback' }
);
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

    const buttonColor = (this.props.comment)
                      ? { backgroundColor: this.props.highlightColor }
                      : null;

    const commentsSubmitButton = (this.props.isSubmittingComment)
                               ? <ButtonSecondary
                                   className={sendButtonClasses}
                                   label={loadingSpinner}
                                   style={buttonColor} />
                               : <Button
                                   type='submit'
                                   className={sendButtonClasses}
                                   label={sendFeedbackLabel}
                                   disabled={!this.props.comment}
                                   style={buttonColor} />;

    const inputTextArea = <textarea
                            placeholder={this.props.feedbackPlaceholder}
                            rows='1' />;

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
            input={inputTextArea} />
          {commentsSubmitButton}
        </form>
      </div>
    );
  }
});
