import React from 'react/addons';

import { Field } from 'component/FormField';
import { Button,
         ButtonSecondary } from 'component/Button';
import { LoadingSpinner } from 'component/Loading';
import { i18n } from 'service/i18n';
import { generateConstrastColor } from 'utility/utils';

export const NpsComment = React.createClass({

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

    const sendButtonClasses = 'u-marginTS u-marginBM u-sizeFull';

    const loadingSpinner = <LoadingSpinner
                             highlightColor={generateConstrastColor(this.props.highlightColor)} />;

    /* jshint laxbreak: true */
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
                            className='NpsComment-textarea u-textSizeBaseMobile'
                            placeholder={this.props.placeholder}
                            rows='1' />;

    return (
      <div className={this.props.className}>
        <form onSubmit={this.props.onSubmit}>
          <Field
            labelClasses='NpsComment-label u-marginBN u-textCenter'
            hasError={this.props.hasError}
            ref='commentField'
            placeholder={this.props.label}
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
