import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './ChattingFooter.scss'

import { i18n } from 'service/i18n'
import { Dropzone } from 'component/Dropzone'

import { ThemeProvider } from '@zendeskgarden/react-theming'
import { TooltipContainer, TooltipView } from '@zendeskgarden/react-tooltips'
import { Icon } from 'component/Icon'

import { ICONS, TEST_IDS } from 'constants/shared'
import ChatMenu from 'embeds/chat/components/ChatMenu'
import FooterIconButton from 'embeds/chat/components/FooterIconButton'

export class ChattingFooter extends Component {
  static propTypes = {
    children: PropTypes.node.isRequired,
    endChat: PropTypes.func,
    sendChat: PropTypes.func,
    handleAttachmentDrop: PropTypes.func,
    isChatting: PropTypes.bool,
    menuVisible: PropTypes.bool,
    toggleMenu: PropTypes.func,
    attachmentsEnabled: PropTypes.bool.isRequired,
    isMobile: PropTypes.bool.isRequired
  }

  static defaultProps = {
    endChat: () => {},
    isChatting: false,
    menuVisible: false,
    toggleMenu: () => {}
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

    return (
      <ThemeProvider>
        <TooltipContainer
          placement={this.tooltipPlacement()}
          isVisible={disabled ? false : undefined}
          trigger={({ getTriggerProps, ref }) => (
            <FooterIconButton
              colorType="fill"
              {...getTriggerProps({
                ref,
                size: 'small',
                onClick: this.handleEndChatClick,
                'aria-label': altText,
                disabled: disabled
              })}
            >
              <Icon type={ICONS.END_CHAT} />
            </FooterIconButton>
          )}
        >
          {({ getTooltipProps, placement }) => (
            <TooltipView {...getTooltipProps({ placement })}>{altText}</TooltipView>
          )}
        </TooltipContainer>
      </ThemeProvider>
    )
  }

  renderAttachmentOption = () => {
    if (!this.props.attachmentsEnabled) return null

    const altText = i18n.t('embeddable_framework.chat.icon.attachments.hover.label')

    return (
      <Dropzone onDrop={this.props.handleAttachmentDrop}>
        <ThemeProvider>
          <TooltipContainer
            placement={this.tooltipPlacement()}
            isVisible={this.props.isMobile ? false : undefined}
            trigger={({ getTriggerProps, ref }) => (
              <FooterIconButton
                {...getTriggerProps({
                  ref,
                  size: 'small',
                  'aria-label': altText,
                  'data-testid': TEST_IDS.CHAT_ATTACHMENT_BUTTON
                })}
              >
                <Icon type={ICONS.PAPERCLIP_SMALL} />
              </FooterIconButton>
            )}
          >
            {({ getTooltipProps, placement }) => (
              <TooltipView {...getTooltipProps({ placement })}>{altText}</TooltipView>
            )}
          </TooltipContainer>
        </ThemeProvider>
      </Dropzone>
    )
  }

  renderSendChatOption = () => {
    return (
      <FooterIconButton
        colorType="fill"
        className={styles.iconSendChatMobile}
        onClick={this.props.sendChat}
        aria-label={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
      >
        <Icon type={ICONS.SEND_CHAT} />
      </FooterIconButton>
    )
  }

  renderDesktop = () => {
    return (
      <div>
        {this.props.children}
        <div className={styles.iconContainer} data-testid={TEST_IDS.CHAT_FOOTER_MENU_BUTTONS}>
          {this.renderEndChatOption()}
          {this.renderAttachmentOption()}
          <ChatMenu />
        </div>
      </div>
    )
  }

  renderMobile = () => {
    return (
      <div className={styles.containerMobile}>
        {this.renderAttachmentOption()}
        <div className={styles.inputContainerMobile}>{this.props.children}</div>
        {this.renderSendChatOption()}
      </div>
    )
  }

  render() {
    return this.props.isMobile ? this.renderMobile() : this.renderDesktop()
  }
}
