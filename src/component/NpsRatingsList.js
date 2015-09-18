import React from 'react/addons';

import { ButtonRating } from 'component/Button';
import { generateConstrastColor } from 'utility/utils';

export const NpsRatingsList = React.createClass({

  render: function() {
    const ratingListItemTemplate = (rating) => {

      const isSelected = this.props.selectedRating === rating && this.props.highlightButton;

      const props = {
        label: rating,
        loading: isSelected && this.props.isSubmittingRating,
        selected: isSelected,
        highlightColor: this.props.highlightColor,
        onClick: this.props.onClick(rating),
        generateHighlightColor: generateConstrastColor,
        loadingSpinnerClassName: 'RatingsList-spinner'
      };

      /* jshint ignore:start */
      // jslint really doesn't like ... syntax
      const classSet = React.addons.classSet;

      const labelClasses = classSet({
        'RatingsList-legend-text u-inlineBlock': true
      });

      const likelyLabelClasses = classSet({
        ...labelClasses,
        'u-textLeft': true
      });

      const notLikelyLabelClasses = classSet({
        ...labelClasses,
        'u-textRight': true
      });
      /* jshint ignore:end */

      return (
        <li className='RatingsList-item u-inlineBlock'>
          <ButtonRating {...props} />
        </li>
      );
    };

    const items = this.props.ratingsRange.map(ratingListItemTemplate);

    return (
      <div>
        <ol className='RatingsList u-textCenter'>
          {items}
        </ol>
        <div className='RatingsList-legend u-sizeFull u-paddingHT is-mobile'>
          <p className='RatingsList-legend-text u-inlineBlock u-textLeft'>
            {this.props.notLikelyLabel}
          </p>
          <p className='RatingsList-legend-text u-inlineBlock u-textRight'>
            {this.props.likelyLabel}
          </p>
        </div>
      </div>
    );
  }
});
