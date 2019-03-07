import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@zendeskgarden/react-buttons';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ChannelChoicePopupMobile } from 'component/channelChoice/ChannelChoicePopupMobile';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { LoadingBarContent } from 'component/loading/LoadingBarContent';
import { LoadingEllipses } from 'component/loading/LoadingEllipses';
import { i18n } from 'service/i18n';

import { locals as styles } from './HelpCenterMobile.scss';

export class HelpCenterMobile extends Component {
  static propTypes = {
    chatOfflineAvailable: PropTypes.bool,
    articleViewActive: PropTypes.bool,
    buttonLabel: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool,
    children: PropTypes.node.isRequired,
    hasContextualSearched: PropTypes.bool,
    handleNextClick: PropTypes.func.isRequired,
    handleOnChangeValue: PropTypes.func.isRequired,
    onSearchFieldFocus: PropTypes.func.isRequired,
    onNextClick: PropTypes.func,
    hasSearched: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isLoading: PropTypes.bool,
    search: PropTypes.func.isRequired,
    searchFieldValue: PropTypes.string,
    showNextButton: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    channelChoice: PropTypes.bool,
    setChannelChoiceShown: PropTypes.func,
    talkOnline: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    isContextualSearchPending: PropTypes.bool.isRequired,
    contextualHelpEnabled: PropTypes.bool.isRequired,
    searchPlaceholder: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    buttonLoading: PropTypes.bool
  };

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
    onNextClick: () => {},
    talkOnline: false,
    buttonLoading: false
  };

  constructor(props, context) {
    super(props, context);

    this.state = {
      searchFieldFocused: false,
      showIntroScreen: !props.contextualHelpEnabled && !props.articleViewActive
    };

    this.searchField = null;
  }

  componentDidUpdate = (prevProps, prevState) => {
    // We have to do this check in componentDidUpdate so that
    // the searchField is the most recent one and ios focuses
    // on the correct one.
    if (prevState.showIntroScreen === true &&
        this.state.showIntroScreen === false &&
        this.props.hasContextualSearched === false) {
      this.searchField.focus();
    }

    if (this.searchField) {
      this.searchField.setState({ searchInputVal: this.props.searchFieldValue });
    }
  }

  getSearchField() {
    return this.searchField;
  }

  resetState = () => {
    if (!this.props.hasSearched) {
      this.setState({ showIntroScreen: true });
      this.setSearchFieldFocused(false);
    }
  }

  setIntroScreen = () => {
    this.setState({
      showIntroScreen: false
    });
  }

  setSearchFieldFocused = (focused) => {
    this.setState({ searchFieldFocused: !!focused });
    this.props.onSearchFieldFocus(!!focused);
  }

  handleSearchBoxClicked = () => {
    if (this.state.showIntroScreen) {
      this.setState({ showIntroScreen: false });
      this.setSearchFieldFocused(true);
    }
  }

  handleOnBlur = () => {
    // defer event to allow onClick events to fire first
    setTimeout(() => {
      this.setSearchFieldFocused(false);

      if (!this.props.hasSearched && !this.props.isLoading) {
        this.setState({ showIntroScreen: true });
      }
    }, 1);
  }

  handleOnFocus = () => {
    this.setSearchFieldFocused(true);
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.search();
  }

  showFooterContent = () => {
    return this.props.showNextButton &&
      (this.props.articleViewActive || (!this.state.showIntroScreen && !this.state.searchFieldFocused));
  }

  renderChannelChoice = () => {
    return this.props.channelChoice
      ? <div className={styles.channelChoiceContainer}>
        <ChannelChoicePopupMobile
          chatOfflineAvailable={this.props.chatOfflineAvailable}
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatEnabled={this.props.chatEnabled}
          callbackEnabled={this.props.callbackEnabled}
          talkOnline={this.props.talkOnline}
          chatAvailable={this.props.chatAvailable}
          onNextClick={this.props.onNextClick}
          onCancelClick={() => this.props.setChannelChoiceShown(false)} />
      </div>
      : null;
  }

  renderSearchField = () => {
    return (
      <SearchField
        ref={(el) => { this.searchField = el; }}
        fullscreen={true}
        isMobile={true}
        onFocus={this.handleOnFocus}
        onBlur={this.handleOnBlur}
        onChangeValue={this.props.handleOnChangeValue}
        hasSearched={this.props.hasSearched}
        onSearchIconClick={this.handleSubmit}
        onClick={this.handleSearchBoxClicked}
        isLoading={this.props.isLoading}
        searchPlaceholder={this.props.searchPlaceholder} />
    );
  }

  renderForm = () => {
    const hiddenClasses = !this.state.showIntroScreen ? 'u-isHidden' : '';

    return (
      <form
        ref='helpCenterForm'
        className={styles.form}
        noValidate={true}
        onSubmit={this.handleSubmit}>
        <h1 className={`${styles.searchTitle} ${hiddenClasses}`}>
          {i18n.t('embeddable_framework.helpCenter.label.searchHelpCenter')}
        </h1>
        {this.renderSearchField()}
      </form>
    );
  }

  renderFormContainer = () => {
    return this.props.articleViewActive || !this.state.showIntroScreen
      ? null
      : (
        <div>
          {this.renderForm()}
          {this.renderLinkContent()}
        </div>
      );
  }

  renderLinkContent = () => {
    if (!this.props.showNextButton || !this.state.showIntroScreen) return null;

    const linkContext = this.props.chatAvailable
      ? i18n.t('embeddable_framework.helpCenter.label.linkContext.chat')
      : i18n.t('embeddable_framework.helpCenter.label.linkContext.submitTicket');

    return (
      <div className={styles.linkContainer}>
        <p className={styles.linkContext}>{linkContext}</p>
        <a className={styles.link} onClick={this.props.handleNextClick}>
          {this.props.buttonLabel}
        </a>
      </div>
    );
  }

  renderHeaderContent = () => {
    return (this.props.articleViewActive || this.state.showIntroScreen)
      ? null
      : this.renderForm();
  }

  renderLoadingAnimation = () => {
    return (
      <LoadingEllipses
        useUserColor={false}
        itemClassName={styles.loadingAnimation} />
    );
  }

  renderLoadingButton = () => {
    return (
      <Button
        primary={true}
        className={styles.footerButton}>
        {this.renderLoadingAnimation()}
      </Button>
    );
  }

  renderButton = () => {
    return (
      <Button
        primary={true}
        className={styles.footerButton}
        onClick={this.props.handleNextClick}>
        {this.props.buttonLabel}
      </Button>
    );
  }

  renderFooterContent = () => {
    return this.showFooterContent() ?
      (
        <div className={styles.buttonContainer}>
          <ButtonGroup rtl={i18n.isRTL()}>
            {this.props.buttonLoading ? this.renderLoadingButton() : this.renderButton()}
          </ButtonGroup>
        </div>
      ) : null;
  }

  renderZendeskLogo = (hideZendeskLogo) => {
    return !hideZendeskLogo
      ? <ZendeskLogo fullscreen={true} />
      : null;
  }

  renderChildContent() {
    const { children, isContextualSearchPending, articleViewActive } = this.props;

    if (this.state.showIntroScreen && !articleViewActive) return null;

    return (isContextualSearchPending && !articleViewActive)
      ? <LoadingBarContent containerClasses={styles.loadingBarContent} />
      : children;
  }

  render = () => {
    const mobileHideLogoState = this.props.hasSearched;
    const hideZendeskLogo = this.props.hideZendeskLogo || mobileHideLogoState;
    const containerClasses = !this.props.showNextButton && hideZendeskLogo
      ? styles.container
      : '';

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          title={this.props.title}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}
          fullscreen={true}
          isMobile={true}
          containerClasses={containerClasses}
          isVirtualKeyboardOpen={this.state.searchFieldFocused}>
          {this.renderFormContainer()}
          {this.renderChildContent()}
        </ScrollContainer>
        {this.renderZendeskLogo(hideZendeskLogo)}
        {this.renderChannelChoice()}
      </div>
    );
  }
}
