import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { Field } from 'component/field/Field';
import { Button } from 'component/button/Button'
import { ButtonSecondary } from 'component/button/ButtonSecondary';
import { LoadingSpinner } from 'component/Loading';
import { i18n } from 'service/i18n';

export class NpsComment extends Component {
  focusField() {
    ReactDOM.findDOMNode(this.refs.commentField.refs.field).focus();
  }

  render() {
    const sendFeedbackLabel = i18n.t(
      'embeddable_framework.npsMobile.submitButton.label.sendFeedback',
      { fallback: 'Send Feedback' }
    );

    const sendButtonClasses = classNames({
      'u-marginTS NpsComment-sendButton': true,
      'u-marginBM u-sizeFull NpsComment-loadingButton': this.props.isMobile,
      'u-userBackgroundColor u-userBorderColor': this.props.isSubmittingComment,
      'NpsComment-loadingButton': this.props.isSubmittingComment,
      'is-mobile': this.props.isMobile,
      'is-desktop': !this.props.isMobile
    });

    const loadingButtonClass = classNames({
      'NpsComment-loadingSpinner': true,
      'is-mobile': this.props.isMobile,
      'is-desktop': !this.props.isMobile
    });

    const textAreaClasses = classNames({
      'NpsComment-textarea': true,
      'u-textSizeBaseMobile': this.props.isMobile
    });

    const labelClasses = classNames({
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
                               ? <div>{commentSubmitButton}</div>
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
}

NpsComment.propTypes = {
  comment: PropTypes.string.isRequired,
  isMobile: PropTypes.bool.isRequired,
  className: PropTypes.string,
  feedbackPlaceholder: PropTypes.string,
  hasError: PropTypes.bool,
  isSubmittingComment: PropTypes.bool,
  isSubmittingRating: PropTypes.bool,
  label: PropTypes.string,
  onChange: PropTypes.func,
  onSubmit: PropTypes.func
};

NpsComment.defaultProps = {
  className: '',
  feedbackPlaceholder: '',
  hasError: false,
  isSubmittingComment: false,
  isSubmittingRating: false,
  onChange: () => {},
  onSubmit: () => {}
};
