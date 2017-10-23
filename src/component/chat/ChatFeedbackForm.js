import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { i18n } from 'service/i18n';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ChatHeader } from 'component/chat/ChatHeader';
import { ChatRatingGroup, ChatRatings } from 'component/chat/ChatRatingGroup';
import { Button } from 'component/button/Button';

import { locals as styles } from './ChatFeedbackForm.sass';

export class ChatFeedbackForm extends Component {
  static propTypes = {
    getFrameDimensions: PropTypes.func.isRequired,
    updateRating: PropTypes.func.isRequired,
    skipClickFn: PropTypes.func.isRequired,
    sendClickFn: PropTypes.func.isRequired,
    newDesign: PropTypes.bool,
    avatar: PropTypes.string,
    title: PropTypes.string,
    byline: PropTypes.string,
    feedbackMessage: PropTypes.string,
    rating: PropTypes.string
  }

  static defaultProps = {
    newDesign: false,
    avatar: '',
    title: '',
    byline: '',
    feedbackMessage: '',
    rating: null
  }

  constructor(props) {
    super(props);

    this.textarea = null;
  }

  renderChatHeader = () => {
    return (
      <ChatHeader
        avatar={this.props.avatar}
        title={this.props.title}
        byline={this.props.byline}
      />
    );
  }

  renderActionButtons = () => {
    const { rating } = this.props;
    const shouldDisable = rating === ChatRatings.NOT_SET;

    return (
      <div className={styles.buttonGroup}>
        <Button
          className={styles.button}
          primary={false}
          label={i18n.t('embeddable_framework.chat.postChat.rating.button.skip')}
          onClick={this.props.skipClickFn} />
        <Button
          className={styles.rightButton}
          disabled={shouldDisable}
          label={i18n.t('embeddable_framework.common.button.send')}
          onClick={() => this.props.sendClickFn(this.textarea.value)} />
      </div>
    );
  }

  render() {
    const { rating, updateRating, newDesign, feedbackMessage } = this.props;

    return (
      <ScrollContainer
        getFrameDimensions={this.props.getFrameDimensions}
        headerContent={this.renderChatHeader()}
        newDesign={newDesign}
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}>
        <label className={styles.feedbackMessage}>{feedbackMessage}</label>
        <ChatRatingGroup className={styles.chatRatingGroup} rating={rating} updateRating={updateRating} />
        <label className={styles.feedbackDescription}>
          {i18n.t('embeddable_framework.chat.postChat.rating.description')}
        </label>
        <textarea
          ref={(el) => { this.textarea = el; }}
          className={styles.textarea}
          placeholder={i18n.t('embeddable_framework.chat.postChat.rating.placeholder.optional')}
          rows={6} />
        {this.renderActionButtons()}
      </ScrollContainer>
    );
  }
}
