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
import { unmuteMicrophone, startCall, endCall, failCall } from 'src/embeds/talk/actions'

const clickToCallPath = () => routes.clickToCallPermissions()

const EmbeddedVoicePage = () => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const history = useHistory()
  const disconnectTimeout = useRef(null)
  const hasCallFailed = useRef(false)

  const userRecordingConsentRequirement = useSelector(getUserRecordingConsentRequirement)

  const skipConsent = userRecordingConsentRequirement === null

  const createTimeout = () => {
    if (!disconnectTimeout.current) {
      disconnectTimeout.current = setTimeout(() => {
        history.replace(clickToCallPath())
      }, 3000)
    }
  }

  const createErrorTimeout = () => {
    if (!disconnectTimeout.current) {
      disconnectTimeout.current = setTimeout(() => {
        history.replace(routes.clickToCallNetworkError())
      }, 3000)
    }
  }

  const onConnect = () => {
    history.replace(routes.clickToCallInProgress())
    hasCallFailed.current = false
    dispatch(startCall())
  }

  const onDisconnect = () => {
    dispatch(unmuteMicrophone())

    if (!hasCallFailed.current) {
      createTimeout()
      dispatch(endCall())
    }
  }

  const handleCallError = () => {
    dispatch(failCall())
    hasCallFailed.current = true
    if (history.location.pathname === routes.clickToCallInProgress()) {
      createErrorTimeout()
    } else {
      history.replace(routes.clickToCallNetworkError())
    }
  }

  const onError = error => {
    dispatch(unmuteMicrophone())
    switch (error.code) {
      case microphoneErrorCode:
        dispatch(talkDisconnect())
        break
      default:
        handleCallError()
    }
  }

  const onUnsupported = () => {
    dispatch(talkDisconnect())
  }

  const onPermissionsGiven = () => {
    history.replace(routes.clickToCallConsent())
  }

  const { startTwilioConnection, muteClick, endTwilioConnection, isInCall } = useTwilioDevice({
    onConnect,
    onDisconnect,
    onError,
    onUnsupported
  })

  const handleCallStart = () => {
    if (!isInCall()) {
      startTwilioConnection()
    }
  }

  const getPathWithRedirect = () => {
    if (hasCallFailed.current) {
      return routes.clickToCallNetworkError()
    }
    return clickToCallPath()
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
              isCallActive={isInCall()}
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
            <NetworkError onClick={handleCallStart} />
          </Route>

          <Redirect to={getPathWithRedirect()} />
        </Switch>
      </Main>
      <Footer />
    </Widget>
  )
}

export default EmbeddedVoicePage
