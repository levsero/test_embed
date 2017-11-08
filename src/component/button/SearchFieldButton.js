import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './SearchFieldButton.sass';

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
    const fieldClasses = styles.field;
    const searchTerm = (
      <span className={styles.searchTerm}>
        {this.props.searchTerm}
      </span>
    );
    const icon = (
      <IconFieldButton
        fullscreen={true}
        icon='Icon--search' />
    );

    return (
      <div className={styles.container}>
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
