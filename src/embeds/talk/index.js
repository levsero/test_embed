import React, { Component, lazy } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

import routes from './routes'
import { WidgetThemeProvider } from 'src/components/Widget'
import { CONTACT_OPTIONS } from './constants'
import SuccessNotificationPage from './pages/SuccessNotificationPage'
import CallbackPage from './pages/CallbackPage'
import OfflinePage from './pages/OfflinePage'
import PhoneOnlyPage from './pages/PhoneOnlyPage'
const ClickToCallPage = lazy(() =>
  import(/* webpackChunkName: 'lazy/talk/click_to_call' */ './pages/ClickToCallPage')
)
import { getAgentAvailability, getCapability } from 'src/redux/modules/talk/talk-selectors'
import SuspensePage from 'src/components/Widget/SuspensePage'

const agentOnlineRoutes = {
  [CONTACT_OPTIONS.CALLBACK_ONLY]: routes.callbackOnly(),
  [CONTACT_OPTIONS.CALLBACK_AND_PHONE]: routes.callbackAndPhone(),
  [CONTACT_OPTIONS.PHONE_ONLY]: routes.phoneOnly(),
  [CONTACT_OPTIONS.CLICK_TO_CALL]: routes.clickToCall()
}

// This component needs to be a class component since the parent WebWidget component expects to be able
// to put a ref on each embed component.
class Talk extends Component {
  render() {
    const { agentAvailability, contactOption } = this.props
    let redirectToPath = agentAvailability ? agentOnlineRoutes[contactOption] : routes.offline()

    return (
      <WidgetThemeProvider>
        <SuspensePage>
          <Switch>
            <Route path={routes.offline()} component={OfflinePage} />
            <Route path={routes.successNotification()} component={SuccessNotificationPage} />

            <Route path={routes.callbackOnly()} component={CallbackPage} />
            <Route path={routes.phoneOnly()} component={PhoneOnlyPage} />
            <Route path={routes.callbackAndPhone()} component={CallbackPage} />
            <Route path={routes.clickToCall()} component={ClickToCallPage} />

            <Redirect from="/" to={redirectToPath} />
          </Switch>
        </SuspensePage>
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
)(Talk)

export { connectedComponent as default, Talk as Component }
