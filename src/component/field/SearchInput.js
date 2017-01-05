import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import _ from 'lodash';

import { i18n } from 'service/i18n';
import { isIos } from 'utility/devices';

export class SearchInput extends Component {
  static propTypes = {
    disableAutoComplete: PropTypes.bool,
    fullscreen: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onFocus: PropTypes.func,
    searchInputVal: PropTypes.string.isRequired
  };

  static defaultProps = {
    disableAutoComplete: false,
    fullscreen: false,
    onBlur: () => {},
    onChange: () => {},
    onFocus: () => {}
  };

  getInput = () => {
    return ReactDOM.findDOMNode(this.refs.input);
  }

  render = () => {
    const { fullscreen, onChange, onFocus, onBlur, searchInputVal } = this.props;
    const searchInputFieldClasses = classNames({
      'Arrange-sizeFill u-paddingR Form-placeholder': true,
      'u-textSizeBaseMobile': fullscreen
    });
    const placeholder = (fullscreen)
                      ? ''
                      : i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help');
    const attribs = {
      autoCapitalize: 'off',
      placeholder: placeholder,
      type: 'search'
    };

    if (isIos()) {
      _.extend(attribs, {
        autoCorrect: 'off',
        autoComplete: 'off',
        spellCheck: 'false'
      });
    }

    if (this.props.disableAutoComplete) {
      _.extend(attribs, {
        autoComplete: 'off'
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
