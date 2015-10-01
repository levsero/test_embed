import React from 'react/addons';

import { ButtonRating } from 'component/Button';

const classSet = React.addons.classSet;

export const NpsRatingsList = React.createClass({
  getDefaultProps() {
    return {
      className: ''
    };
  },

  ratingClickHandlerFn(rating) {
    return (ev) => {
      ev.preventDefault();
      this.props.onChangeValue(rating);
    };
  },

  render() {
    const ratingsListClasses = classSet({
      'RatingsList u-textCenter': true,
      'u-paddingVL': !this.props.isMobile,
      [`${this.props.className}`]: true
    });
    const ratingsLegendClasses = classSet({
      'RatingsList-legend u-sizeFull u-paddingHT': true,
      'is-mobile': this.props.isMobile
    });

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
        label: rating,
        loading: isSelected && this.props.isSubmittingRating,
        selected: isSelected,
        highlightColor: this.props.highlightColor,
        onClick: this.ratingClickHandlerFn(rating),
        loadingSpinnerClassName: 'RatingsList-spinner'
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
                                     {this.props.notLikelyLabel}
                                   </p>
                                   <p className={likelyLabelClasses}>
                                     {this.props.likelyLabel}
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
