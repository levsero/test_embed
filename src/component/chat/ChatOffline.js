import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { i18n } from 'service/i18n';
import classNames from 'classnames';

import { Button } from 'component/button/Button';
import { ChatOfflineForm } from 'component/chat/ChatOfflineForm';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { chatOfflineFormChanged,
  sendOfflineMessage,
  handleOfflineFormBack,
  handleOperatingHoursClick } from 'src/redux/modules/chat';
import { getChatOfflineForm,
  getOfflineMessage,
  getOfflineFormSettings,
  getOfflineFormFields,
  getGroupedOperatingHours } from 'src/redux/modules/chat/chat-selectors';

import { locals as styles } from './ChatOffline.scss';

const mapStateToProps = (state) => {
  return {
    formState: getChatOfflineForm(state),
    formFields: getOfflineFormFields(state),
    formSettings: getOfflineFormSettings(state),
    offlineMessage: getOfflineMessage(state),
    operatingHours: getGroupedOperatingHours(state)
  };
};

class ChatOffline extends Component {
  static propTypes = {
    updateFrameSize: PropTypes.func.isRequired,
    chatOfflineFormChanged: PropTypes.func.isRequired,
    sendOfflineMessage: PropTypes.func.isRequired,
    handleOfflineFormBack: PropTypes.func.isRequired,
    handleOperatingHoursClick: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formFields: PropTypes.object.isRequired,
    formSettings: PropTypes.object.isRequired,
    offlineMessage: PropTypes.object.isRequired,
    handleCloseClick: PropTypes.func,
    operatingHours: PropTypes.object,
    isMobile: PropTypes.bool,
    hideZendeskLogo: PropTypes.bool
  };

  static defaultProps = {
    updateFrameSize: () => {},
    handleCloseClick: () => {},
    sendOfflineMessage: () => {},
    operatingHours: {},
    isMobile: false,
    hideZendeskLogo: false,
    formSettings: { enabled: false },
    offlineMessage: {}
  };

  renderOfflineForm = () => {
    if (!this.props.formSettings.enabled) return;

    return (
      <ChatOfflineForm
        formFields={this.props.formFields}
        formState={this.props.formState}
        offlineMessage={this.props.offlineMessage}
        handleOfflineFormBack={this.props.handleOfflineFormBack}
        handleOperatingHoursClick={this.props.handleOperatingHoursClick}
        sendOfflineMessage={this.props.sendOfflineMessage}
        chatOfflineFormChanged={this.props.chatOfflineFormChanged}
        operatingHours={this.props.operatingHours}
        updateFrameSize={this.props.updateFrameSize}
        isMobile={this.props.isMobile} />
    );
  }

  renderChatOfflineScreen = () => {
    if (this.props.formSettings.enabled) return;

    return (
      <div>
        <p className={styles.greeting}>
          {i18n.t('embeddable_framework.chat.offline.label.noForm')}
        </p>
        <Button
          onTouchStartDisabled={true}
          label={i18n.t('embeddable_framework.chat.offline.button.close')}
          onClick={this.props.handleCloseClick}
          className={styles.button} />
      </div>
    );
  }

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={styles.zendeskLogo}
        rtl={i18n.isRTL()}
        fullscreen={false}
      /> : null;
  }

  render() {
    const { isMobile, hideZendeskLogo } = this.props;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );
    const logoFooterClasses = classNames({
      [styles.logoFooter]: !hideZendeskLogo
    });

    return (
      <ScrollContainer
        ref='scrollContainer'
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerClasses={logoFooterClasses}
        footerContent={this.renderZendeskLogo()}
        title={i18n.t('embeddable_framework.chat.title')}>
        {this.renderOfflineForm()}
        {this.renderChatOfflineScreen()}
      </ScrollContainer>
    );
  }
}

const actionCreators = {
  chatOfflineFormChanged,
  sendOfflineMessage,
  handleOfflineFormBack,
  handleOperatingHoursClick,
  getGroupedOperatingHours
};

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(ChatOffline);
