import React from 'react'
import { Route, Switch, Redirect, useHistory } from 'react-router-dom'
import { Device } from 'twilio-client'

import useTranslate from 'src/hooks/useTranslate'

import { Widget, Header, Main, Footer } from 'src/components/Widget'
import routes from 'src/embeds/talk/routes'
import MicrophonePermissions from './MicrophonePermissions'
import ConsentToRecord from './ConsentToRecord'
import ClickToCallInProgress from 'embeds/talk/components/ClickToCallInProgress'
import logger from 'src/util/logger'

const clickToCallPath = () => {
  return routes.clickToCallPermissions()
}

let device

// Temp hardcoded function to be replaced once Talk endpoints are ready
const getToken = async () => {
  try {
    const response = await fetch(
      'http://[replace-with-your-ngrok-subdomain].ngrok.io/twilio/token',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )

    const json = await response.json()

    return json.token
  } catch (err) {
    logger.error(err)
  }
}

const EmbeddedVoicePage = () => {
  const translate = useTranslate()
  const history = useHistory()

  const startCall = async () => {
    const token = await getToken()

    // kill any existing connections before attempting to start a call
    device?.destroy()

    device = new Device()
    device.setup(token)

    device.on('error', function(error) {
      logger.error('Twilio Device error:', error.message)
    })

    device.on('connect', function() {
      logger.log('Successfully established call!')
      history.push(routes.clickToCallInProgress())
    })

    device.on('disconnect', function() {
      logger.log('Disconnected')
      history.push(routes.clickToCallConsent())
    })

    device.on('ready', function() {
      logger.log('Twilio.Device is now ready for connections')
      device.connect()
    })
  }

  const endCall = async () => {
    logger.log('Ending call..')
    device.destroy()
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
            <ClickToCallInProgress onEndCallClicked={endCall} callDuration={'0.00'} />
          </Route>
          <Route path={routes.clickToCallPermissions()}>
            <MicrophonePermissions onStartCallClicked={startCall} />
          </Route>
          <Route path={routes.clickToCallConsent()}>
            <ConsentToRecord onStartCallClicked={startCall} />
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
