import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { locals as styles } from './SearchFieldButton.scss';

import { i18n } from 'service/i18n';
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
    const { searchTerm, onClick } = this.props;
    const displayStyles = searchTerm ? '' : styles.placeholder;
    const fieldValue = searchTerm || i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help');
    const searchField = (
      <span className={`${styles.searchTerm} ${displayStyles}`}>
        {fieldValue}
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
          onClick={onClick}>
          {searchField}
          {icon}
        </div>
      </div>
    );
  }
}
