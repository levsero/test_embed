import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Device } from 'twilio-client'
import logger from 'src/util/logger'
import { getTalkNickname, getTalkServiceUrl } from 'src/redux/modules/selectors'
import { getZendeskHost } from 'utility/globals'
import superagent from 'superagent'
import { getRecordingConsent } from 'embeds/talk/selectors'

export const microphoneErrorCode = 31208

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

export const useTwilioDevice = ({
  onError,
  onUnsupported,
  onConnect,
  onDisconnect,
  onReady,
  onAccept
}) => {
  const data = useRef({ device: null, connection: null, hasSetUp: false })
  const serviceUrl = useSelector(getTalkServiceUrl)
  const nickname = useSelector(getTalkNickname)
  const userRecordingConsent = useSelector(getRecordingConsent)
  const subdomain = getZendeskHost(document).split('.')[0]

  useEffect(() => {
    data.current.device = new Device()

    data.current.device.on('error', error => {
      onError?.(error)
    })

    data.current.device.on('connect', () => {
      onConnect?.()
    })

    data.current.device.on('disconnect', () => {
      onDisconnect?.()
    })

    data.current.device.on('ready', async () => {
      data.current.connection = await data.current.device.connect({
        source: 'web-widget',
        user_agent: navigator.userAgent,
        ...(userRecordingConsent ? { recording_consent: userRecordingConsent } : {})
      })

      data.current.connection.on('accept', event => {
        onAccept?.(event)
      })
      onReady?.()
    })

    return () => {
      data.current.device?.destroy()
    }
  }, [])

  const startCall = async () => {
    const token = await getToken(subdomain, serviceUrl, nickname)

    if (!data.current.hasSetUp) {
      await data.current.device.setup(token)
      data.current.hasSetUp = true
    } else {
      data.current.connection = data.current.device.connect({
        source: 'web-widget',
        user_agent: navigator.userAgent,
        ...(userRecordingConsent ? { recording_consent: userRecordingConsent } : {})
      })
    }
  }

  const muteClick = muted => {
    data.current.connection?.mute(muted)
  }

  const endCall = async () => {
    await data.current.connection?.disconnect()
    data.current.connection = null
  }

  if (!Device.isSupported) {
    onUnsupported?.()
  }

  return { startCall, muteClick, endCall }
}
