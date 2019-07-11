import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { locals as styles } from './ChannelChoiceMobile.scss'

import { ChannelChoicePopupMobile } from 'component/channelChoice/ChannelChoicePopupMobile'
import { ScrollContainer } from 'component/container/ScrollContainer'
import { i18n } from 'service/i18n'

export class ChannelChoiceMobile extends Component {
  static propTypes = {
    handleNextClick: PropTypes.func.isRequired,
    formTitleKey: PropTypes.string.isRequired,
    chatAvailable: PropTypes.bool.isRequired,
    callbackEnabled: PropTypes.bool.isRequired,
    talkOnline: PropTypes.bool.isRequired,
    submitTicketAvailable: PropTypes.bool,
    chatEnabled: PropTypes.bool,
    chatOfflineAvailable: PropTypes.bool.isRequired
  }

  static defaultProps = {
    talkOnline: false,
    submitTicketAvailable: true,
    chatEnabled: false
  }

  render = () => {
    const {
      handleNextClick,
      chatAvailable,
      formTitleKey,
      talkOnline,
      callbackEnabled,
      chatOfflineAvailable
    } = this.props

    return (
      <ScrollContainer
        hideZendeskLogo={true}
        fullscreen={true}
        isMobile={true}
        containerClasses={styles.newContainer}
        title={i18n.t(`embeddable_framework.helpCenter.form.title.${formTitleKey}`)}
      >
        <ChannelChoicePopupMobile
          submitTicketAvailable={this.props.submitTicketAvailable}
          chatEnabled={this.props.chatEnabled}
          chatAvailable={chatAvailable}
          onNextClick={handleNextClick}
          className={styles.container}
          callbackEnabled={callbackEnabled}
          talkOnline={talkOnline}
          chatOfflineAvailable={chatOfflineAvailable}
        />
      </ScrollContainer>
    )
  }
}
