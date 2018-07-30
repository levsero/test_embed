import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { i18n } from 'service/i18n';
import { IconFieldButton } from 'component/button/IconFieldButton';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { Icon } from 'component/Icon';
import { locals as styles } from './SearchField.scss';
import { FauxInput, MediaFigure, Input } from '@zendeskgarden/react-textfields';
import classNames from 'classnames';

export class SearchField extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    hasSearched: PropTypes.bool,
    isLoading: PropTypes.bool,
    onBlur: PropTypes.func,
    onChange: PropTypes.func,
    onChangeValue: PropTypes.func,
    onFocus: PropTypes.func,
    onClick: PropTypes.func,
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
    onClick: () => {},
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
    return this.searchField;
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

  renderMobileSearchIconButton = () => {
    return (
      <MediaFigure key="search" className={styles.mobileSearchIcon}>
        <IconFieldButton
          onClick={this.props.onSearchIconClick}
          fullscreen={this.props.fullscreen}
          icon='Icon--search' />
      </MediaFigure>
    );
  }

  renderMobileLoadingOrClearIcon = () => {
    let icon = null;

    if (this.props.isLoading) {
      icon = <LoadingEllipses />;
    } else if (this.state.searchInputVal) {
      icon = (
        <Icon
          onClick={this.clearInput}
          onTouch={this.clearInput}
          className={styles.mobileClearInput}
          type='Icon--clearInput' />
      );
    }

    return (
      <MediaFigure key="loadingOrClear" className={styles.mobileNonSearchIconContainer}>
        {icon}
      </MediaFigure>
    );
  }

  renderDesktopSearchOrLoadingIcon = () => {
    const icon = this.props.isLoading
      ? <LoadingEllipses />
      : <IconFieldButton
        onClick={this.props.onSearchIconClick}
        focused={this.state.focused}
        icon='Icon--search'
      />;

    return (
      <MediaFigure
        key="searchOrLoading"
        className={styles.desktopSearchOrLoading}>
        {icon}
      </MediaFigure>
    );
  }

  renderIcons = () => {
    let icons = [];

    if (this.props.fullscreen) {
      icons.push(this.renderMobileLoadingOrClearIcon());
      icons.push(this.renderMobileSearchIconButton());
    } else {
      icons.push(this.renderDesktopSearchOrLoadingIcon());
    }

    return icons;
  }

  render = () => {
    const { fullscreen } = this.props;
    const searchContainerClasses = classNames({
      [styles.mobileContainer]: fullscreen,
      [styles.desktopContainer]: !fullscreen
    });
    const searchInputClasses = classNames({
      [styles.mobileSearchInput]: fullscreen
    });

    return (
      <FauxInput mediaLayout={true} className={searchContainerClasses} onClick={this.props.onClick}>
        <Input
          bare={true}
          onChange={this.onChange}
          value={this.state.searchInputVal}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          innerRef={(elem) => { this.searchField = elem; }}
          autoCapitalize='off'
          placeholder={i18n.t('embeddable_framework.helpCenter.search.label.how_can_we_help')}
          type='search'
          className={searchInputClasses}
        />
        {this.renderIcons()}
      </FauxInput>
    );
  }
}
