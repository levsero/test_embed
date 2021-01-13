import { useSelector } from 'react-redux'
import { Device } from 'twilio-client'
import logger from 'src/util/logger'
import { getTalkNickname, getTalkServiceUrl } from 'src/redux/modules/selectors'
import { getZendeskHost } from 'utility/globals'
import superagent from 'superagent'
import { getRecordingConsent } from 'embeds/talk/selectors'

export const microphoneErrorCode = 31208
let device, connection

const getToken = async (subdomain, serviceUrl, nickname) => {
  try {
    const response = await superagent
      .post(`${serviceUrl}/api/v2/channels/talk_embeddables/web/access_token`)
      .send({
        nickname,
        subdomain
      })
      .set({ 'Content-Type': 'application/json' })

    return response.body?.token
  } catch (error) {
    logger.error(error)
  }
}

const muteClick = muted => {
  connection?.mute(muted)
}

const endTwilioConnection = async () => {
  await connection?.disconnect()
  connection = null
}

const isInCall = () => Boolean(connection)

export const useTwilioDevice = ({
  onError,
  onUnsupported,
  onConnect,
  onDisconnect,
  onReady,
  onAccept
}) => {
  const serviceUrl = useSelector(getTalkServiceUrl)
  const nickname = useSelector(getTalkNickname)
  const userRecordingConsent = useSelector(getRecordingConsent)
  const subdomain = getZendeskHost(document).split('.')[0]

  const startTwilioConnection = async () => {
    try {
      device = new Device()

      device.on('error', error => {
        endTwilioConnection()
        onError?.(error)
      })

      device.on('connect', () => {
        onConnect?.()
      })

      device.on('disconnect', async connection => {
        onDisconnect?.(connection)
        connection = null
        await device?.destroy()
        device = null
      })

      device.on('ready', async () => {
        connection = await device?.connect({
          source: 'web-widget',
          user_agent: navigator.userAgent,
          ...(userRecordingConsent ? { recording_consent: userRecordingConsent } : {})
        })

        connection.on('accept', event => {
          onAccept?.(event)
        })

        onReady?.()
      })

      const token = await getToken(subdomain, serviceUrl, nickname)

      device.setup(token)
    } catch (e) {
      onError(e)
    }
  }

  if (!Device.isSupported) {
    onUnsupported?.()
  }

  return {
    startTwilioConnection,
    muteClick,
    endTwilioConnection,
    isInCall
  }
}
