import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { isIos } from 'utility/devices';

export class SearchInput extends Component {
  render() {
    const { fullscreen, onChange, onFocus, onBlur, searchInputVal } = this.props;
    const searchInputFieldClasses = classNames({
      'Arrange-sizeFill u-paddingR Form-placeholder': true,
      'u-textSizeBaseMobile': fullscreen
    });
    const placeholder = (fullscreen)
                      ? ''
                      : i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help');

    let attribs = {
      autoCapitalize: 'off',
      placeholder: placeholder,
      type: 'search'
    };

    if (isIos()) {
      attribs = _.extend(attribs, {
        autoCorrect: 'off',
        autoComplete: 'off',
        spellCheck: 'false'
      });
    }

    return (
      <div className='Arrange-sizeFill u-vsizeAll u-posRelative'>
        <input
          className={searchInputFieldClasses}
          onChange={onChange}
          value={searchInputVal}
          onFocus={onFocus}
          onBlur={onBlur}
          ref='input'
          {...attribs} />
      </div>
    );
  }
}

SearchInput.propTypes = {
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  fullscreen: PropTypes.bool,
  searchInputVal: PropTypes.string.isRequired
};

SearchInput.defaultProps = {
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  fullscreen: false
};
