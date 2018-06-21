import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { IconFieldButton } from 'component/button/IconFieldButton';
import { SearchInput } from 'component/field/SearchInput';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { Icon } from 'component/Icon';
import { locals as styles } from './SearchField.scss';

export class SearchField extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    hasSearched: PropTypes.bool,
    isLoading: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onChangeValue: PropTypes.func,
    onFocus: PropTypes.func,
    onSearchIconClick: PropTypes.func,
    hideZendeskLogo: PropTypes.bool
  };

  static defaultProps = {
    fullscreen: false,
    hasSearched: false,
    isLoading: false,
    onBlur: () => {},
    onChange: () => {},
    onChangeValue: () => {},
    onFocus: () => {},
    onSearchIconClick:  () => {},
    hideZendeskLogo: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      blurred: false,
      focused: false,
      searchInputVal: ''
    };
    this.searchField = null;
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
    return this.searchField.getInput();
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
        fullscreen={this.props.fullscreen}
        onChange={this.onChange}
        onBlur={this.onBlur}
        searchInputVal={this.state.searchInputVal}
        onFocus={this.onFocus}
        ref={(elem) => { this.searchField = elem; }}
      />
    );
  }

  renderSearchIcon = () => {
    const focusedStyle = this.state.focused ? styles.searchIconFocused : '';
    const searchInputFieldIconClasses = `${styles.searchIcon} ${focusedStyle}`;

    return (
      <Icon
        className={searchInputFieldIconClasses}
        onClick={this.props.onSearchIconClick}
        type='Icon--search' />
    );
  }

  renderSearchLoadingIcon = () => {
    const { isLoading } = this.props;
    const visibilityStyle = !isLoading ? styles.hidden : '';
    const loadingClasses = `${styles.searchLoadingIcon} ${visibilityStyle}`;
    const searchInputFieldIconClasses = isLoading ? styles.hidden : '';

    return (
      <div className={styles.searchLoadingIconContainer}>
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
    const loadingClasses = !isLoading ? styles.hidden : '';
    const visibilityStyle = !(fullscreen && !isLoading && this.state.searchInputVal) ? styles.hidden : '';
    const clearInputClasses = `${styles.clearInput} ${visibilityStyle}`;

    return (
      <div className={styles.clearInputContainer}>
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
      <div className={styles.mobileIconsContainer}>
        {this.renderSearchClear()}
        {this.renderSearchIconButton()}
      </div>
    );
  }

  render = () => {
    const { fullscreen, hasSearched, hideZendeskLogo } = this.props;
    const fullscreenStyle = fullscreen ? styles.fullscreen : '';
    const initialSearchStyle = (hideZendeskLogo) ? styles.notSearched : styles.notSearchedLogo;
    const searchedStyle = hasSearched ? styles.searched : initialSearchStyle;
    const searchContainerClasses = `
      ${styles.searchContainer}
      ${searchedStyle}
      ${fullscreenStyle}
    `;
    const inputFullscreenStyle = fullscreen ? styles.searchInputFullscreen : '';
    const focusedStyle = this.state.focused ? styles.focused : '';
    const searchInputClasses = `
      ${styles.searchInput}
      ${focusedStyle}
      ${inputFullscreenStyle}
    `;

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
