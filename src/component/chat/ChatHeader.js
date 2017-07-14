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
    endChat: () => {},
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
    const { agents } = this.props;
    const firstAgent = agents[_.keys(agents)[0]];
    const avatar = firstAgent && firstAgent.avatar_path ? firstAgent.avatar_path : '';
    const title = firstAgent && firstAgent.display_name
                ? firstAgent.display_name
                : i18n.t('embeddable_framework.chat.header.title');
    const subText = firstAgent && firstAgent.title
                  ? firstAgent.title
                  : i18n.t('embeddable_framework.chat.header.subText');

    return (
      <div className={styles.container}>
        <Avatar className={styles.avatar} src={avatar} />
        <div className={styles.textContainer}>
          <div className={styles.title}>{title}</div>
          <div>{subText}</div>
        </div>
        {this.renderRatingButton()}
      </div>
    );
  }
}
