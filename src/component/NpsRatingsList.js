import React from 'react/addons';
import _ from 'lodash';

import { ButtonRating } from 'component/Button';
import { generateConstrastColor } from 'utility/utils';

const classSet = React.addons.classSet;

export const NpsRatingsList = React.createClass({

  render: function() {

    const labelClasses = {
      'RatingsList-legend-text u-inlineBlock': true
    };

    const likelyLabelClasses = classSet(_.extend({}, labelClasses, {
      'u-textRight': true
    }));

    const notLikelyLabelClasses = classSet(_.extend({}, labelClasses, {
      'u-textLeft': true
    }));

    const ratingListItemTemplate = (rating, i) => {

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

      return (
        <li key={i} className='RatingsList-item u-inlineBlock'>
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
          <p className={notLikelyLabelClasses}>
            {this.props.notLikelyLabel}
          </p>
          <p className={likelyLabelClasses}>
            {this.props.likelyLabel}
          </p>
        </div>
      </div>
    );
  }
});
