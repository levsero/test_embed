import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import _ from 'lodash';
import classNames from 'classnames';

import { LoadingEllipses } from 'component/Loading';
import { isMobileBrowser,
         isIos } from 'utility/devices';
import { i18n } from 'service/i18n';
import { Icon } from 'component/Icon';
import { bindMethods } from 'utility/utils';

export class SearchField extends Component {
  constructor(props, context) {
    super(props, context);
    bindMethods(this, SearchField.prototype);

    this.state = {
      focused: false,
      blurred: false,
      searchInputVal: ''
    };
  }

  onFocus(e) {
    this.setState({
      focused: true
    });

    if (this.props.onFocus) {
      this.props.onFocus(e);
    }
  }

  onBlur(e) {
    this.setState({
      focused: false,
      blurred: true
    });

    if (this.props.onBlur) {
      this.props.onBlur(e);
    }
  }

  onChange(e) {
    const value = e.target.value;

    this.setState({
      searchInputVal: value
    });

    if (this.props.onChange) {
      this.props.onChange(e);
    }

    if (this.props.onChangeValue) {
      this.props.onChangeValue(value);
    }
  }

  clearInput() {
    this.setState({
      searchInputVal: ''
    });

    if (this.props.onChangeValue) {
      this.props.onChangeValue('');
    }
  }

  getSearchField() {
    return ReactDOM.findDOMNode(this.refs.searchFieldInput);
  }

  getValue() {
    return this.state.searchInputVal;
  }

  focus() {
    this.getSearchField().focus();
  }

  blur() {
    this.getSearchField().blur();
  }

  render() {
    const loadingClasses = classNames({
      'u-isHidden': !this.props.isLoading
    });
    const searchContainerClasses = classNames({
      'u-cf': true,
      'u-paddingTM': this.props.hasSearched,
      'u-marginBL': !this.props.hasSearched,
      'u-paddingHN u-paddingBN Form-cta--barFullscreen': this.props.fullscreen
    });
    const searchInputClasses = classNames({
      'Arrange Arrange--middle Form-field Form-field--search u-isSelectable': true,
      'Form-field--focused': this.state.focused,
      'is-mobile': this.props.fullscreen
    });
    const searchInputFieldClasses = classNames({
      'Arrange-sizeFill u-paddingR Form-placeholder': true,
      'u-textSizeBaseMobile': this.props.fullscreen
    });
    const searchInputFieldIconClasses = classNames({
      'Arrange-sizeFit u-isActionable': true,
      'u-userTextColor': this.state.focused,
      'u-userFillColor': this.state.focused
    });
    const clearInputClasses = classNames({
      'Icon Icon--clearInput': true,
      'u-isActionable u-textCenter': true,
      'u-isHidden': !(isMobileBrowser() && !this.props.isLoading && this.state.searchInputVal)
    });
    const placeholder = (isMobileBrowser())
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
      <div className={searchContainerClasses}>
        <label className={searchInputClasses}>
          <Icon
            className={searchInputFieldIconClasses}
            onClick={this.props.onSearchIconClick}
            type='Icon--search' />
          <div className='Arrange-sizeFill u-vsizeAll u-posRelative'>
            <input
              className={searchInputFieldClasses}
              ref='searchFieldInput'
              onChange={this.onChange}
              value={this.state.searchInputVal}
              onFocus={this.onFocus}
              onBlur={this.onBlur}
              {...attribs} />
          </div>
          <div className='Arrange-sizeFit u-isActionable'>
            <LoadingEllipses className={loadingClasses} />
            <Icon
              onClick={this.clearInput}
              onTouch={this.clearInput}
              className={clearInputClasses}
              type='Icon--clearInput' />
          </div>
        </label>
      </div>
    );
  }
}

SearchField.propTypes = {
  fullscreen: PropTypes.bool,
  isLoading: PropTypes.bool,
  hasSearched: PropTypes.bool,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  onSearchIconClick: PropTypes.func,
  onChangeValue: PropTypes.func
};

SearchField.defaultProps = {
  fullscreen: false,
  isLoading: false,
  hasSearched: false,
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  onSearchIconClick:  () => {},
  onChangeValue: () => {}
};

