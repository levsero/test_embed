import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

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
    rtl: PropTypes.bool,
    className: PropTypes.string
  }

  static defaultProps = {
    rating: ratings.NOT_SET,
    rtl: false,
    className: ''
  }

  ratingClickedHandler = (value) => {
    const rating = this.props.rating === value ? ratings.NOT_SET : value;

    this.props.updateRating(rating);
  }

  renderThumbsUpButton = () => {
    const { rating, rtl } = this.props;
    const thumbUpActiveStyle = rating === ratings.GOOD ? styles.ratingIconActive : '';
    const iconStyles = !rtl ? styles.leftRatingIcon : styles.ratingIcon;

    return (
      <ButtonIcon
        key='good'
        className={`${iconStyles} ${thumbUpActiveStyle}`}
        iconClasses={styles.icon}
        icon='Icon--thumbUp'
        onClick={() => this.ratingClickedHandler(ratings.GOOD)} />
    );
  }

  renderThumbsDownButton = () => {
    const { rating, rtl } = this.props;
    const thumbDownActiveStyle = rating === ratings.BAD ? styles.ratingIconActive : '';
    const iconStyles = !rtl ? styles.ratingIcon : styles.leftRatingIcon;

    return (
      <ButtonIcon
        key='bad'
        className={`${iconStyles} ${thumbDownActiveStyle}`}
        iconClasses={styles.icon}
        icon='Icon--thumbDown'
        onClick={() => this.ratingClickedHandler(ratings.BAD)} />
    );
  }

  render = () => {
    const buttons = [this.renderThumbsUpButton(), this.renderThumbsDownButton()];
    const renderButtons = !this.props.rtl ? buttons : _.reverse(buttons);

    return (
      <div className={`${styles.container} ${this.props.className}`}>
        {renderButtons}
      </div>
    );
  }
}
