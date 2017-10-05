import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { IconFieldButton } from 'component/button/IconFieldButton';

export class SearchFieldButton extends Component {
  static propTypes = {
    onClick: PropTypes.func,
    searchTerm: PropTypes.string
  };

  static defaultProps = {
    onClick: () => {},
    onTouch: () => {},
    searchTerm: ''
  };

  render = () => {
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
          onClick={this.props.onClick}>
          {searchTerm}
          {icon}
        </div>
      </div>
    );
  }
}
