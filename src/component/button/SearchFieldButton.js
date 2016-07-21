import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { Icon } from 'component/Icon';
import { IconFieldButton } from 'component/button/IconFieldButton';

export class SearchFieldButton extends Component {
  render() {
    const { disableAutoSearch } = this.props;
    const fieldClasses = classNames({
      'Arrange Arrange--middle Form-field Form-field--search u-isSelectable is-mobile': true,
      'u-paddingRN u-paddingVN': disableAutoSearch
    });
    const searchTerm = (
      <span className='Arrange-sizeFit u-textSizeBaseMobile u-hsizeAll u-textBody'>
        {this.props.searchTerm}
      </span>
    );
    const icon = disableAutoSearch ? <IconFieldButton
                                        fullscreen={true}
                                        icon='Icon--search' />
                                   : <Icon
                                        className='Arrange-sizeFit u-isActionable'
                                        type='Icon--search' />;

    let searchBar;

    if (disableAutoSearch) {
      searchBar = [ searchTerm, icon ];
    } else {
      searchBar = [ icon, searchTerm ];
    }

    return (
      <div className='u-cf u-paddingHN u-paddingBN Form-cta--barFullscreen'>
        <div
          className={fieldClasses}
          onClick={this.props.onClick}
          onTouch={this.props.onTouch}>
          {searchBar}
        </div>
      </div>
    );
  }
}

SearchFieldButton.propTypes = {
  onClick: PropTypes.func,
  onTouch: PropTypes.func,
  searchTerm: React.PropTypes.string,
  disableAutoSearch: React.PropTypes.bool
};

SearchFieldButton.defaultProps = {
  onClick: () => {},
  onTouch: () => {},
  searchTerm: '',
  disableAutoSearch: false
};
