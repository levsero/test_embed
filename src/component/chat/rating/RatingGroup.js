import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { ButtonIcon } from 'component/button/ButtonIcon';

import { locals as styles } from './RatingGroup.scss';

export const ratings = {
  GOOD: 'good',
  BAD: 'bad',
  NOT_SET: null
};

export class RatingGroup extends Component {
  static propTypes = {
    updateRating: PropTypes.func.isRequired,
    rating: PropTypes.string,
    className: PropTypes.string
  }

  static defaultProps = {
    rating: ratings.NOT_SET,
    className: ''
  }

  ratingClickedHandler = (value) => {
    const rating = this.props.rating === value ? ratings.NOT_SET : value;

    this.props.updateRating(rating);
  }

  renderThumbsUpButton = () => {
    const { rating } = this.props;
    const thumbUpActiveStyle = rating === ratings.GOOD ? styles.ratingIconActive : '';

    return (
      <ButtonIcon
        key='good'
        containerStyles={`${styles.ratingIcon} ${thumbUpActiveStyle}`}
        iconClasses={styles.icon}
        icon='Icon--thumbUp'
        onClick={() => this.ratingClickedHandler(ratings.GOOD)} />
    );
  }

  renderThumbsDownButton = () => {
    const { rating } = this.props;
    const thumbDownActiveStyle = rating === ratings.BAD ? styles.ratingIconActive : '';
    const iconStyles = `${styles.ratingIcon} ${styles.thumbDownIcon}`;

    return (
      <ButtonIcon
        key='bad'
        containerStyles={`${iconStyles} ${thumbDownActiveStyle}`}
        iconClasses={styles.icon}
        icon='Icon--thumbDown'
        onClick={() => this.ratingClickedHandler(ratings.BAD)} />
    );
  }

  render = () => {
    return (
      <div className={this.props.className}>
        {this.renderThumbsUpButton()}
        {this.renderThumbsDownButton()}
      </div>
    );
  }
}
