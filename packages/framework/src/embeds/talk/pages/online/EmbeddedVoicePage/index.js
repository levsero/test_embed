import React from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'

import useTranslate from 'src/hooks/useTranslate'
import logger from 'src/util/logger'
import { Widget, Header, Main, Footer } from 'src/components/Widget'
import routes from 'src/embeds/talk/routes'
import MicrophonePermissions from './MicrophonePermissions'
import ConsentToRecord from './ConsentToRecord'
import EmbeddedVoiceCallInProgressPage from 'src/embeds/talk/pages/online/EmbeddedVoiceCallInProgressPage'
import { endCall, muteClick, startCall } from 'src/embeds/talk/utils/twilioDevice'
import { getTalkNickname, getTalkServiceUrl } from 'src/redux/modules/selectors'
import { getZendeskHost } from 'utility/globals'

const clickToCallPath = () => {
  return routes.clickToCallPermissions()
}

// Temp hardcoded function to be replaced once Talk endpoints are ready

const EmbeddedVoicePage = () => {
  const translate = useTranslate()
  const history = useHistory()
  const serviceUrl = useSelector(getTalkServiceUrl)
  const nickname = useSelector(getTalkNickname)
  const subdomain = getZendeskHost(document).split('.')[0]

  const onConnect = () => {
    logger.log('Successfully established call!')
    history.push(routes.clickToCallInProgress())
  }
  const onDisconnect = () => {
    logger.log('Disconnected')
    history.push(routes.clickToCallConsent())
  }

  const onError = error => {
    logger.error('Twilio Device error:', error.message)
  }

  const onReady = () => {
    logger.log('Twilio.Device is now ready for connections')
  }

  const onAccept = event => {
    logger.log('Twilio agent accepted:', event)
  }

  return (
    <Widget>
      <Header
        title={translate('embeddable_framework.talk.clickToCall.header.title')}
        useReactRouter={true}
      />
      <Main>
        <Switch>
          <Route path={routes.clickToCallInProgress()}>
            <EmbeddedVoiceCallInProgressPage
              onEndCallClicked={endCall}
              callDuration={'0.00'}
              onMuteClick={muteClick}
            />
          </Route>
          <Route path={routes.clickToCallPermissions()}>
            <MicrophonePermissions
              onStartCallClicked={() =>
                startCall({
                  onConnect,
                  onDisconnect,
                  onError,
                  onReady,
                  onAccept,
                  subdomain,
                  serviceUrl,
                  nickname
                })
              }
            />
          </Route>
          <Route path={routes.clickToCallConsent()}>
            <ConsentToRecord
              onStartCallClicked={() =>
                startCall({
                  onConnect,
                  onDisconnect,
                  onError,
                  onReady,
                  onAccept,
                  subdomain,
                  serviceUrl,
                  nickname
                })
              }
            />
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
