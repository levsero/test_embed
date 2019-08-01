import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ScrollContainer } from 'component/container/ScrollContainer'
import { ZendeskLogo } from 'component/ZendeskLogo'
import { Button } from '@zendeskgarden/react-buttons'
import classNames from 'classnames'
import CallbackForm from 'src/embeds/talk/components/CallbackForm'

import {
  CALLBACK_ONLY_SCREEN,
  PHONE_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN
} from 'src/redux/modules/talk/talk-screen-types'
import { updateTalkCallbackForm, submitTalkCallbackForm } from 'src/redux/modules/talk'
import {
  getAgentAvailability,
  getScreen,
  getAverageWaitTimeString
} from 'src/redux/modules/talk/talk-selectors'
import { getTalkTitle } from 'src/redux/modules/selectors'
import { i18n } from 'service/i18n'
import OfflinePage from 'src/embeds/talk/pages/OfflinePage'
import PhoneOnlyPage from 'src/embeds/talk/pages/PhoneOnlyPage'
import CallbackPage from 'src/embeds/talk/pages/CallbackPage'

import { locals as styles } from './Talk.scss'
import SuccessNotificationPage from 'src/embeds/talk/pages/SuccessNotificationPage'
import CallbackPhonePage from 'src/embeds/talk/pages/CallbackPhonePage'

const mapStateToProps = state => {
  return {
    agentAvailability: getAgentAvailability(state),
    screen: getScreen(state),
    averageWaitTime: getAverageWaitTimeString(state),
    title: getTalkTitle(state)
  }
}

class Talk extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    onBackClick: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    agentAvailability: PropTypes.bool.isRequired,
    screen: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired
  }

  static defaultProps = {
    hideZendeskLogo: false,
    onBackClick: () => {},
    agentAvailability: true
  }

  constructor() {
    super()
    this.form = null
  }

  renderPhoneFormScreen = () => {
    const phoneLabel = i18n.t('embeddable_framework.talk.form.phoneDisplay')

    return (
      <div>
        <div className={styles.phoneDisplayLabel}>
          {phoneLabel} {this.renderPhoneNumber()}
        </div>
        <CallbackForm />
      </div>
    )
  }

  renderContent = () => {
    if (!this.props.agentAvailability) return null

    switch (this.props.screen) {
      case CALLBACK_ONLY_SCREEN:
        return <CallbackPage />
      case SUCCESS_NOTIFICATION_SCREEN:
        return <SuccessNotificationPage />
      case CALLBACK_AND_PHONE_SCREEN:
        return <CallbackPhonePage />
      default:
        return null
    }
  }

  renderZendeskLogo = () => {
    if (this.props.hideZendeskLogo || this.props.isMobile) return

    return <ZendeskLogo fullscreen={false} />
  }

  renderFooterContent = () => {
    if (this.props.screen !== SUCCESS_NOTIFICATION_SCREEN) {
      return null
    }

    const buttonContainer = classNames({
      [styles.zendeskLogoButton]: !(this.props.hideZendeskLogo || this.props.isMobile),
      [styles.noZendeskLogoButton]: this.props.hideZendeskLogo || this.props.isMobile
    })

    return (
      <div className={buttonContainer}>
        <Button primary={true} className={styles.button} onClick={this.props.onBackClick}>
          {i18n.t('embeddable_framework.common.button.done')}
        </Button>
      </div>
    )
  }

  render = () => {
    const { isMobile, screen, agentAvailability } = this.props
    const contentClasses = isMobile ? styles.contentMobile : styles.content
    const scrollContainerClasses = classNames({
      [styles.scrollContainerSuccess]: screen === SUCCESS_NOTIFICATION_SCREEN,
      [styles.scrollContainerFullHeight]: !this.props.agentAvailability
    })

    if (!agentAvailability) {
      return <OfflinePage />
    }

    if (screen === PHONE_ONLY_SCREEN) {
      return <PhoneOnlyPage />
    }

    return (
      <div>
        <ScrollContainer
          ref="scrollContainer"
          containerClasses={scrollContainerClasses}
          footerContent={this.renderFooterContent()}
          isMobile={this.props.isMobile}
          title={this.props.title}
        >
          <div className={contentClasses}>{this.renderContent()}</div>
        </ScrollContainer>
        {this.renderZendeskLogo()}
      </div>
    )
  }
}

const actionCreators = {
  updateTalkCallbackForm,
  submitTalkCallbackForm
}

export { Talk as Component }
export default connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(Talk)
