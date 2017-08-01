import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { i18n } from 'service/i18n';
import { locals as styles } from './ChatHeader.sass';

import { Avatar } from 'component/Avatar';
import { ButtonIcon } from 'component/button/ButtonIcon';

export class ChatHeader extends Component {
  static propTypes = {
    agents: PropTypes.object,
    endChat: PropTypes.func,
    updateRating: PropTypes.func.isRequired,
    rating: PropTypes.string
  };

  static defaultProps = {
    agents: {},
    rating: null
  };

  ratingClickedHandler = (value) => {
    const rating = this.props.rating === value ? null : value;

    this.props.updateRating(rating);
  }

  renderRatingButton = () => {
    const { rating } = this.props;
    const thumbUpActiveStyle = rating === 'good' ? styles.ratingIconActive : '';
    const thumbDownActiveStyle = rating === 'bad' ? styles.ratingIconActive : '';

    return (
      <div className={styles.ratingContainer}>
        <ButtonIcon
          className={`${styles.ratingIcon} ${thumbUpActiveStyle}`}
          icon='Icon--thumbUp'
          onClick={() => this.ratingClickedHandler('good')} />
        <ButtonIcon
          className={`${styles.thumbDownIcon} ${thumbDownActiveStyle}`}
          icon='Icon--thumbDown'
          onClick={() => this.ratingClickedHandler('bad')} />
      </div>
    );
  }

  render = () => {
    const { avatar, title, byline } = this.props;
    const avatarPath = avatar ? avatar : '';
    const titleText = title ? title : i18n.t('embeddable_framework.chat.header.title');
    const subText = byline ? byline : i18n.t('embeddable_framework.chat.header.subText');

    return (
      <div className={styles.container}>
        <Avatar className={styles.avatar} src={avatarPath} />
        <div className={styles.textContainer}>
          <div className={styles.title}>{titleText}</div>
          <div>{subText}</div>
        </div>
        {this.renderRatingButton()}
      </div>
    );
  }
}
