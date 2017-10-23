import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonIcon } from 'component/button/ButtonIcon';

import { locals as styles } from './ChatRatingGroup.sass';

export const ChatRatings = {
  GOOD: 'good',
  BAD: 'bad',
  NOT_SET: null
};

export class ChatRatingGroup extends Component {
  static propTypes = {
    updateRating: PropTypes.func.isRequired,
    rating: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    rating: ChatRatings.NOT_SET,
    className: ''
  }

  ratingClickedHandler = (value) => {
    const rating = this.props.rating === value ? ChatRatings.NOT_SET : value;

    this.props.updateRating(rating);
  }

  render = () => {
    const { rating } = this.props;
    const thumbUpActiveStyle = rating === ChatRatings.GOOD ? styles.ratingIconActive : '';
    const thumbDownActiveStyle = rating === ChatRatings.BAD ? styles.ratingIconActive : '';

    debugger;

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        <ButtonIcon
          className={`${styles.leftRatingIcon} ${thumbUpActiveStyle}`}
          icon='Icon--thumbUp'
          onClick={() => this.ratingClickedHandler('good')} />
        <ButtonIcon
          className={`${styles.ratingIcon} ${thumbDownActiveStyle}`}
          icon='Icon--thumbDown'
          onClick={() => this.ratingClickedHandler('bad')} />
      </div>
    );
  }
}
