import React from 'react/addons';

import { Field } from 'component/FormField';
import { Button,
         ButtonSecondary } from 'component/Button';
import { LoadingSpinner } from 'component/Loading';
import { i18n } from 'service/i18n';

const classSet = React.addons.classSet;

export const NpsComment = React.createClass({
  propTypes: {
    comment: React.PropTypes.string.isRequired,
    isMobile: React.PropTypes.bool.isRequired,
    className: React.addons.classSet,
    feedbackPlaceholder: React.PropTypes.string,
    hasError: React.PropTypes.bool,
    isSubmittingComment: React.PropTypes.bool,
    isSubmittingRating: React.PropTypes.bool,
    label: React.PropTypes.string,
    onChange: React.PropTypes.func,
    onSubmit: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      className: '',
      feedbackPlaceholder: '',
      hasError: false,
      isSubmittingComment: false,
      isSubmittingRating: false,
      onChange: () => {},
      onSubmit: () => {}
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
      'u-marginTS NpsComment-sendButton': true,
      'u-marginBM u-sizeFull NpsComment-loadingButton': this.props.isMobile,
      'u-userBackgroundColor u-userBorderColor': this.props.isSubmittingComment,
      'NpsComment-loadingButton': this.props.isSubmittingComment,
      'is-mobile': this.props.isMobile,
      'is-desktop': !this.props.isMobile
    });

    const loadingButtonClass = classSet({
      'NpsComment-loadingSpinner': true,
      'is-mobile': this.props.isMobile,
      'is-desktop': !this.props.isMobile
    });

    const textAreaClasses = classSet({
      'NpsComment-textarea': true,
      'u-textSizeBaseMobile': this.props.isMobile
    });

    const labelClasses = classSet({
      'NpsComment-label u-marginBN u-textCenter u-borderNone': true,
      'is-mobile': this.props.isMobile
    });

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

    const inputTextArea = (<textarea
                             className={textAreaClasses}
                             placeholder={this.props.feedbackPlaceholder}
                             rows='1' />);

    return (
      <div className={this.props.className}>
        <form
          className='NpsComment-form'
          onSubmit={this.props.onSubmit}>
          <Field
            labelClasses={labelClasses}
            hasError={this.props.hasError}
            ref='commentField'
            placeholder={this.props.label}
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
