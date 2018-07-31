import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { AgentList } from 'component/chat/agents/AgentList';
import { ScrollContainer } from 'component/container/ScrollContainer';
import { Button } from '@zendeskgarden/react-buttons';
import { ZendeskLogo } from 'component/ZendeskLogo';
import { i18n } from 'service/i18n';
import { updateChatScreen } from 'src/redux/modules/chat';
import { CHATTING_SCREEN } from 'src/redux/modules/chat/chat-screen-types';
import { getActiveAgents } from 'src/redux/modules/chat/chat-selectors';
import { locals as styles } from './AgentScreen.scss';

const mapStateToProps = (state) => {
  return {
    activeAgents: getActiveAgents(state)
  };
};

class AgentScreen extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    activeAgents: PropTypes.object.isRequired,
    hideZendeskLogo: PropTypes.bool,
    updateChatScreen: PropTypes.func.isRequired,
    newHeight: PropTypes.bool.isRequired
  };

  static defaultProps = {
    isMobile: false,
    activeAgents: {},
    hideZendeskLogo: false
  };

  renderZendeskLogo = () => {
    return !this.props.hideZendeskLogo ?
      <ZendeskLogo
        className={`${styles.zendeskLogo}`}
        rtl={i18n.isRTL()}
        fullscreen={false}
      /> : null;
  }

  renderBackButton = () => {
    const backToChatClasses = classNames(
      styles.agentListBackButton,
      { [styles.agentListBackButtonWithLogo]: !this.props.hideZendeskLogo }
    );
    const backButtonOnClick = () => { this.props.updateChatScreen(CHATTING_SCREEN); };

    return (
      <Button
        primary={true}
        onClick={backButtonOnClick}
        className={backToChatClasses}>
        {i18n.t('embeddable_framework.chat.agentList.button.backToChat')}
      </Button>
    );
  }

  render = () => {
    const { activeAgents, isMobile, newHeight } = this.props;
    const scrollContainerClasses = classNames(
      styles.scrollContainer,
      { [styles.mobileContainer]: isMobile }
    );

    return (
      <ScrollContainer
        title={i18n.t('embeddable_framework.helpCenter.label.link.chat')}
        classes={scrollContainerClasses}
        containerClasses={styles.scrollContainerContent}
        footerContent={this.renderBackButton()}
        fullscreen={isMobile}
        newHeight={newHeight}
      >
        <AgentList agents={activeAgents} />
        {this.renderZendeskLogo()}
      </ScrollContainer>
    );
  }
}

const actionCreators = { updateChatScreen };

export default connect(mapStateToProps, actionCreators, null, { withRef: true })(AgentScreen);
