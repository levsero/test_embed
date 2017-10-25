import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ChatRatingGroup, ChatRatings } from 'component/chat/ChatRatingGroup';
import { Button } from 'component/button/Button';

import { locals as styles } from './ChatFeedbackForm.sass';

export class ChatFeedbackForm extends Component {
  static propTypes = {
    updateRating: PropTypes.func.isRequired,
    skipClickFn: PropTypes.func.isRequired,
    sendClickFn: PropTypes.func.isRequired,
    feedbackMessage: PropTypes.string,
    rating: PropTypes.string
  }

  static defaultProps = {
    feedbackMessage: '',
    rating: null
  }

  constructor(props) {
    super(props);

    this.textarea = null;
  }

  renderActionButtons = () => {
    const { rating } = this.props;
    const disabled = rating === ChatRatings.NOT_SET;

    return (
      <div className={styles.buttonGroup}>
        <Button
          className={styles.button}
          primary={false}
          label={i18n.t('embeddable_framework.chat.postChat.rating.button.skip')}
          onClick={this.props.skipClickFn} />
        <Button
          className={styles.rightButton}
          disabled={disabled}
          label={i18n.t('embeddable_framework.common.button.send')}
          onClick={() => this.props.sendClickFn(this.textarea.value)} />
      </div>
    );
  }

  render() {
    const { rating, updateRating, feedbackMessage } = this.props;

    return (
      <div>
        <label className={styles.feedbackMessage}>{feedbackMessage}</label>
        <ChatRatingGroup className={styles.chatRatingGroup} rating={rating} updateRating={updateRating} />
        <label htmlFor='feedbackTextarea' className={styles.feedbackDescription}>
          {i18n.t('embeddable_framework.chat.postChat.rating.description')}
        </label>
        <textarea
          id='feedbackTextarea'
          ref={(el) => { this.textarea = el; }}
          className={styles.textarea}
          placeholder={i18n.t('embeddable_framework.chat.postChat.rating.placeholder.optional')}
          rows={6} />
        {this.renderActionButtons()}
      </div>
    );
  }
}
