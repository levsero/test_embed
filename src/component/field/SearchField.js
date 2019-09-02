import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { IconFieldButton } from 'component/button/IconFieldButton'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'
import { Icon } from 'component/Icon'
import { locals as styles } from './SearchField.scss'
import { FauxInput, MediaFigure, Input, Label } from '@zendeskgarden/react-textfields'
import classNames from 'classnames'

export class SearchField extends Component {
  static propTypes = {
    fullscreen: PropTypes.bool,
    isLoading: PropTypes.bool,
    onChangeValue: PropTypes.func,
    onClick: PropTypes.func,
    onSearchIconClick: PropTypes.func,
    searchPlaceholder: PropTypes.string.isRequired,
    value: PropTypes.string
  }

  static defaultProps = {
    fullscreen: false,
    isLoading: false,
    onChangeValue: () => {},
    onSearchIconClick: () => {},
    onClick: () => {},
    value: ''
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      focused: false
    }
    this.searchField = null
  }

  onFocus = () => {
    this.setState({ focused: true })
  }

  onBlur = () => {
    this.setState({ focused: false })
  }

  onChange = e => {
    const value = e.target.value

    this.props.onChangeValue(value)
  }

  clearInput = () => {
    this.props.onChangeValue('')
  }

  focus = () => {
    this.searchField.focus()
  }

  renderMobileSearchIconButton = () => {
    return (
      <MediaFigure key="search" className={styles.mobileSearchIcon}>
        <IconFieldButton
          onClick={this.props.onSearchIconClick}
          fullscreen={this.props.fullscreen}
          icon="Icon--search"
        />
      </MediaFigure>
    )
  }

  renderMobileLoadingOrClearIcon = () => {
    let icon = null

    if (this.props.isLoading) {
      icon = <LoadingEllipses />
    } else if (this.props.value) {
      icon = (
        <Icon
          onClick={this.clearInput}
          onTouch={this.clearInput}
          className={styles.mobileClearInput}
          type="Icon--clearInput"
        />
      )
    }

    return (
      <MediaFigure key="loadingOrClear" className={styles.mobileNonSearchIconContainer}>
        {icon}
      </MediaFigure>
    )
  }

  renderDesktopSearchOrLoadingIcon = () => {
    const icon = this.props.isLoading ? (
      <LoadingEllipses />
    ) : (
      <IconFieldButton
        onClick={this.props.onSearchIconClick}
        focused={this.state.focused}
        icon="Icon--search"
      />
    )

    return (
      <MediaFigure key="searchOrLoading" className={styles.desktopSearchOrLoading}>
        {icon}
      </MediaFigure>
    )
  }

  renderIcons = () => {
    let icons = []

    if (this.props.fullscreen) {
      icons.push(this.renderMobileLoadingOrClearIcon())
      icons.push(this.renderMobileSearchIconButton())
    } else {
      icons.push(this.renderDesktopSearchOrLoadingIcon())
    }

    return icons
  }

  render = () => {
    const { fullscreen, searchPlaceholder } = this.props
    const searchContainerClasses = classNames({
      [styles.mobileContainer]: fullscreen,
      [styles.desktopContainer]: !fullscreen
    })
    const searchInputClasses = classNames(styles.searchInput, {
      [styles.mobileSearchInput]: fullscreen
    })

    return (
      <FauxInput mediaLayout={true} className={searchContainerClasses} onClick={this.props.onClick}>
        <Label className={styles.label}>{searchPlaceholder}</Label>
        <Input
          bare={true}
          onChange={this.onChange}
          value={this.props.value}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          innerRef={elem => {
            this.searchField = elem
          }}
          autoCapitalize="off"
          placeholder={searchPlaceholder}
          type="search"
          className={searchInputClasses}
        />
        {this.renderIcons()}
      </FauxInput>
    )
  }
}
