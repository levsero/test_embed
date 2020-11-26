import React, { Component, lazy } from 'react'
import PropTypes from 'prop-types'
import { Route, Switch, Redirect } from 'react-router-dom'
import { withRouter } from 'react-router'
import { connect } from 'react-redux'

import routes from './routes'
import { CONTACT_OPTIONS } from './constants'
import { WidgetThemeProvider } from 'src/components/Widget'
import SuspensePage from 'src/components/Widget/SuspensePage'
import SuccessNotificationPage from './pages/SuccessNotificationPage'
import OfflinePage from './pages/offline/OfflinePage'
import PhoneOnlyPage from './pages/online/PhoneOnlyPage'
import CallbackOnlyPage from './pages/online/CallbackOnlyPage'
import CallbackAndPhonePage from './pages/online/CallbackAndPhonePage'
import LoadingPage from 'components/LoadingPage'
const EmbeddedVoiceTestPage = lazy(() =>
  import(/* webpackChunkName: 'lazy/talk/click_to_call' */ './pages/online/EmbeddedVoiceTestPage')
)
import {
  getAgentAvailability,
  getSocketIoVendor,
  getDeferredStatusOnline
} from 'src/redux/modules/talk/talk-selectors'
import { getCapability } from 'src/embeds/talk/selectors'
import { loadTalkVendors } from 'src/redux/modules/talk'

const onlineContactOptions = {
  [CONTACT_OPTIONS.CALLBACK_ONLY]: routes.callbackOnly(),
  [CONTACT_OPTIONS.PHONE_ONLY]: routes.phoneOnly(),
  [CONTACT_OPTIONS.CALLBACK_AND_PHONE]: routes.callbackAndPhone(),
  [CONTACT_OPTIONS.CLICK_TO_CALL]: routes.clickToCall()
}

// This component needs to be a class component since the parent WebWidget component expects to be able
// to put a ref on each embed component.
class Talk extends Component {
  componentDidMount() {
    if (!this.props.talkVendorLoaded) {
      this.props.loadTalkVendors()
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.talkIsDeferred || prevProps.talkIsDeferred) return
    if (
      prevProps.contactOption != this.props.contactOption ||
      prevProps.agentsAreAvailable != this.props.agentsAreAvailable
    ) {
      this.resetRoutes()
    }
  }

  resetRoutes() {
    this.props.history.replace(routes.home())
  }

  render() {
    const { agentsAreAvailable, contactOption, talkIsDeferred } = this.props

    if (talkIsDeferred) {
      return <LoadingPage />
    }

    return (
      <WidgetThemeProvider>
        <SuspensePage>
          <Switch>
            <Route path={routes.successNotification()} component={SuccessNotificationPage} />

            <Route path={routes.online()}>
              <Switch>
                <Route path={routes.callbackOnly()} component={CallbackOnlyPage} />
                <Route path={routes.phoneOnly()} component={PhoneOnlyPage} />
                <Route path={routes.callbackAndPhone()} component={CallbackAndPhonePage} />
                <Route path={routes.clickToCall()} component={EmbeddedVoiceTestPage} />

                <Redirect to={onlineContactOptions[contactOption]} />
              </Switch>
            </Route>

            <Route path={routes.offline()}>
              <Route component={OfflinePage} />
            </Route>

            <Redirect to={agentsAreAvailable ? routes.online() : routes.offline()} />
          </Switch>
        </SuspensePage>
      </WidgetThemeProvider>
    )
  }
}

Talk.propTypes = {
  agentsAreAvailable: PropTypes.bool.isRequired,
  contactOption: PropTypes.oneOf(Object.values(CONTACT_OPTIONS)).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired
  }),
  loadTalkVendors: PropTypes.func.isRequired,
  talkVendorLoaded: PropTypes.bool.isRequired,
  talkIsDeferred: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
  agentsAreAvailable: getAgentAvailability(state),
  contactOption: getCapability(state),
  talkVendorLoaded: !!getSocketIoVendor(state),
  talkIsDeferred: getDeferredStatusOnline(state)
})

const actionCreators = {
  loadTalkVendors
}

const connectedComponent = connect(
  mapStateToProps,
  actionCreators,
  null,
  { forwardRef: true }
)(withRouter(Talk))

export { connectedComponent as default, Talk as Component }
