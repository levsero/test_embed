import React from 'react/addons';

import { i18n } from 'service/i18n';
import { Button } from 'component/Button';

export const NpsCommentButton = React.createClass({

  render() {
    const classes = `
      Form-field
      Label
      u-textXHeight
      u-textSize15
      NpsComment-label
      u-marginBN
      u-textCenter
    `;

    const sendButtonClasses = 'u-marginTS u-marginBM u-sizeFull';

    const sendFeedbackLabel = i18n.t(
      'embeddable_framework.npsMobile.submitButton.label.sendFeedback',
      { fallback: 'Send Feedback' }
    );

    /* jshint laxbreak: true */
    const buttonColor = (this.props.comment)
                      ? { backgroundColor: this.props.highlightColor }
                      : null;

    const commentsSubmitButton = <Button
                                  type='submit'
                                  className={sendButtonClasses}
                                  label={sendFeedbackLabel}
                                  disabled={true}
                                  style={buttonColor} />;

    return (
      <div>
        <div className={classes}>
          <span>
            {this.props.label}
          </span>
        </div>
        <div
          onClick={this.props.onClick}
          onTouch={this.props.onClick}
          className='NpsComment-comment-button u-textSizeBaseMobile'>
          {this.props.placeholder}
        </div>
        {commentsSubmitButton}
      </div>
    );
  }
});
