import React, { Component, PropTypes } from 'react';

import { Icon } from 'component/Icon';

export class SearchFieldButton extends Component {
  render() {
    return (
      <div className='u-cf u-paddingHN u-paddingBN Form-cta--barFullscreen'>
        <div
          className='Arrange Arrange--middle Form-field Form-field--search u-isSelectable is-mobile'
          onClick={this.props.onClick}
          onTouch={this.props.onTouch}>
          <Icon
            className='Arrange-sizeFit u-isActionable'
            type='Icon--search' />
          <span className='Arrange-sizeFit u-textSizeBaseMobile u-hsizeAll u-textBody'>{this.props.searchTerm}</span>
        </div>
      </div>
    );
  }
}

SearchFieldButton.propTypes = {
  onClick: PropTypes.func,
  onTouch: PropTypes.func,
  searchTerm: React.PropTypes.string
};

SearchFieldButton.defaultProps = {
  onClick: () => {},
  onTouch: () => {},
  searchTerm: ''
};
