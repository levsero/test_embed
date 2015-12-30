import React from 'react/addons';
import _ from 'lodash';

import { ButtonRating } from 'component/Button';

const classNames = require('classnames');

const prependWith = _.curry((prepend, str) => {
  return str.indexOf(prepend) > -1
     ? str
     : `${prepend}${str}`;
});

class NpsRatingsList extends React.Component {
  ratingClickHandlerFn(rating) {
    return (ev) => {
      ev.preventDefault();
      this.props.onChangeValue(rating);
    };
  }

  render() {
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

    const ratingsLegendContent = (!this.props.hideRatingsLegend)
                               ? <div className={ratingsLegendClasses}>
                                   <p className={notLikelyLabelClasses}>
                                     {this.prependWith('0 = ', this.props.notLikelyLabel)}
                                   </p>
                                   <p className={likelyLabelClasses}>
                                     {this.prependWith('10 = ', this.props.likelyLabel)}
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

NpsRatingsList.defaultProps = {
  className: ''
};

export { NpsRatingsList };