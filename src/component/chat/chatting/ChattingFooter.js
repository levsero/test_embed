import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { i18n } from 'service/i18n'
import { Dropzone } from 'component/Dropzone'

import { Tooltip } from '@zendeskgarden/react-tooltips'
import { Icon } from 'component/Icon'

import { ICONS, TEST_IDS } from 'constants/shared'
import ChatMenu from 'embeds/chat/components/ChatMenu'
import FooterIconButton from 'embeds/chat/components/FooterIconButton'
import ZendeskLogo from 'components/ZendeskLogo'
import {
  BottomRow,
  ContainerMobile,
  Footer,
  IconContainer,
  InputContainerMobile
} from './ChattingFooterStyles'

export class ChattingFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    sendChat: PropTypes.func,
    handleAttachmentDrop: PropTypes.func,
    isChatting: PropTypes.bool,
    toggleMenu: PropTypes.func,
    attachmentsEnabled: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired,
    hideZendeskLogo: PropTypes.bool,
    isPreview: PropTypes.bool
  }

  static defaultProps = {
    endChat: () => {},
    isChatting: false,
    toggleMenu: () => {},
    isPreview: false
  }

  tooltipPlacement = () => {
    return i18n.isRTL() ? 'top-start' : 'top-end'
  }

  handleMenuClick = (e, keypress) => {
    e.stopPropagation()
    this.props.toggleMenu(keypress)
  }

  handleEndChatClick = e => {
    if (this.props.isChatting) {
      this.props.endChat(e)
    }
  }

  renderEndChatOption = () => {
    const disabled = !this.props.isChatting
    const altText = i18n.t('embeddable_framework.chat.icon.endChat.hover.label')

    const endChatButton = (
      <FooterIconButton
        ignoreThemeOverride={true}
        colorType="fill"
        size="small"
        onClick={this.handleEndChatClick}
        ariaLabel={altText}
        disabled={disabled}
      >
        <Icon type={ICONS.END_CHAT} />
      </FooterIconButton>
    )

    if (this.props.isMobile) {
      return endChatButton
    }

    return (
      <Tooltip placement={this.tooltipPlacement()} trigger={endChatButton}>
        {altText}
      </Tooltip>
    )
  }

  renderAttachmentOption = () => {
    if (!this.props.attachmentsEnabled) return null

    const altText = i18n.t('embeddable_framework.chat.icon.attachments.hover.label')

    const attachmentButton = (
      <FooterIconButton
        ignoreThemeOverride={true}
        size="small"
        ariaLabel={altText}
        data-testid={TEST_IDS.CHAT_ATTACHMENT_BUTTON}
      >
        <Icon type={ICONS.PAPERCLIP_SMALL} />
      </FooterIconButton>
    )

    if (this.props.isPreview) return attachmentButton

    if (this.props.isMobile) {
      return <Dropzone onDrop={this.props.handleAttachmentDrop}>{attachmentButton}</Dropzone>
    }

    return (
      <Dropzone onDrop={this.props.handleAttachmentDrop}>
        <Tooltip trigger={attachmentButton} placement={this.tooltipPlacement()}>
          {altText}
        </Tooltip>
      </Dropzone>
    )
  }

  renderSendChatOption = () => {
    return (
      <FooterIconButton
        colorType="fill"
        onClick={this.props.sendChat}
        aria-label={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
      >
        <Icon type={ICONS.SEND_CHAT} />
      </FooterIconButton>
    )
  }

  renderDesktop = () => {
    return (
      <Footer>
        {this.props.children}
        <BottomRow>
          {!this.props.hideZendeskLogo && <ZendeskLogo linkToChat={true} />}

          <IconContainer data-testid={TEST_IDS.CHAT_FOOTER_MENU_BUTTONS}>
            {this.renderEndChatOption()}
            {this.renderAttachmentOption()}
            <ChatMenu />
          </IconContainer>
        </BottomRow>
      </Footer>
    )
  }

  renderMobile = () => {
    return (
      <ContainerMobile>
        {this.renderAttachmentOption()}
        <InputContainerMobile>{this.props.children}</InputContainerMobile>
        {this.renderSendChatOption()}
      </ContainerMobile>
    )
  }

  render() {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop()
  }
}
