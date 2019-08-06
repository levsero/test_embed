import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import {
  CALLBACK_SCREEN,
  PHONE_US_SCREEN,
  SUCCESS_NOTIFICATION_SCREEN
} from 'src/redux/modules/talk/talk-screen-types'
import { updateTalkCallbackForm, submitTalkCallbackForm } from 'src/redux/modules/talk'
import { getAgentAvailability, getScreen } from 'src/redux/modules/talk/talk-selectors'
import { getTalkTitle } from 'src/redux/modules/selectors'
import OfflinePage from 'src/embeds/talk/pages/OfflinePage'
import PhoneOnlyPage from 'src/embeds/talk/pages/PhoneOnlyPage'
import CallbackPage from 'src/embeds/talk/pages/CallbackPage'

import SuccessNotificationPage from 'src/embeds/talk/pages/SuccessNotificationPage'
import { hot } from 'react-hot-loader/root'

const mapStateToProps = state => {
  return {
    agentAvailability: getAgentAvailability(state),
    screen: getScreen(state),
    title: getTalkTitle(state)
  }
}

class Talk extends Component {
  static propTypes = {
    onBackClick: PropTypes.func,
    agentAvailability: PropTypes.bool.isRequired,
    screen: PropTypes.string.isRequired
  }

  static defaultProps = {
    hideZendeskLogo: false,
    onBackClick: () => {},
    agentAvailability: true
  }

  render = () => {
    const { screen, agentAvailability, onBackClick } = this.props

    if (!agentAvailability) {
      return <OfflinePage />
    }

    if (screen === PHONE_US_SCREEN) {
      return <PhoneOnlyPage />
    } else if (screen === SUCCESS_NOTIFICATION_SCREEN) {
      return <SuccessNotificationPage onBackClick={onBackClick} />
    } else if (screen === CALLBACK_SCREEN) {
      return <CallbackPage />
    }
    return null
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
)(hot(Talk))
