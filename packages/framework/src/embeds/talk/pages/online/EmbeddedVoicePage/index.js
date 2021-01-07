import React from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import logger from 'src/util/logger'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import routes from 'src/embeds/talk/routes'
import MicrophonePermissions from './MicrophonePermissions'
import ConsentToRecord from './ConsentToRecord'
import CallInProgress from './CallInProgress'
import { microphoneErrorCode, useTwilioDevice } from 'src/embeds/talk/hooks/useTwilioDevice'
import { talkDisconnect } from 'src/redux/modules/talk/talk-actions'
import { getUserRecordingConsentRequirement } from 'embeds/talk/selectors'

const clickToCallPath = () => {
  return routes.clickToCallPermissions()
}

// Temp hardcoded function to be replaced once Talk endpoints are ready

const EmbeddedVoicePage = () => {
  const dispatch = useDispatch()
  const translate = useTranslate()
  const history = useHistory()

  const userRecordingConsentRequirement = useSelector(getUserRecordingConsentRequirement)

  const skipConsent = userRecordingConsentRequirement === null

  const onConnect = () => {
    logger.log('Successfully established call!')
    history.push(routes.clickToCallInProgress())
  }
  const onDisconnect = () => {
    logger.log('Disconnected')
    history.goBack()
  }

  const onError = error => {
    if (error?.code === microphoneErrorCode) {
      dispatch(talkDisconnect())
      return
    }
    logger.error('Twilio Device error:', error.message)
  }

  const onReady = () => {
    logger.log('Ready')
  }

  const onUnsupported = () => {
    logger.log('WebRTC unsupported, aborting')
    dispatch(talkDisconnect())
  }

  const onAccept = event => {
    logger.log('Twilio agent accepted:', event)
  }

  const { startCall, muteClick, endCall } = useTwilioDevice({
    onConnect,
    onDisconnect,
    onError,
    onUnsupported,
    onReady,
    onAccept
  })

  return (
    <Widget>
      <Header
        title={translate('embeddable_framework.talk.clickToCall.header.title')}
        useReactRouter={true}
      />
      <Main>
        <Switch>
          <Route path={routes.clickToCallInProgress()}>
            <CallInProgress
              onEndCallClicked={endCall}
              callDuration={'0.00'}
              onMuteClick={muteClick}
            />
          </Route>
          <Route path={routes.clickToCallPermissions()}>
            <MicrophonePermissions
              onStartCallClicked={() => startCall()}
              showStartCallButton={skipConsent}
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
