import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ChatRatingGroup, ChatRatings } from 'component/chat/ChatRatingGroup';
import { Button } from 'component/button/Button';

import { locals as styles } from './ChatFeedbackForm.scss';

export class ChatFeedbackForm extends Component {
  static propTypes = {
    skipClickFn: PropTypes.func.isRequired,
    sendClickFn: PropTypes.func.isRequired,
    feedbackMessage: PropTypes.string,
    rating: PropTypes.object.isRequired,
    cancelButtonText: PropTypes.string.isRequired
  }

  static defaultProps = {
    feedbackMessage: '',
    rating: {
      value: ChatRatings.NOT_SET
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      selectedRating: props.rating.value
    };
    this.textarea = null;
  }

  renderActionButtons = () => {
    const { cancelButtonText } = this.props;
    const disabled = this.state.selectedRating === ChatRatings.NOT_SET;

    return (
      <div className={styles.buttonGroup}>
        <Button
          onTouchStartDisabled={true}
          className={styles.button}
          primary={false}
          label={cancelButtonText}
          onClick={this.props.skipClickFn} />
        <Button
          onTouchStartDisabled={true}
          className={styles.rightButton}
          disabled={disabled}
          label={i18n.t('embeddable_framework.common.button.send')}
          onClick={() => this.props.sendClickFn(this.state.selectedRating, this.textarea.value)} />
      </div>
    );
  }

  render() {
    const { rating, feedbackMessage } = this.props;

    return (
      <div>
        <label className={styles.feedbackMessage}>{feedbackMessage}</label>
        <ChatRatingGroup
          className={styles.chatRatingGroup}
          rating={this.state.selectedRating}
          updateRating={(rating) => this.setState({ selectedRating: rating })}
        />
        <label htmlFor='feedbackTextarea' className={styles.feedbackDescription}>
          {i18n.t('embeddable_framework.chat.postChat.rating.description')}
        </label>
        <textarea
          id='feedbackTextarea'
          ref={(el) => { this.textarea = el; }}
          className={styles.textarea}
          placeholder={i18n.t('embeddable_framework.chat.postChat.rating.placeholder.optional')}
          rows={6}
          defaultValue={rating.comment} />
        {this.renderActionButtons()}
      </div>
    );
  }
}
