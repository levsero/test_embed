import React from 'react/addons';
import _ from 'lodash';

import { ButtonRating } from 'component/Button';

const classSet = React.addons.classSet;

const prependWith = _.curry((prepend, str) => {
  /* jshint laxbreak: true */
  return str.indexOf(prepend) > -1
     ? str
     : `${prepend}${str}`;
});

export const NpsRatingsList = React.createClass({
  getDefaultProps() {
    return {
      className: ''
    };
  },

  addRatingToLikelyLabel: prependWith('10 = '),

  addRatingToNotLikelyLabel: prependWith('0 = '),

  ratingClickHandlerFn(rating) {
    return (ev) => {
      ev.preventDefault();
      this.props.onChangeValue(rating);
    };
  },

  render() {
    const ratingsLegendClasses = 'RatingsList-legend u-sizeFull u-paddingHT';
    const ratingsListClasses = `RatingsList u-textCenter ${this.props.className}`;

    const labelClasses = classSet({
      'u-inlineBlock u-size1of2': true,
      'u-marginBN': !this.props.isMobile
    });

    const likelyLabelClasses = classSet({
      [labelClasses]: true,
      'u-textRight': true,
      'u-marginBN': !this.props.isMobile
    });

    const notLikelyLabelClasses = classSet({
      [labelClasses]: true,
      'u-textLeft': true
    });

    const ratingListItemTemplate = (rating, i) => {
      const isSelected = this.props.selectedRating === rating;

      const props = {
        highlightColor: this.props.highlightColor,
        label: rating,
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

    /* jshint laxbreak: true */
    const ratingsLegendContent = (!this.props.hideRatingsLegend)
                               ? <div className={ratingsLegendClasses}>
                                   <p className={notLikelyLabelClasses}>
                                     {this.addRatingToNotLikelyLabel(this.props.notLikelyLabel)}
                                   </p>
                                   <p className={likelyLabelClasses}>
                                     {this.addRatingToLikelyLabel(this.props.likelyLabel)}
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
});
