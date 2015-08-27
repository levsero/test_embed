import React from 'react/addons';

import { RatingButton } from 'component/Button';
import { generateConstrastColor } from 'utility/utils';

export var RatingsList = React.createClass({
  ratingListItemTemplate(rating) {
    const isSelected = this.props.selectedRating === rating;
    const props = {
      label: rating,
      loading: isSelected && this.props.isSubmittingRating,
      selected: isSelected,
      highlightColor: this.props.highlightColor,
      onClick: this.props.onClick(rating),
      generateHighlightColor: generateConstrastColor
    };

    return (
      <li>
        <RatingButton {...props} />
      </li>
    );
  },
  render: function() {

    const items = this.props.ratingsRange.map(this.ratingListItemTemplate);
    return (
      <div>
        <ol className='RatingsList is-mobile'>
          {items}
        </ol>
        <div className='RatingsLegend u-sizeFull u-paddingHT is-mobile'>
          <p className='RatingsLegend-text RatingsLegend-text--left'>
            {this.props.notLikelyLabel}
          </p>
          <p className='RatingsLegend-text RatingsLegend-text--right'>
            {this.props.likelyLabel}
          </p>
        </div>
      </div>
    );
  }

});
