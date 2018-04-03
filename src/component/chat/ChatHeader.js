import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { i18n } from 'service/i18n';
import { Avatar } from 'component/Avatar';
import { ChatRatingGroup } from 'component/chat/ChatRatingGroup';

import { locals as styles } from './ChatHeader.scss';

export class ChatHeader extends Component {
  static propTypes = {
    avatar: PropTypes.string,
    title: PropTypes.string,
    byline: PropTypes.string,
    updateRating: PropTypes.func,
    rating: PropTypes.string,
    showRating: PropTypes.bool,
    onAgentDetailsClick: PropTypes.func
  };

  static defaultProps = {
    avatar: '',
    title: '',
    byline: '',
    updateRating: () => {},
    rating: null,
    showRating: false
  };

  renderRatingButtons = () => {
    return (
      <ChatRatingGroup
        updateRating={this.props.updateRating}
        rtl={i18n.rtl}
        rating={this.props.rating} />
    );
  }

  render = () => {
    const { avatar, title, byline, showRating, onAgentDetailsClick } = this.props;
    const avatarPath = avatar ? avatar : '';
    const titleText = title ? title : i18n.t('embeddable_framework.chat.header.default.title');
    const subText = byline ? byline : i18n.t('embeddable_framework.chat.header.subText');
    const ratingButtons = showRating ? this.renderRatingButtons() : null;
    const agentDetailsClasses = classNames(
      styles.agentDetails,
      { [styles.clickable]: !!onAgentDetailsClick }
    );

    return (
      <div className={styles.container}>
        <div className={agentDetailsClasses} onClick={onAgentDetailsClick}>
          <Avatar className={styles.avatar} src={avatarPath} fallbackIcon="Icon--avatar" />
          <div className={styles.textContainer}>
            <div className={styles.title}>{titleText}</div>
            <div>{subText}</div>
          </div>
        </div>
        {ratingButtons}
      </div>
    );
  }
}
