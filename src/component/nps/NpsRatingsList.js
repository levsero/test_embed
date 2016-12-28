import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import classNames from 'classnames';

import { ButtonRating } from 'component/button/ButtonRating';

export class NpsRatingsList extends Component {
  static propTypes = {
    className: PropTypes.string,
    hideRatingsLegend: PropTypes.bool,
    highlightColor: PropTypes.string,
    isSubmittingComment: PropTypes.bool,
    isSubmittingRating: PropTypes.bool,
    likelyLabel: PropTypes.string.isRequired,
    notLikelyLabel: PropTypes.string.isRequired,
    onChangeValue: PropTypes.func,
    ratingsRange: PropTypes.array,
    selectedRating: PropTypes.number
  };

  static defaultProps = {
    className: '',
    hideRatingsLegend: false,
    highlightColor: '#77a500',
    isSubmittingComment: false,
    isSubmittingRating: false,
    onChangeValue: () => {},
    ratingsRange: _.range(11)
  };

  ratingClickHandlerFn = (rating) => {
    return (ev) => {
      ev.preventDefault();
      this.props.onChangeValue(rating);
    };
  }

  _prependWith = (prepend, str) => {
    return str.indexOf(prepend) > -1
      ? str
      : `${prepend}${str}`;
  }

  likelyLabel = () => {
    return this._prependWith('10 = ', this.props.likelyLabel);
  }

  notLikelyLabel = () => {
    return this._prependWith('0 = ', this.props.notLikelyLabel);
  }

  render = () => {
    const ratingsLegendClasses = 'RatingsList-legend u-sizeFull u-paddingHT';
    const ratingsListClasses = `RatingsList u-textCenter ${this.props.className}`;

    const labelClasses = classNames({
      'u-inlineBlock u-size1of2 u-marginBN': true
    });

    const likelyLabelClasses = classNames({
      [labelClasses]: true,
      'u-textRight': true
    });

    const notLikelyLabelClasses = classNames({
      [labelClasses]: true,
      'u-textLeft': true
    });

    const ratingListItemTemplate = (rating, i) => {
      const isSelected = this.props.selectedRating === rating;

      const props = {
        highlightColor: this.props.highlightColor,
        label: `${rating}`,
        loading: isSelected && this.props.isSubmittingRating,
        loadingSpinnerClassName: 'RatingsList-spinner',
        selected: isSelected,
        disabled: !isSelected && (this.props.isSubmittingRating || this.props.isSubmittingComment),
        onClick: !isSelected && !this.props.isSubmittingRating && this.ratingClickHandlerFn(rating)
      };

      return (
        <li key={i} className='RatingsList-item u-inlineBlock'>
          <ButtonRating {...props} />
        </li>
      );
    };

    const items = this.props.ratingsRange.map(ratingListItemTemplate);

    const ratingsLegendContent = (!this.props.hideRatingsLegend)
                               ? <div className={ratingsLegendClasses}>
                                   <p className={notLikelyLabelClasses}>
                                     {this.notLikelyLabel()}
                                   </p>
                                   <p className={likelyLabelClasses}>
                                     {this.likelyLabel()}
                                   </p>
                                 </div>
                               : null;

    return (
      <div>
        <ol className={ratingsListClasses}>
          {items}
        </ol>
        {ratingsLegendContent}
      </div>
    );
  }
}
