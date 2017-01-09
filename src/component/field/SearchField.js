import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

import { IconFieldButton } from 'component/button/IconFieldButton';
import { SearchInput } from 'component/field/SearchInput';
import { LoadingEllipses } from 'component/loading/Loading';
import { Icon } from 'component/Icon';

export class SearchField extends Component {
  static propTypes = {
    disableAutoComplete: PropTypes.bool,
    fullscreen: PropTypes.bool,
    hasSearched: PropTypes.bool,
    isLoading: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onChangeValue: PropTypes.func,
    onFocus: PropTypes.func,
    onSearchIconClick: PropTypes.func
  };

  static defaultProps = {
    disableAutoComplete: false,
    fullscreen: false,
    hasSearched: false,
    isLoading: false,
    onBlur: () => {},
    onChange: () => {},
    onChangeValue: () => {},
    onFocus: () => {},
    onSearchIconClick:  () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      blurred: false,
      focused: false,
      searchInputVal: ''
    };
  }

  onFocus = (e) => {
    this.setState({ focused: true });
    this.props.onFocus(e);
  }

  onBlur = (e) => {
    this.setState({
      focused: false,
      blurred: true
    });

    this.props.onBlur(e);
  }

  onChange = (e) => {
    const value = e.target.value;

    this.setState({ searchInputVal: value });

    this.props.onChange(e);
    this.props.onChangeValue(value);
  }

  clearInput = () => {
    this.setState({ searchInputVal: '' });
    this.props.onChangeValue('');
  }

  getSearchField = () => {
    return this.refs.searchFieldInput.getInput();
  }

  getValue = () => {
    return this.state.searchInputVal;
  }

  setValue = (value) => {
    this.setState({ searchInputVal: value });
    this.props.onChangeValue(value);
  }

  focus = () => {
    this.getSearchField().focus();
  }

  blur = () => {
    this.getSearchField().blur();
  }

  renderSearchIconButton = () => {
    return (
      <IconFieldButton
        onClick={this.props.onSearchIconClick}
        fullscreen={this.props.fullscreen}
        icon='Icon--search' />
    );
  }

  renderSearchInput = () => {
    return (
      <SearchInput
        disableAutoComplete={this.props.disableAutoComplete}
        fullscreen={this.props.fullscreen}
        onChange={this.onChange}
        onBlur={this.onBlur}
        searchInputVal={this.state.searchInputVal}
        onFocus={this.onFocus}
        ref='searchFieldInput' />
    );
  }

  renderSearchIcon = () => {
    const searchInputFieldIconClasses = classNames({
      'Arrange-sizeFit u-isActionable u-paddingHN': true,
      'u-userTextColor u-userFillColor': this.state.focused
    });

    return (
      <Icon
        className={searchInputFieldIconClasses}
        onClick={this.props.onSearchIconClick}
        type='Icon--search' />
    );
  }

  renderSearchLoadingIcon = () => {
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
          focused={this.state.focused}
          icon='Icon--search' />
      </div>
    );
  }

  renderSearchClear = () => {
    const { fullscreen, isLoading } = this.props;
    const loadingClasses = classNames({
      'u-isHidden': !isLoading
    });
    const clearInputClasses = classNames({
      'Icon Icon--clearInput': true,
      'u-isActionable u-textCenter u-marginRS': true,
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

  renderMobileIcons = () => {
    return (
      <div className="u-displayInherit">
        {this.renderSearchClear()}
        {this.renderSearchIconButton()}
      </div>
    );
  }

  render = () => {
    const { fullscreen, hasSearched } = this.props;
    const searchContainerClasses = classNames({
      'u-cf': true,
      'u-paddingTM': hasSearched,
      'u-marginBL': !hasSearched,
      'u-paddingHN u-paddingBN Form-cta--barFullscreen': fullscreen
    });
    const searchInputClasses = classNames({
      'Arrange Arrange--middle Form-field Form-field--search u-isSelectable': true,
      'u-paddingVN u-paddingRN': true,
      'Form-field--focused': this.state.focused,
      'is-mobile': fullscreen
    });

    const searchIcons = fullscreen
                      ? this.renderMobileIcons()
                      : this.renderSearchLoadingIcon();

    return (
      <div className={searchContainerClasses}>
        <label className={searchInputClasses}>
          {this.renderSearchInput()}
          {searchIcons}
        </label>
      </div>
    );
  }
}
