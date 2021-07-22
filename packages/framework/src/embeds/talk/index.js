import PropTypes from 'prop-types'
import { Component, lazy } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Route, Switch, Redirect } from 'react-router-dom'
import LoadingPage from 'components/LoadingPage'
import { WidgetThemeProvider } from 'src/components/Widget'
import SuspensePage from 'src/components/Widget/SuspensePage'
import { getCapability, getIsCallInProgress } from 'src/embeds/talk/selectors'
import { loadTalkVendors } from 'src/redux/modules/talk'
import {
  getAgentAvailability,
  getSocketIoVendor,
  getDeferredStatusOnline,
} from 'src/redux/modules/talk/talk-selectors'
import { CONTACT_OPTIONS } from './constants'
import SuccessNotificationPage from './pages/SuccessNotificationPage'
import OfflinePage from './pages/offline/OfflinePage'
import CallbackAndPhonePage from './pages/online/CallbackAndPhonePage'
import CallbackOnlyPage from './pages/online/CallbackOnlyPage'
import PhoneOnlyPage from './pages/online/PhoneOnlyPage'
import routes from './routes'

const EmbeddedVoicePage = lazy(() =>
  import(/* webpackChunkName: 'lazy/talk/click_to_call' */ './pages/online/EmbeddedVoicePage')
)

const onlineContactOptions = {
  [CONTACT_OPTIONS.CALLBACK_ONLY]: routes.callbackOnly(),
  [CONTACT_OPTIONS.PHONE_ONLY]: routes.phoneOnly(),
  [CONTACT_OPTIONS.CALLBACK_AND_PHONE]: routes.callbackAndPhone(),
  [CONTACT_OPTIONS.CLICK_TO_CALL]: routes.clickToCall(),
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
      prevProps.hasAvailableAgents != this.props.hasAvailableAgents
    ) {
      this.resetRoutes()
    }
  }

  resetRoutes() {
    this.props.history.replace(routes.home())
  }

  render() {
    const {
      hasAvailableAgents,
      contactOption,
      talkIsDeferred,
      isEmbeddedVoiceCallInProgress,
    } = this.props

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
                <Route path={routes.clickToCall()} component={EmbeddedVoicePage} />

                <Redirect to={onlineContactOptions[contactOption]} />
              </Switch>
            </Route>

            <Route path={routes.offline()}>
              <Route component={OfflinePage} />
            </Route>

            <Redirect
              to={
                hasAvailableAgents || isEmbeddedVoiceCallInProgress
                  ? routes.online()
                  : routes.offline()
              }
            />
          </Switch>
        </SuspensePage>
      </WidgetThemeProvider>
    )
  }
}

Talk.propTypes = {
  hasAvailableAgents: PropTypes.bool.isRequired,
  isEmbeddedVoiceCallInProgress: PropTypes.bool.isRequired,
  contactOption: PropTypes.oneOf(Object.values(CONTACT_OPTIONS)).isRequired,
  history: PropTypes.shape({
    replace: PropTypes.func.isRequired,
  }),
  loadTalkVendors: PropTypes.func.isRequired,
  talkVendorLoaded: PropTypes.bool.isRequired,
  talkIsDeferred: PropTypes.bool.isRequired,
}

const mapStateToProps = (state) => ({
  hasAvailableAgents: getAgentAvailability(state),
  isEmbeddedVoiceCallInProgress: getIsCallInProgress(state),
  contactOption: getCapability(state),
  talkVendorLoaded: !!getSocketIoVendor(state),
  talkIsDeferred: getDeferredStatusOnline(state),
})

const actionCreators = {
  loadTalkVendors,
}

const connectedComponent = connect(mapStateToProps, actionCreators, null, { forwardRef: true })(
  withRouter(Talk)
)

export { connectedComponent as default, Talk as Component }
