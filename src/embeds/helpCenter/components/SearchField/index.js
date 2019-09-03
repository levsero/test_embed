import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SearchIconButton from 'embeds/helpCenter/components/SearchIconButton'
import ClearInputIcon from 'embeds/helpCenter/icons/clearInput.svg'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'
import { IconButton } from '@zendeskgarden/react-buttons'
import { locals as styles } from './styles.scss'
import { FauxInput, Field, Input, Label } from '@zendeskgarden/react-forms'
import classNames from 'classnames'
import { TEST_IDS } from 'src/constants/shared'

export default class SearchField extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    isLoading: PropTypes.bool,
    onChangeValue: PropTypes.func,
    onClick: PropTypes.func,
    onSearchIconClick: PropTypes.func,
    searchPlaceholder: PropTypes.string.isRequired,
    value: PropTypes.string
  }

  static defaultProps = {
    isMobile: false,
    isLoading: false,
    onChangeValue: () => {},
    onSearchIconClick: () => {},
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
      <div key="search" className={styles.mobileSearchIcon}>
        <SearchIconButton onClick={this.props.onSearchIconClick} isMobile={this.props.isMobile} />
      </div>
    )
  }

  renderMobileLoadingOrClearIcon = () => {
    let icon = null

    if (this.props.isLoading) {
      icon = <LoadingEllipses />
    } else if (this.props.value) {
      icon = (
        <IconButton
          data-testid="Icon--clearInput"
          onClick={this.clearInput}
          className={styles.mobileClearInput}
        >
          <ClearInputIcon />
        </IconButton>
      )
    }

    return (
      <div key="loadingOrClear" className={styles.mobileNonSearchIconContainer}>
        {icon}
      </div>
    )
  }

  renderDesktopSearchOrLoadingIcon = () => {
    const icon = this.props.isLoading ? (
      <LoadingEllipses />
    ) : (
      <SearchIconButton onClick={this.props.onSearchIconClick} focused={this.state.focused} />
    )

    return (
      <div key="searchOrLoading" className={styles.desktopSearchOrLoading}>
        {icon}
      </div>
    )
  }

  renderIcons = () => {
    let icons = []

    if (this.props.isMobile) {
      icons.push(this.renderMobileLoadingOrClearIcon())
      icons.push(this.renderMobileSearchIconButton())
    } else {
      icons.push(this.renderDesktopSearchOrLoadingIcon())
    }

    return icons
  }

  render = () => {
    const { isMobile, searchPlaceholder } = this.props
    const searchContainerClasses = classNames({
      [styles.mobileContainer]: isMobile,
      [styles.desktopContainer]: !isMobile
    })
    const searchInputClasses = classNames(styles.searchInput, {
      [styles.mobileSearchInput]: isMobile
    })

    return (
      <FauxInput onClick={this.props.onClick} className={searchContainerClasses}>
        <Field>
          <Label className={styles.label}>{searchPlaceholder}</Label>
          <Input
            bare={true}
            onChange={this.onChange}
            value={this.props.value}
            onFocus={this.onFocus}
            onBlur={this.onBlur}
            ref={elem => {
              this.searchField = elem
            }}
            autoCapitalize="off"
            placeholder={searchPlaceholder}
            type="search"
            className={searchInputClasses}
            data-testid={TEST_IDS.SEARCH_FIELD}
          />
          {this.renderIcons()}
        </Field>
      </FauxInput>
    )
  }
}
