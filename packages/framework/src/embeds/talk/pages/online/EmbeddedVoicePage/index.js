import React, { useRef } from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import routes from 'src/embeds/talk/routes'
import MicrophonePermissions from './MicrophonePermissions'
import ConsentToRecord from './ConsentToRecord'
import CallInProgress from './CallInProgress'
import { microphoneErrorCode, useTwilioDevice } from 'src/embeds/talk/hooks/useTwilioDevice'
import { talkDisconnect } from 'src/redux/modules/talk/talk-actions'
import { getUserRecordingConsentRequirement } from 'embeds/talk/selectors'
import { unmuteMicrophone } from 'src/embeds/talk/actions'

const clickToCallPath = () => {
  return routes.clickToCallPermissions()
}

// Temp hardcoded function to be replaced once Talk endpoints are ready

const EmbeddedVoicePage = () => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const history = useHistory()
  const disconnectTimeout = useRef(null)

  const userRecordingConsentRequirement = useSelector(getUserRecordingConsentRequirement)

  const skipConsent = userRecordingConsentRequirement === null

  const onConnect = () => {
    history.replace(routes.clickToCallInProgress())
  }

  const onDisconnect = () => {
    dispatch(unmuteMicrophone())
    disconnectTimeout.current = setTimeout(() => {
      history.replace(clickToCallPath())
    }, 3000)
  }

  const onError = error => {
    dispatch(unmuteMicrophone())
    if (error?.code === microphoneErrorCode) {
      dispatch(talkDisconnect())
      return
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
              callDuration={'0.00'}
              onMuteClick={muteClick}
              isCallActive={isInCall()}
            />
          </Route>
          <Route path={routes.clickToCallPermissions()}>
            <MicrophonePermissions
              onStartCallClicked={() => startCall()}
              showStartCallButton={skipConsent}
              onPermissionsGiven={onPermissionsGiven}
            />
          </Route>
          <Route path={routes.clickToCallConsent()}>
            <ConsentToRecord onStartCallClicked={() => startCall()} />
          </Route>

          <Redirect to={clickToCallPath()} />
        </Switch>
      </Main>
      <Footer />
    </Widget>
  )
}

EmbeddedVoicePage.propTypes = {}

export default EmbeddedVoicePage
