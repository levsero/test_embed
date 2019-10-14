import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { hot } from 'react-hot-loader/root'
import { Route, Switch } from 'react-router-dom'
import { connect } from 'react-redux'

import { WidgetThemeProvider } from 'src/components/Widget'
import { CONTACT_OPTIONS } from './constants'
import CallbackPage from './pages/CallbackPage'
import OfflinePage from './pages/OfflinePage'
import PhoneOnlyPage from './pages/PhoneOnlyPage'
import SuccessNotificationPage from './pages/SuccessNotificationPage'
import { getAgentAvailability, getCapability } from 'src/redux/modules/talk/talk-selectors'

const ROUTES = {
  [CONTACT_OPTIONS.CALLBACK_ONLY]: CallbackPage,
  [CONTACT_OPTIONS.CALLBACK_AND_PHONE]: CallbackPage,
  [CONTACT_OPTIONS.PHONE_ONLY]: PhoneOnlyPage
}

// This component needs to be a class component since the parent WebWidget component expects to be able
// to put a ref on each embed component.
class Talk extends Component {
  render() {
    const { agentAvailability, contactOption } = this.props

    const IndexPage = agentAvailability ? ROUTES[contactOption] : OfflinePage

    return (
      <WidgetThemeProvider>
        <Switch>
          <Route path={'/talk/success'} component={SuccessNotificationPage} />
          <Route component={IndexPage} />
        </Switch>
      </WidgetThemeProvider>
    )
  }
}

Talk.propTypes = {
  agentAvailability: PropTypes.bool.isRequired,
  contactOption: PropTypes.oneOf(Object.values(CONTACT_OPTIONS)).isRequired
}

const mapStateToProps = state => ({
  agentAvailability: getAgentAvailability(state),
  contactOption: getCapability(state)
})

const connectedComponent = connect(
  mapStateToProps,
  { forwardRef: true }
)(hot(Talk))

export { connectedComponent as default, Talk as Component }
