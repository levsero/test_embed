import React from 'react'
import { Device } from 'twilio-client'

import useTranslate from 'src/hooks/useTranslate'
import { Widget, Header, Main, Footer } from 'src/components/Widget'

const EmbeddedVoiceTestPage = () => {
  const translate = useTranslate()
  let device

  const getToken = async () => {
    try {
      const response = await fetch('http://kari-twilio-app.ngrok.io/twilio/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const json = await response.json()

      return json.token
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(err)
    }
  }

  const onClick = async () => {
    const token = await getToken()

    // kill any existing connections before attempting to start a call
    device && device.destroy()

    device = new Device()
    device.setup(token)

    device.on('error', function(error) {
      // eslint-disable-next-line no-console
      console.error('Twilio Device error:', error.message)
    })

    device.on('connect', function() {
      // eslint-disable-next-line no-console
      console.log('Successfully established call!')
    })

    device.on('ready', function() {
      // eslint-disable-next-line no-console
      console.log('Twilio.Device is now ready for connections')
      device.connect()
    })
  }

  return (
    <Widget>
      <Header title={translate('embeddable_framework.talk.clickToCall.header.title')} />
      <Main>
        <div>hello</div>
        <button onClick={onClick}>start call</button>
        <button onClick={() => device.destroy()}>hangup</button>
      </Main>
      <Footer />
    </Widget>
  )
}

export default EmbeddedVoiceTestPage
