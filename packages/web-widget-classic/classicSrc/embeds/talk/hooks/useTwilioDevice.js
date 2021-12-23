import { getRecordingConsent } from 'classicSrc/embeds/talk/selectors'
import { getTalkNickname, getTalkServiceUrl } from 'classicSrc/redux/modules/selectors'
import { useSelector } from 'react-redux'
import superagent from 'superagent'
import { Device } from 'twilio-client'
import { logger, getZendeskHost } from '@zendesk/widget-shared-services'

export const microphoneErrorCode = 31208
let device, connection

const getToken = async (subdomain, serviceUrl, nickname) => {
  try {
    const response = await superagent
      .post(`${serviceUrl}/api/v2/channels/talk_embeddables/web/access_token`)
      .send({
        nickname,
        subdomain,
      })
      .set({ 'Content-Type': 'application/json' })

    return response.body?.token
  } catch (error) {
    logger.error(error)
  }
}

const muteClick = (muted) => {
  connection?.mute(muted)
}

const endTwilioConnection = async () => {
  await connection?.disconnect()
  connection = null
}

export const useTwilioDevice = ({ onError, onUnsupported, onConnect, onDisconnect }) => {
  const serviceUrl = useSelector(getTalkServiceUrl)
  const nickname = useSelector(getTalkNickname)
  const userRecordingConsent = useSelector(getRecordingConsent)
  const subdomain = getZendeskHost(document).split('.')[0]

  const startTwilioConnection = async () => {
    try {
      device = new Device()

      device.on('error', (error) => {
        endTwilioConnection()
        onError?.(error)
      })

      device.on('connect', () => {
        onConnect?.()
      })

      device.on('disconnect', async (connection) => {
        onDisconnect?.(connection)
        connection = null
        await device?.destroy()
        device = null
      })

      device.on('ready', async () => {
        connection = await device?.connect({
          source: 'web-widget',
          user_agent: navigator.userAgent,
          ...(userRecordingConsent ? { recording_consent: userRecordingConsent } : {}),
        })
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
  }
}
