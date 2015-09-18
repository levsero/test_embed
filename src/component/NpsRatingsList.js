import React from 'react/addons';

import { RatingButton } from 'component/Button';
import { generateConstrastColor } from 'utility/utils';

export const NpsRatingsList = React.createClass({
  ratingListItemTemplate(rating) {
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
      <li className='RatingsList-item'>
        <RatingButton {...props} />
      </li>
    );
  },

  render: function() {
    const items = this.props.ratingsRange.map(this.ratingListItemTemplate);
    return (
      <div>
        <ol className='RatingsList u-textCenter'>
          {items}
        </ol>
        <div className='RatingsList-legend u-sizeFull u-paddingHT is-mobile'>
          <p className='RatingsList-legend-text RatingsList-legend-text--left'>
            {this.props.notLikelyLabel}
          </p>
          <p className='RatingsList-legend-text RatingsList-legend-text--left'>
            {this.props.likelyLabel}
          </p>
        </div>
      </div>
    );
  }

});
