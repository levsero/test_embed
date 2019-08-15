import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { Button } from '@zendeskgarden/react-buttons'
import { ButtonGroup } from 'component/button/ButtonGroup'
import { ScrollContainer } from 'component/container/ScrollContainer'
import { SearchField } from 'component/field/SearchField'
import { ZendeskLogo } from 'component/ZendeskLogo'
import { LoadingBarContent } from 'component/loading/LoadingBarContent'
import { i18n } from 'service/i18n'
import { LoadingEllipses } from 'component/loading/LoadingEllipses'

import SearchPromptPage from 'src/embeds/helpCenter/pages/SearchPromptPage'
import { locals as styles } from './styles.scss'
import classNames from 'classnames'

export default class DesktopPage extends Component {
  static propTypes = {
    articleViewActive: PropTypes.bool,
    buttonLabel: PropTypes.string.isRequired,
    channelChoice: PropTypes.bool,
    children: PropTypes.node.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    handleOnChangeValue: PropTypes.func.isRequired,
    hasSearched: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isLoading: PropTypes.bool,
    onNextClick: PropTypes.func,
    search: PropTypes.func.isRequired,
    searchFieldValue: PropTypes.string,
    showNextButton: PropTypes.bool,
    isContextualSearchPending: PropTypes.bool.isRequired,
    isOnInitialDesktopSearchScreen: PropTypes.bool,
    maxWidgetHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    searchPlaceholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    buttonLoading: PropTypes.bool,
    contextualHelpRequestNeeded: PropTypes.bool
  }

  static defaultProps = {
    articleViewActive: false,
    channelChoice: false,
    channelChoiceShown: false,
    formTitleKey: 'help',
    hasSearched: false,
    hideZendeskLogo: false,
    isLoading: false,
    onNextClick: () => {},
    searchFieldValue: '',
    showNextButton: true,
    submitTicketAvailable: true,
    chatEnabled: false,
    isOnInitialDesktopSearchScreen: false,
    buttonLoading: false,
    contextualHelpRequestNeeded: false
  }

  constructor(props, context) {
    super(props, context)

    this.agentMessage = null
    this.searchField = null
  }

  componentDidUpdate = () => {
    if (this.searchField) {
      this.searchField.setState({
        searchInputVal: this.props.searchFieldValue
      })
    }
  }

  getSearchField() {
    return this.searchField
  }

  focusField = () => {
    if (!this.props.articleViewActive && this.searchField) {
      const searchFieldInputNode = this.searchField.getSearchField()
      const strLength = searchFieldInputNode.value.length

      this.searchField.focus()

      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength)
      }
    }
  }

  handleSubmit = e => {
    e.preventDefault()
    this.props.search()
  }

  renderForm = () => {
    const { hasSearched, contextualHelpRequestNeeded, hideZendeskLogo } = this.props

    const customSearchContainerClasses = classNames({
      [styles.onHelpCenterSmallScreen]:
        !hasSearched && !contextualHelpRequestNeeded && hideZendeskLogo,
      [styles.onHelpCenterLargeScreen]: hasSearched || contextualHelpRequestNeeded
    })

    return (
      <form
        ref="helpCenterForm"
        noValidate={true}
        className={styles.form}
        onSubmit={this.handleSubmit}
      >
        <SearchField
          ref={el => {
            this.searchField = el
          }}
          fullscreen={false}
          hideZendeskLogo={hideZendeskLogo}
          onChangeValue={this.props.handleOnChangeValue}
          hasSearched={this.props.hasSearched}
          onSearchIconClick={this.handleSubmit}
          isLoading={this.props.isLoading}
          searchPlaceholder={this.props.searchPlaceholder}
          customSearchContainerClasses={customSearchContainerClasses}
        />
      </form>
    )
  }

  renderHeaderContent = () => {
    return this.props.isOnInitialDesktopSearchScreen || this.props.articleViewActive
      ? null
      : this.renderForm()
  }

  renderBodyForm = () => {
    return !this.props.isOnInitialDesktopSearchScreen ? null : this.renderForm()
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ? <ZendeskLogo fullscreen={false} /> : null
  }

  renderLoadingAnimation = () => {
    return <LoadingEllipses useUserColor={false} itemClassName={styles.loadingAnimation} />
  }

  renderLoadingButton = () => {
    const buttonStyles = classNames(styles.button, styles.disabledButton)

    return (
      <Button primary={true} className={buttonStyles}>
        {this.renderLoadingAnimation()}
      </Button>
    )
  }

  renderButton = () => {
    const { channelChoice, buttonLabel, onNextClick, handleNextClick } = this.props
    const onClickHandler = channelChoice ? onNextClick : handleNextClick

    return (
      <Button primary={true} onClick={onClickHandler} className={styles.button}>
        {buttonLabel}
      </Button>
    )
  }

  renderFooterContent = () => {
    const { showNextButton, buttonLoading } = this.props

    return showNextButton && !this.props.isOnInitialDesktopSearchScreen ? (
      <div className={styles.buttonContainer}>
        <ButtonGroup rtl={i18n.isRTL()} containerClasses={styles.buttonGroup}>
          {buttonLoading ? this.renderLoadingButton() : this.renderButton()}
        </ButtonGroup>
      </div>
    ) : null
  }

  renderChildContent() {
    const { children, isContextualSearchPending, articleViewActive } = this.props

    return isContextualSearchPending && !articleViewActive ? (
      <LoadingBarContent containerClasses={styles.loadingBars} />
    ) : (
      children
    )
  }

  render = () => {
    const customHeightClasses = this.props.isOnInitialDesktopSearchScreen
      ? styles.noCustomHeight
      : ''
    let footerClasses = ''

    if (!this.props.showNextButton) {
      if (this.props.articleViewActive && this.props.hideZendeskLogo) {
        footerClasses = styles.footerArticleView
      } else {
        footerClasses = this.props.hideZendeskLogo ? styles.footer : styles.footerLogo
      }
    }
    const shadowVisible =
      this.props.showNextButton &&
      !this.props.isOnInitialDesktopSearchScreen &&
      !this.props.hideZendeskLogo

    if (this.props.isOnInitialDesktopSearchScreen) {
      return (
        <SearchPromptPage
          title={this.props.title}
          makeSearchRequest={this.props.search}
          handleOnChangeValue={this.props.handleOnChangeValue}
          isLoading={this.props.isLoading}
          searchPlaceholder={this.props.searchPlaceholder}
        />
      )
    }

    return (
      <div>
        <ScrollContainer
          ref="scrollContainer"
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={this.props.title}
          classes={customHeightClasses}
          maxHeight={this.props.maxWidgetHeight}
          footerClasses={footerClasses}
          scrollShadowVisible={shadowVisible}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}
        >
          {this.renderBodyForm()}
          {this.renderChildContent()}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    )
  }
}
