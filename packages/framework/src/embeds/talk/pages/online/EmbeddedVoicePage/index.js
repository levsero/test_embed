import { useRef } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import routes from 'src/embeds/talk/routes'
import MicrophonePermissions from './MicrophonePermissions'
import ConsentToRecord from './ConsentToRecord'
import CallInProgress from './CallInProgress'
import NetworkError from './NetworkError'
import { microphoneErrorCode, useTwilioDevice } from 'src/embeds/talk/hooks/useTwilioDevice'
import { talkDisconnect } from 'src/redux/modules/talk/talk-actions'
import {
  getUserRecordingConsentRequirement,
  getIsCallInProgress,
  getHasLastCallFailed,
} from 'embeds/talk/selectors'
import {
  unmuteMicrophone,
  callStarted,
  callEnded,
  callFailed,
  resetCallFailed,
} from 'src/embeds/talk/actions'

const EmbeddedVoicePage = () => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const history = useHistory()
  const callEndedTimeout = useRef(null)
  const userRecordingConsentRequirement = useSelector(getUserRecordingConsentRequirement)
  const isCallInProgress = useSelector(getIsCallInProgress)
  const hasLastCallFailed = useSelector(getHasLastCallFailed)
  const skipConsent = userRecordingConsentRequirement === null

  const onConnect = () => {
    dispatch(unmuteMicrophone())
    history.replace(routes.clickToCallInProgress())
    dispatch(callStarted())
  }

  const onDisconnect = () => {
    dispatch(callEnded())
    if (!callEndedTimeout.current) {
      callEndedTimeout.current = setTimeout(() => {
        history.replace(routes.home())
      }, 3000)
    }
  }

  const onError = (error) => {
    if (error?.code === microphoneErrorCode) {
      dispatch(talkDisconnect())
      return
    }
    dispatch(callFailed())
    endTwilioConnection()
  }

  const onUnsupported = () => {
    dispatch(talkDisconnect())
  }

  const onPermissionsGiven = () => {
    history.replace(routes.clickToCallConsent())
  }

  const { startTwilioConnection, muteClick, endTwilioConnection } = useTwilioDevice({
    onConnect,
    onDisconnect,
    onError,
    onUnsupported,
  })

  const handleCallStart = () => {
    if (!isCallInProgress) {
      startTwilioConnection()
    }
  }

  const handleErrorReset = () => {
    dispatch(resetCallFailed())
    history.replace(routes.home())
  }

  const getPathWithRedirect = () => {
    if (hasLastCallFailed) return routes.clickToCallNetworkError()
    if (isCallInProgress) return routes.clickToCallInProgress()
    return routes.clickToCallPermissions()
  }

  return (
    <Widget>
      <Header
        title={translate('embeddable_framework.talk.embeddedVoice.header.title')}
        useReactRouter={history.length > 1}
        showBackButton={history.location.pathname !== routes.clickToCallInProgress()}
      />
      <Main>
        <Switch>
          <Route path={routes.clickToCallInProgress()}>
            <CallInProgress
              onEndCallClicked={endTwilioConnection}
              onMuteClick={muteClick}
              isCallInProgress={isCallInProgress}
              hasLastCallFailed={hasLastCallFailed}
            />
          </Route>
          <Route path={routes.clickToCallPermissions()}>
            <MicrophonePermissions
              onStartCallClicked={handleCallStart}
              showStartCallButton={skipConsent}
              onPermissionsGiven={onPermissionsGiven}
            />
          </Route>
          <Route path={routes.clickToCallConsent()}>
            <ConsentToRecord onStartCallClicked={handleCallStart} />
          </Route>
          <Route path={routes.clickToCallNetworkError()}>
            <NetworkError onClick={handleErrorReset} />
          </Route>

          <Redirect to={getPathWithRedirect()} />
        </Switch>
      </Main>
      <Footer />
    </Widget>
  )
}

export default EmbeddedVoicePage
