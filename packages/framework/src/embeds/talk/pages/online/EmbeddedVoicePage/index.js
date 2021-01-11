import React, { useRef } from 'react'
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
import { getUserRecordingConsentRequirement } from 'embeds/talk/selectors'
import { unmuteMicrophone, startCallCounter, stopCallCounter } from 'src/embeds/talk/actions'

const clickToCallHome = () => routes.clickToCallPermissions()

const EmbeddedVoicePage = () => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const history = useHistory()
  const disconnectTimeout = useRef(null)

  const userRecordingConsentRequirement = useSelector(getUserRecordingConsentRequirement)

  const skipConsent = userRecordingConsentRequirement === null

  const onConnect = () => {
    history.replace(routes.clickToCallInProgress())
    dispatch(startCallCounter())
  }

  const onDisconnect = () => {
    dispatch(unmuteMicrophone())
    dispatch(stopCallCounter())
    disconnectTimeout.current = setTimeout(() => {
      history.replace(clickToCallHome())
    }, 3000)
  }

  const onError = error => {
    dispatch(stopCallCounter())
    dispatch(unmuteMicrophone())
    switch (error.code) {
      case microphoneErrorCode:
        dispatch(talkDisconnect())
        break
      default:
        history.replace(routes.clickToCallNetworkError())
    }
  }

  const onUnsupported = () => {
    dispatch(talkDisconnect())
  }

  const onPermissionsGiven = () => {
    history.replace(routes.clickToCallConsent())
  }

  const { startCall, muteClick, endCall, isInCall } = useTwilioDevice({
    onConnect,
    onDisconnect,
    onError,
    onUnsupported
  })

  const handleCallStart = () => {
    if (!isInCall()) {
      startCall()
    }
  }

  return (
    <Widget>
      <Header
        title={translate('embeddable_framework.talk.clickToCall.header.title')}
        useReactRouter={history.length > 1}
        showBackButton={history.location.pathname !== routes.clickToCallInProgress()}
      />
      <Main>
        <Switch>
          <Route path={routes.clickToCallInProgress()}>
            <CallInProgress
              onEndCallClicked={endCall}
              onMuteClick={muteClick}
              isCallActive={isInCall()}
            />
          </Route>
          <Route path={clickToCallHome()}>
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
            <NetworkError onClick={startCall} />
          </Route>

          <Redirect to={clickToCallHome()} />
        </Switch>
      </Main>
      <Footer />
    </Widget>
  )
}

EmbeddedVoicePage.propTypes = {}

export default EmbeddedVoicePage
