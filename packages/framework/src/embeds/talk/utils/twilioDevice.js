import { Device } from 'twilio-client'
import logger from 'src/util/logger'

let connection, device

// Override this to just  return the token you've pulled from console until the endpoint works
const getToken = async (subdomain, serviceUrl, nickname) => {
  try {
    const response = await fetch(
      `${serviceUrl}/api/v2/channels/talk_embeddables/web/access_token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nickname: nickname,
          subdomain
        })
      }
    )

    const json = await response.json()

    return json.token
  } catch (error) {
    logger.error(error)
  }
}

const startCall = async ({
  onConnect,
  onDisconnect,
  onError,
  onReady,
  onAccept,
  subdomain,
  serviceUrl,
  nickname
}) => {
  const token = await getToken(subdomain, serviceUrl, nickname)

  // kill any existing connections before attempting to start a call
  device?.destroy()

  device = new Device()
  device.setup(token)

  device.on('error', error => {
    onError?.(error)
  })

  device.on('connect', () => {
    onConnect?.()
  })

  device.on('disconnect', () => {
    connection = null
    onDisconnect?.()
  })

  device.on('ready', () => {
    connection = device.connect({
      source: 'web-widget',
      recording_consent: 'opted-in',
      user_agent: navigator.userAgent
    })

    connection.on('accept', event => {
      onAccept(event)
    })
    onReady?.()
  })
}

const muteClick = muted => {
  connection?.mute(muted)
}

const endCall = async () => {
  device.destroy()
  connection = null
}

export { connection, device, startCall, muteClick, endCall }
