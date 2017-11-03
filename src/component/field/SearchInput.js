import React, { Component } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { isIos } from 'utility/devices';
import { locals as styles } from './SearchInput.sass';

export class SearchInput extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    searchInputVal: PropTypes.string.isRequired
  };

  static defaultProps = {
    fullscreen: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {}
  };

  constructor() {
    super();
    this.input = null;
  }

  getInput = () => {
    return this.input;
  }

  render = () => {
    const { fullscreen, onChange, onFocus, onBlur, searchInputVal } = this.props;
    const screenStyle = fullscreen ? styles.fullscreen : '';
    const searchInputFieldClasses = `${styles.searchInput} ${screenStyle}`;
    const placeholder = i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help');
    const attribs = {
      autoCapitalize: 'off',
      placeholder: placeholder,
      type: 'search',
      autoComplete: 'off'
    };

    if (isIos()) {
      _.extend(attribs, {
        autoCorrect: 'off',
        spellCheck: 'false'
      });
    }

    return (
      <div className={styles.container}>
        <input
          className={searchInputFieldClasses}
          onChange={onChange}
          value={searchInputVal}
          onFocus={onFocus}
          onBlur={onBlur}
          ref={(elem) => { this.input = elem; }}
          {...attribs} />
      </div>
    );
  }
}
