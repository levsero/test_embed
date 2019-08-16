import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './ChannelChoiceContainer.scss'

import ChannelChoiceMenu from 'component/channelChoice/ChannelChoiceMenu'
import { ScrollContainer } from 'component/container/ScrollContainer'
import { ZendeskLogo } from 'component/ZendeskLogo'
import { i18n } from 'service/i18n'

export default class ChannelChoiceContainer extends Component {
  static propTypes = {
    isMobile: PropTypes.bool,
    chatAvailable: PropTypes.bool.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    handleNextClick: PropTypes.func.isRequired,
    hideZendeskLogo: PropTypes.bool,
    callbackEnabled: PropTypes.bool.isRequired,
    talkOnline: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool
  }

  static defaultProps = {
    hideZendeskLogo: false,
    talkOnline: false,
    submitTicketAvailable: true,
    chatEnabled: false,
    isMobile: false
  }

  hideLogo = () => this.props.hideZendeskLogo || this.props.isMobile

  renderZendeskLogo = () => {
    if (this.hideLogo()) return null

    return <ZendeskLogo fullscreen={false} />
  }

  renderBody = () => {
    const {
      chatAvailable,
      handleNextClick,
      talkOnline,
      callbackEnabled,
      chatOfflineAvailable,
      submitTicketAvailable,
      isMobile
    } = this.props
    const containerStyle = !this.hideLogo() ? styles.inner : ''

    return (
      <div className={containerStyle}>
        <ChannelChoiceMenu
          isMobile={isMobile}
          submitTicketAvailable={submitTicketAvailable}
          chatEnabled={this.props.chatEnabled}
          callbackEnabled={callbackEnabled}
          talkOnline={talkOnline}
          onNextClick={handleNextClick}
          chatOfflineAvailable={chatOfflineAvailable}
          chatAvailable={chatAvailable}
        />
      </div>
    )
  }

  render = () => {
    const { formTitleKey } = this.props
    const footerClasses = this.hideLogo() ? styles.footerNoLogo : ''

    return (
      <div>
        <ScrollContainer
          ref="scrollContainer"
          containerClasses={styles.newChannelChoiceContainer}
          footerClasses={footerClasses}
          title={i18n.t(`embeddable_framework.helpCenter.form.title.${formTitleKey}`)}
        >
          {this.renderBody()}
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    )
  }
}
