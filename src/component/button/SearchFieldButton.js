import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { IconFieldButton } from 'component/button/IconFieldButton';

export class SearchFieldButton extends Component {
  render() {
    const fieldClasses = classNames({
      'Arrange Arrange--middle Form-field Form-field--search u-isSelectable is-mobile': true,
      'u-paddingRN u-paddingVN': true
    });
    const searchTerm = (
      <span className='Arrange-sizeFit u-textSizeBaseMobile u-hsizeAll u-textBody'>
        {this.props.searchTerm}
      </span>
    );
    const icon = (
      <IconFieldButton
        fullscreen={true}
        icon='Icon--search' />
    );

    return (
      <div className='u-cf u-paddingHN u-paddingBN Form-cta--barFullscreen'>
        <div
          className={fieldClasses}
          onClick={this.props.onClick}
          onTouch={this.props.onTouch}>
          {searchTerm}
          {icon}
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
