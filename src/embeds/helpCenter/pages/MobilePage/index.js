import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { ScrollContainer } from 'component/container/ScrollContainer'
import { SearchField } from 'component/field/SearchField'
import { ZendeskLogo } from 'component/ZendeskLogo'
import { LoadingBarContent } from 'component/loading/LoadingBarContent'
import { i18n } from 'service/i18n'
import HelpCenterChannelButton from 'src/embeds/helpCenter/components/HelpCenterChannelButton'

import { locals as styles } from './styles.scss'

export default class MobilePage extends Component {
  static propTypes = {
    articleViewActive: PropTypes.bool,
    buttonLabel: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    hasContextualSearched: PropTypes.bool,
    handleNextClick: PropTypes.func.isRequired,
    handleOnChangeValue: PropTypes.func.isRequired,
    onSearchFieldFocus: PropTypes.func.isRequired,
    hasSearched: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isLoading: PropTypes.bool,
    search: PropTypes.func.isRequired,
    searchFieldValue: PropTypes.string,
    showNextButton: PropTypes.bool,
    isContextualSearchPending: PropTypes.bool.isRequired,
    contextualHelpRequestNeeded: PropTypes.bool.isRequired,
    searchPlaceholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    buttonLoading: PropTypes.bool
  }

  static defaultProps = {
    articleViewActive: false,
    chatAvailable: false,
    hasContextualSearched: false,
    hasSearched: false,
    hideZendeskLogo: false,
    isLoading: false,
    searchFieldValue: '',
    showNextButton: true,
    submitTicketAvailable: true,
    chatEnabled: false,
    channelChoice: false,
    setChannelChoiceShown: () => {},
    talkOnline: false,
    buttonLoading: false
  }

  constructor(props, context) {
    super(props, context)

    this.state = {
      searchFieldFocused: false,
      showIntroScreen: !props.contextualHelpRequestNeeded && !props.articleViewActive
    }

    this.searchField = null
    this.searchFieldFocusTimer = null
  }

  componentDidUpdate = (prevProps, prevState) => {
    // We have to do this check in componentDidUpdate so that
    // the searchField is the most recent one and ios focuses
    // on the correct one.
    if (
      prevState.showIntroScreen === true &&
      this.state.showIntroScreen === false &&
      this.props.hasContextualSearched === false
    ) {
      this.searchField.focus()
    }

    if (this.searchField) {
      this.searchField.setState({ searchInputVal: this.props.searchFieldValue })
    }
  }

  componentWillUnmount = () => {
    if (this.searchFieldFocusTimer) {
      clearTimeout(this.searchFieldFocusTimer)
    }
  }

  focusField() {
    this.getSearchField().focus()
  }

  getSearchField() {
    return this.searchField
  }

  resetState = () => {
    if (!this.props.hasSearched) {
      this.setState({ showIntroScreen: true })
      this.setSearchFieldFocused(false)
    }
  }

  setIntroScreen = () => {
    this.setState({
      showIntroScreen: false
    })
  }

  setSearchFieldFocused = focused => {
    this.setState({ searchFieldFocused: !!focused })
    this.props.onSearchFieldFocus(!!focused)
  }

  handleSearchBoxClicked = () => {
    if (this.state.showIntroScreen) {
      this.setState({ showIntroScreen: false })
      this.setSearchFieldFocused(true)
    }
  }

  handleOnBlur = () => {
    // defer event to allow onClick events to fire first
    this.searchFieldFocusTimer = setTimeout(() => {
      this.setSearchFieldFocused(false)

      if (!this.props.hasSearched && !this.props.isLoading) {
        this.setState({ showIntroScreen: true })
      }
    }, 1)
  }

  handleOnFocus = () => {
    this.setSearchFieldFocused(true)
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.search()
  }

  showFooterContent = () => {
    return (
      this.props.showNextButton &&
      (this.props.articleViewActive ||
        (!this.state.showIntroScreen && !this.state.searchFieldFocused))
    )
  }

  renderSearchField = () => {
    return (
      <SearchField
        ref={el => {
          this.searchField = el
        }}
        fullscreen={true}
        isMobile={true}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
        onChangeValue={this.props.handleOnChangeValue}
        hasSearched={this.props.hasSearched}
        onSearchIconClick={this.handleSubmit}
        onClick={this.handleSearchBoxClicked}
        isLoading={this.props.isLoading}
        searchPlaceholder={this.props.searchPlaceholder}
      />
    )
  }

  renderForm = () => {
    const hiddenClasses = !this.state.showIntroScreen ? 'u-isHidden' : ''

    return (
      <form
        ref="helpCenterForm"
        className={styles.form}
        noValidate={true}
        onSubmit={this.handleSubmit}
      >
        <h1 className={`${styles.searchTitle} ${hiddenClasses}`}>
          {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
        </h1>
        {this.renderSearchField()}
      </form>
    )
  }

  renderFormContainer = () => {
    return this.props.articleViewActive || !this.state.showIntroScreen ? null : (
      <div>{this.renderForm()}</div>
    )
  }

  renderHeaderContent = () => {
    return this.props.articleViewActive || this.state.showIntroScreen ? null : this.renderForm()
  }

  renderFooterContent = () => {
    if (!this.showFooterContent()) return null

    const { buttonLabel, handleNextClick, buttonLoading } = this.props
    return (
      <HelpCenterChannelButton
        buttonLabel={buttonLabel}
        onClick={handleNextClick}
        loading={buttonLoading}
        isRTL={i18n.isRTL()}
        isMobile={true}
      />
    )
  }

  renderZendeskLogo = hideZendeskLogo => {
    return !hideZendeskLogo ? <ZendeskLogo fullscreen={true} /> : null
  }

  renderChildContent() {
    const { children, isContextualSearchPending, articleViewActive } = this.props

    if (this.state.showIntroScreen && !articleViewActive) return null

    return isContextualSearchPending && !articleViewActive ? (
      <LoadingBarContent containerClasses={styles.loadingBarContent} />
    ) : (
      children
    )
  }

  render = () => {
    const mobileHideLogoState = this.props.hasSearched
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState
    const containerClasses = !this.props.showNextButton && hideZendeskLogo ? styles.container : ''

    return (
      <div>
        <ScrollContainer
          ref="scrollContainer"
          title={this.props.title}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}
          fullscreen={true}
          isMobile={true}
          containerClasses={containerClasses}
          isVirtualKeyboardOpen={this.state.searchFieldFocused}
        >
          {this.renderFormContainer()}
          {this.renderChildContent()}
        </ScrollContainer>
        {this.renderZendeskLogo(hideZendeskLogo)}
      </div>
    )
  }
}
