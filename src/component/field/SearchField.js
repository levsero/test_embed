import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

import { IconFieldButton } from 'component/button/IconFieldButton';
import { SearchInput } from 'component/field/SearchInput';
import { LoadingEllipses } from 'component/Loading';
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

    this.props.onFocus(e);
  }

  onBlur(e) {
    this.setState({
      focused: false,
      blurred: true
    });

    this.props.onBlur(e);
  }

  onChange(e) {
    const value = e.target.value;

    this.setState({
      searchInputVal: value
    });

    this.props.onChange(e);
    this.props.onChangeValue(value);
  }

  clearInput() {
    this.setState({
      searchInputVal: ''
    });

    this.props.onChangeValue('');
  }

  getSearchField() {
    return ReactDOM.findDOMNode(this.refs.searchFieldInput.refs.input);
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

  renderSearchIconButton() {
    return (
      <IconFieldButton
        onClick={this.props.onSearchIconClick}
        fullscreen={this.props.fullscreen}
        icon='Icon--search' />
    );
  }

  renderSearchInput() {
    const { fullscreen } = this.props;

    return (
      <SearchInput
        fullscreen={fullscreen}
        onChange={this.onChange}
        onBlur={this.onBlur}
        searchInputValue={this.state.searchInputVal}
        onFocus={this.onFocus}
        ref='searchFieldInput' />
    );
  }

  renderSearchIcon() {
    const searchInputFieldIconClasses = classNames({
      'Arrange-sizeFit u-isActionable': true,
      'u-userTextColor u-userFillColor': this.state.focused,
      'u-paddingHN': this.props.disableAutoSearch
    });

    return (
      <Icon
        className={searchInputFieldIconClasses}
        onClick={this.props.onSearchIconClick}
        type='Icon--search' />
    );
  }

  renderSearchLoadingIcon() {
    const { isLoading } = this.props;
    const loadingClasses = classNames({
      'u-paddingRS': true,
      'u-isHidden': !isLoading
    });
    const searchInputFieldIconClasses = classNames({
      'u-isHidden': isLoading
    });

    return (
      <div className='Arrange-sizeFit u-isActionable'>
        <LoadingEllipses className={loadingClasses} />
        <IconFieldButton
          className={searchInputFieldIconClasses}
          onClick={this.props.onSearchIconClick}
          icon='Icon--search' />
      </div>
    );
  }

  renderSearchClear() {
    const { fullscreen, isLoading } = this.props;
    const loadingClasses = classNames({
      'u-isHidden': !isLoading
    });
    const clearInputClasses = classNames({
      'Icon Icon--clearInput': true,
      'u-isActionable u-textCenter': true,
      'u-isHidden': !(fullscreen && !isLoading && this.state.searchInputVal)
    });

    return (
      <div className='Arrange-sizeFit u-isActionable'>
        <LoadingEllipses className={loadingClasses} />
        <Icon
          onClick={this.clearInput}
          onTouch={this.clearInput}
          className={clearInputClasses}
          type='Icon--clearInput' />
      </div>
    );
  }

  render() {
    const { fullscreen, hasSearched, disableAutoSearch } = this.props;
    const searchContainerClasses = classNames({
      'u-cf': true,
      'u-paddingTM': hasSearched,
      'u-marginBL': !hasSearched,
      'u-paddingHN u-paddingBN Form-cta--barFullscreen': fullscreen
    });
    const searchInputClasses = classNames({
      'Arrange Arrange--middle Form-field Form-field--search u-isSelectable': true,
      'Form-field--focused': this.state.focused,
      'is-mobile': fullscreen,
      'u-paddingVN u-paddingRN': disableAutoSearch
    });

    let searchElement;

    if (fullscreen && disableAutoSearch) {
      searchElement = [
        this.renderSearchInput(), this.renderSearchClear(), this.renderSearchIconButton()
      ];
    } else if (disableAutoSearch) {
      searchElement = [
        this.renderSearchInput(), this.renderSearchLoadingIcon()
      ];
    } else {
      searchElement = [
        this.renderSearchIcon(), this.renderSearchInput(), this.renderSearchClear()
      ];
    }

    return (
      <div className={searchContainerClasses}>
        <label className={searchInputClasses}>
          {searchElement}
        </label>
      </div>
    );
  }
}

SearchField.propTypes = {
  fullscreen: PropTypes.bool,
  isLoading: PropTypes.bool,
  hasSearched: PropTypes.bool,
  disableAutoSearch: PropTypes.bool,
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
  disableAutoSearch: false,
  onFocus: () => {},
  onBlur: () => {},
  onChange: () => {},
  onSearchIconClick:  () => {},
  onChangeValue: () => {}
};

