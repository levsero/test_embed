import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ChannelChoicePopupDesktop } from 'component/channelChoice/ChannelChoicePopupDesktop';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';

import { locals as styles } from './HelpCenterDesktop.scss';

export class HelpCenterDesktop extends Component {
  static propTypes = {
    newHeight: PropTypes.bool,
    articleViewActive: PropTypes.bool,
    buttonLabel: PropTypes.string.isRequired,
    channelChoice: PropTypes.bool,
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
    shadowVisible: PropTypes.bool,
    showNextButton: PropTypes.bool,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    callbackEnabled: PropTypes.bool.isRequired,
    talkAvailable: PropTypes.bool,
    talkEnabled: PropTypes.bool,
    updateFrameSize: PropTypes.func,
    updateChatScreen: PropTypes.func
  };

  static defaultProps = {
    newHeight: false,
    articleViewActive: false,
    channelChoice: false,
    formTitleKey: 'help',
    hasSearched: false,
    hideZendeskLogo: false,
    isLoading: false,
    onNextClick: () => {},
    searchFieldValue: '',
    shadowVisible: false,
    showNextButton: true,
    submitTicketAvailable: true,
    chatEnabled: false,
    talkAvailable: false,
    talkEnabled: false,
    updateFrameSize: () => {},
    updateChatScreen: () => {}
  };

  constructor(props, context) {
    super(props, context);

    this.agentMessage = null;
  }

  componentDidUpdate = () => {
    if (this.refs.searchField) {
      this.refs.searchField.setState({
        searchInputVal: this.props.searchFieldValue
      });
    }

    const shadowVisible = this.props.shadowVisible &&
                          !(!this.props.showNextButton && this.props.hideZendeskLogo);

    this.refs.scrollContainer.setScrollShadowVisible(shadowVisible);
  }

  focusField = () => {
    if (!this.props.articleViewActive) {
      const searchField = this.refs.searchField;
      const searchFieldInputNode = searchField.getSearchField();
      const strLength = searchFieldInputNode.value.length;

      searchField.focus();

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
          ref='searchField'
          fullscreen={false}
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
    return (this.props.hasSearched || this.props.articleViewActive)
      ? null
      : this.renderForm();
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo
      ? <ZendeskLogo rtl={i18n.isRTL()} fullscreen={false} />
      : null;
  }

  renderChannelChoice = () => {
    return this.props.channelChoice
      ? <ChannelChoicePopupDesktop
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
    return this.props.showNextButton && (this.props.hasSearched || this.props.articleViewActive)
      ? (
        <div className={styles.buttonContainer}>
          <ButtonGroup rtl={i18n.isRTL()}>
            <Button
              fullscreen={false}
              label={this.props.buttonLabel}
              onClick={this.props.handleNextClick} />
          </ButtonGroup>
          {this.renderChannelChoice()}
        </div>
      )
      : null;
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    const customHeightClasses = this.props.newHeight && !this.props.hasSearched ? styles.noCustomHeight : '';
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
          footerClasses={footerClasses}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}
          newHeight={this.props.newHeight}>
          {this.renderBodyForm()}
          {this.props.children}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    );
  }
}
