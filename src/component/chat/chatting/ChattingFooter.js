import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './ChattingFooter.scss'
import classNames from 'classnames'

import { i18n } from 'service/i18n'
import { Dropzone } from 'component/Dropzone'

import { IconButton } from '@zendeskgarden/react-buttons'
import { ThemeProvider } from '@zendeskgarden/react-theming'
import { TooltipContainer, TooltipView } from '@zendeskgarden/react-tooltips'
import { Icon } from 'component/Icon'

import { ICONS } from 'constants/shared'

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
    sendChat: () => {},
    handleAttachmentDrop: () => {},
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
    const endChatClasses = classNames(styles.iconEndChat, {
      [styles.iconDisabled]: disabled
    })
    const visibility = disabled ? { isVisible: false } : {}
    const altText = i18n.t('embeddable_framework.chat.icon.endChat.hover.label')

    return (
      <ThemeProvider>
        <TooltipContainer
          placement={this.tooltipPlacement()}
          {...visibility}
          trigger={({ getTriggerProps, ref }) => (
            <IconButton
              {...getTriggerProps({
                ref,
                size: 'small',
                className: endChatClasses,
                onClick: this.handleEndChatClick,
                'aria-label': altText,
                disabled: disabled
              })}
            >
              <Icon type={ICONS.END_CHAT} />
            </IconButton>
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

    const attachmentClasses = classNames(styles.iconAttachment, {
      [styles.iconAttachmentMobile]: this.props.isMobile
    })

    const visibility = this.props.isMobile ? { isVisible: false } : {}
    const altText = i18n.t('embeddable_framework.chat.icon.attachments.hover.label')

    return (
      <Dropzone onDrop={this.props.handleAttachmentDrop}>
        <ThemeProvider>
          <TooltipContainer
            placement={this.tooltipPlacement()}
            {...visibility}
            trigger={({ getTriggerProps, ref }) => (
              <IconButton
                {...getTriggerProps({
                  ref,
                  size: 'small',
                  className: attachmentClasses,
                  'aria-label': altText
                })}
              >
                <Icon type={ICONS.PAPERCLIP_SMALL} />
              </IconButton>
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

  renderMenuOption = () => {
    const menuClasses = classNames(styles.iconMenu, {
      [styles.iconActive]: this.props.menuVisible
    })

    const visibility = this.props.menuVisible ? { isVisible: false } : {}
    const altText = i18n.t('embeddable_framework.chat.icon.menu.hover.label')

    return (
      <ThemeProvider>
        <TooltipContainer
          placement={this.tooltipPlacement()}
          {...visibility}
          trigger={({ getTriggerProps, ref }) => (
            <IconButton
              {...getTriggerProps({
                ref,
                size: 'small',
                className: menuClasses,
                onClick: this.handleMenuClick,
                'aria-label': altText
              })}
            >
              <Icon type={ICONS.ELLIPSIS} />
            </IconButton>
          )}
        >
          {({ getTooltipProps, placement }) => (
            <TooltipView {...getTooltipProps({ placement })}>{altText}</TooltipView>
          )}
        </TooltipContainer>
      </ThemeProvider>
    )
  }

  renderSendChatOption = () => {
    return (
      <IconButton
        size="small"
        className={styles.iconSendChatMobile}
        onClick={this.props.sendChat}
        aria-label={i18n.t('embeddable_framework.submitTicket.form.submitButton.label.send')}
      >
        <Icon type={ICONS.SEND_CHAT} />
      </IconButton>
    )
  }

  renderDesktop = () => {
    return (
      <div>
        {this.props.children}
        <div className={styles.iconContainer}>
          {this.renderEndChatOption()}
          {this.renderAttachmentOption()}
          {this.renderMenuOption()}
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
