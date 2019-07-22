import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { ScrollContainer } from 'component/container/ScrollContainer'
import { ZendeskLogo } from 'component/ZendeskLogo'
import { Button } from '@zendeskgarden/react-buttons'
import classNames from 'classnames'
import PhoneNumber from './PhoneNumber'
import CallbackForm from 'src/embeds/talk/components/CallbackForm'

import {
  CALLBACK_ONLY_SCREEN,
  PHONE_ONLY_SCREEN,
  CALLBACK_AND_PHONE_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN
} from 'src/redux/modules/talk/talk-screen-types'
import { updateTalkCallbackForm, submitTalkCallbackForm } from 'src/redux/modules/talk'
import {
  getEmbeddableConfig,
  getAgentAvailability,
  getScreen,
  getAverageWaitTimeString,
  getFormattedPhoneNumber
} from 'src/redux/modules/talk/talk-selectors'
import { getTalkTitle } from 'src/redux/modules/selectors'
import { i18n } from 'service/i18n'
import OfflinePage from 'src/embeds/talk/pages/OfflinePage'
import PhoneOnlyPage from 'src/embeds/talk/pages/PhoneOnlyPage'

import { locals as styles } from './Talk.scss'
import SuccessNotificationPage from 'src/embeds/talk/pages/SuccessNotificationPage'

const mapStateToProps = state => {
  return {
    embeddableConfig: getEmbeddableConfig(state),
    agentAvailability: getAgentAvailability(state),
    screen: getScreen(state),
    formattedPhoneNumber: getFormattedPhoneNumber(state),
    averageWaitTime: getAverageWaitTimeString(state),
    title: getTalkTitle(state)
  }
}

class Talk extends Component {
  static propTypes = {
    isMobile: PropTypes.bool.isRequired,
    onBackClick: PropTypes.func,
    hideZendeskLogo: PropTypes.bool,
    embeddableConfig: PropTypes.object.isRequired,
    agentAvailability: PropTypes.bool.isRequired,
    screen: PropTypes.string.isRequired,
    formattedPhoneNumber: PropTypes.string.isRequired,
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

  renderPhoneNumber = () => {
    const { phoneNumber } = this.props.embeddableConfig
    const { formattedPhoneNumber } = this.props

    return <PhoneNumber phoneNumber={phoneNumber} formattedPhoneNumber={formattedPhoneNumber} />
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
        return <CallbackForm />
      case PHONE_ONLY_SCREEN:
        return <PhoneOnlyPage />
      case SUCCESS_NOTIFICATION_SCREEN:
        return <SuccessNotificationPage />
      case CALLBACK_AND_PHONE_SCREEN:
        return this.renderPhoneFormScreen()
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
    const { isMobile, screen } = this.props
    const contentClasses = isMobile ? styles.contentMobile : styles.content
    const scrollContainerClasses = classNames({
      [styles.scrollContainerSuccess]: screen === SUCCESS_NOTIFICATION_SCREEN,
      [styles.scrollContainerFullHeight]: !this.props.agentAvailability
    })

    return (
      <div>
        <ScrollContainer
          ref="scrollContainer"
          containerClasses={scrollContainerClasses}
          footerContent={this.renderFooterContent()}
          isMobile={this.props.isMobile}
          title={this.props.title}
        >
          <div className={contentClasses}>
            {this.props.agentAvailability ? this.renderContent() : <OfflinePage />}
          </div>
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
