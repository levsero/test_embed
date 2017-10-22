import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonIcon } from 'component/button/ButtonIcon';

import { locals as styles } from './ChatRatingGroup.sass';

export class ChatRatingGroup extends Component {
  static propTypes = {
    updateRating: PropTypes.func.isRequired,
    rating: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    rating: null,
    className: ''
  }

  ratingClickedHandler = (value) => {
    const rating = this.props.rating === value ? null : value;

    this.props.updateRating(rating);
  }

  render = () => {
    const { rating } = this.props;
    const thumbUpActiveStyle = rating === 'good' ? styles.ratingIconActive : '';
    const thumbDownActiveStyle = rating === 'bad' ? styles.ratingIconActive : '';

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
