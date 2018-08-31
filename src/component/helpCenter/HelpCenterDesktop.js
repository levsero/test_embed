import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from '@zendeskgarden/react-buttons';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ChannelChoicePopupDesktop } from 'component/channelChoice/ChannelChoicePopupDesktop';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { LoadingBarContent } from 'component/loading/LoadingBarContent';
import { MAX_WIDGET_HEIGHT_NO_SEARCH } from 'constants/shared';
import { i18n } from 'service/i18n';

import { locals as styles } from './HelpCenterDesktop.scss';

export class HelpCenterDesktop extends Component {
  static propTypes = {
    articleViewActive: PropTypes.bool,
    buttonLabel: PropTypes.string.isRequired,
    channelChoice: PropTypes.bool,
    channelChoiceShown: PropTypes.bool,
    chatAvailable: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    formTitleKey: PropTypes.string,
    handleNextClick: PropTypes.func.isRequired,
    handleOnChangeValue: PropTypes.func.isRequired,
    hasSearched: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isLoading: PropTypes.bool,
    onNextClick: PropTypes.func,
    search: PropTypes.func.isRequired,
    searchFieldValue: PropTypes.string,
    showNextButton: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    updateChatScreen: PropTypes.func,
    isContextualSearchPending: PropTypes.bool.isRequired,
    chatOfflineAvailable: PropTypes.bool.isRequired
  };

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
    talkAvailable: false,
    talkEnabled: false,
    updateChatScreen: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.agentMessage = null;
    this.searchField = null;
  }

  componentDidUpdate = () => {
    if (this.searchField) {
      this.searchField.setState({
        searchInputVal: this.props.searchFieldValue
      });
    }

    const shadowVisible = !(!this.props.showNextButton && this.props.hideZendeskLogo);

    this.refs.scrollContainer.setScrollShadowVisible(shadowVisible);
  }

  getSearchField() {
    return this.searchField;
  }

  focusField = () => {
    if (!this.props.articleViewActive) {
      const searchFieldInputNode = this.searchField.getSearchField();
      const strLength = searchFieldInputNode.value.length;

      this.searchField.focus();

      if (searchFieldInputNode.setSelectionRange) {
        searchFieldInputNode.setSelectionRange(strLength, strLength);
      }
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.search();
  }

  renderForm = () => {
    return (
      <form
        ref='helpCenterForm'
        noValidate={true}
        className={styles.form}
        onSubmit={this.handleSubmit}>

        <SearchField
          ref={(el) => { this.searchField = el; }}
          fullscreen={false}
          hideZendeskLogo={this.props.hideZendeskLogo}
          onChangeValue={this.props.handleOnChangeValue}
          hasSearched={this.props.hasSearched}
          onSearchIconClick={this.handleSubmit}
          isLoading={this.props.isLoading} />
      </form>
    );
  }

  renderHeaderContent = () => {
    return (this.props.articleViewActive || !this.props.hasSearched)
      ? null
      : this.renderForm();
  }

  renderBodyForm = () => {
    return (this.props.articleViewActive || this.props.hasSearched)
      ? null
      : this.renderForm();
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo
      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
      : null;
  }

  renderChannelChoice = () => {
    return (this.props.channelChoiceShown)
      ? <ChannelChoicePopupDesktop
        chatOfflineAvailable={this.props.chatOfflineAvailable}
        submitTicketAvailable={this.props.submitTicketAvailable}
        chatEnabled={this.props.chatEnabled}
        callbackEnabled={this.props.callbackEnabled}
        talkAvailable={this.props.talkAvailable}
        chatAvailable={this.props.chatAvailable}
        talkEnabled={this.props.talkEnabled}
        onNextClick={this.props.onNextClick} />
      : null;
  }

  renderFooterContent = () => {
    const { channelChoice, showNextButton, hasSearched, articleViewActive } = this.props;
    const onClickHandler = channelChoice
      ? this.props.onNextClick
      : this.props.handleNextClick;

    return showNextButton && (hasSearched || articleViewActive)
      ? (
        <div className={styles.buttonContainer}>
          <ButtonGroup rtl={i18n.isRTL()} containerClasses={styles.buttonGroup}>
            <Button
              primary={true}
              onClick={onClickHandler}
              className={styles.button}>
              {this.props.buttonLabel}
            </Button>
          </ButtonGroup>
          {this.renderChannelChoice()}
        </div>
      )
      : null;
  }

  renderChildContent() {
    const { children, isContextualSearchPending, articleViewActive } = this.props;

    return (isContextualSearchPending && !articleViewActive)
      ? <LoadingBarContent containerClasses={styles.loadingBars} />
      : children;
  }

  render = () => {
    const customHeightClasses = !this.props.hasSearched ? styles.noCustomHeight : '';
    let footerClasses = '';

    if (!this.props.showNextButton && this.props.hasSearched) {
      if (this.props.articleViewActive && this.props.hideZendeskLogo) {
        footerClasses = styles.footerArticleView;
      } else {
        footerClasses = this.props.hideZendeskLogo ? styles.footer : styles.footerLogo;
      }
    }

    return (
      <div>
        <ScrollContainer
          ref='scrollContainer'
          hideZendeskLogo={this.props.hideZendeskLogo}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${this.props.formTitleKey}`)}
          classes={customHeightClasses}
          maxHeight={this.props.hasSearched ? undefined : MAX_WIDGET_HEIGHT_NO_SEARCH}
          footerClasses={footerClasses}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}>
          {this.renderBodyForm()}
          {this.renderChildContent()}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}
