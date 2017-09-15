import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Button } from 'component/button/Button';
import { ButtonGroup } from 'component/button/ButtonGroup';
import { ChannelChoicePopupDesktop } from 'component/channelChoice/ChannelChoicePopupDesktop';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { SearchField } from 'component/field/SearchField';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { ChatPopup } from 'component/chat/ChatPopup';
import { i18n } from 'service/i18n';
import { CHATTING_SCREEN } from 'src/redux/modules/chat/reducer/chat-screen-types';

import { locals as styles } from './HelpCenterDesktop.sass';

const chatNotificationHideDelay = 4000;
const proactiveChatNotificationDelay = 8000;

export class HelpCenterDesktop extends Component {
  static propTypes = {
    articleViewActive: PropTypes.bool,
    buttonLabel: PropTypes.string.isRequired,
    channelChoice: PropTypes.bool,
    chatOnline: PropTypes.bool.isRequired,
    children: PropTypes.node.isRequired,
    disableAutoComplete: PropTypes.bool,
    formTitleKey: PropTypes.string,
    handleNextClick: PropTypes.func.isRequired,
    handleOnChangeValue: PropTypes.func.isRequired,
    hasSearched: PropTypes.bool,
    newDesign: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool,
    isLoading: PropTypes.bool,
    onNextClick: PropTypes.func,
    search: PropTypes.func.isRequired,
    searchFieldValue: PropTypes.string,
    shadowVisible: PropTypes.bool,
    showNextButton: PropTypes.bool,
    updateFrameSize: PropTypes.func,
    notification: PropTypes.object.isRequired,
    hideChatNotification: PropTypes.func,
    updateChatScreen: PropTypes.func
  };

  static defaultProps = {
    articleViewActive: false,
    channelChoice: false,
    disableAutoComplete: false,
    formTitleKey: 'help',
    hasSearched: false,
    newDesign: false,
    hideZendeskLogo: false,
    isLoading: false,
    onNextClick: () => {},
    searchFieldValue: '',
    shadowVisible: false,
    showNextButton: true,
    updateFrameSize: () => {},
    hideChatNotification: () => {},
    updateChatScreen: () => {}
  };

  constructor(props, context) {
    super(props, context);
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

  handleChatNotificationRespond = (e) => {
    this.props.updateChatScreen(CHATTING_SCREEN);
    this.props.handleNextClick(e);
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
          disableAutoComplete={this.props.disableAutoComplete}
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
    return this.props.hasSearched
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
             chatOnline={this.props.chatOnline}
             onNextClick={this.props.onNextClick} />
         : null;
  }

  renderFooterContent = () => {
    if (!this.props.showNextButton || !this.props.hasSearched) return null;

    return (
      <div className={styles.buttonContainer}>
        <ButtonGroup rtl={i18n.isRTL()}>
          <Button
            fullscreen={false}
            label={this.props.buttonLabel}
            onClick={this.props.handleNextClick} />
        </ButtonGroup>
        {this.renderChannelChoice()}
      </div>
    );
  }

  renderChatNotification = () => {
    const { notification, hideChatNotification } = this.props;

    if (notification.show) {
      const { proactive } = notification;
      const delay = proactive ? proactiveChatNotificationDelay : chatNotificationHideDelay;
      const className = proactive ? styles.ongoingNotificationCta : styles.ongoingNotification;

      // TODO: Handle hiding of the notification within the ChatPopup component itself.
      setTimeout(() => hideChatNotification(), delay);

      return (
        <ChatPopup
          showCta={proactive}
          className={className}
          agentName={notification.display_name}
          message={notification.msg}
          avatarPath={notification.avatar_path}
          respondFn={this.handleChatNotificationRespond}
          dismissFn={hideChatNotification} />
      );
    }

    return null;
  }

  render = () => {
    setTimeout(() => this.props.updateFrameSize(), 0);

    let footerClasses = '';
    const chatPopup = this.props.articleViewActive
      ? this.renderChatNotification()
      : null;

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
          footerClasses={footerClasses}
          newDesign={this.props.newDesign}
          headerContent={this.renderHeaderContent()}
          footerContent={this.renderFooterContent()}>
          {this.renderBodyForm()}
          {this.props.children}
        </ScrollContainer>
        {this.renderZendeskLogo()}
        {chatPopup}
      </div>
    );
  }
}
