import { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'
import { Device } from 'twilio-client'
import logger from 'src/util/logger'
import { getTalkNickname, getTalkServiceUrl } from 'src/redux/modules/selectors'
import { getZendeskHost } from 'utility/globals'
import superagent from 'superagent'

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

export const useTwilioDevice = ({ onError, onUnsupported, onConnect, onDisconnect, onReady }) => {
  const data = useRef({ device: null, connection: null, hasSetUp: false })

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

    data.current.device.on('ready', () => {
      data.current.connection = data.current.device.connect({
        source: 'web-widget',
        recording_consent: 'opted-in',
        user_agent: navigator.userAgent
      })
      onReady?.()
    })

    return () => {
      data.current.device?.destroy()
    }
  }, [])

  const serviceUrl = useSelector(getTalkServiceUrl)
  const nickname = useSelector(getTalkNickname)
  const subdomain = getZendeskHost(document).split('.')[0]

  const startCall = async () => {
    const token = await getToken(subdomain, serviceUrl, nickname)

    if (!data.current.hasSetUp) {
      await data.current.device.setup(token)
      data.current.hasSetUp = true
    } else {
      data.current.connection = data.current.device.connect({
        source: 'web-widget',
        recording_consent: 'opted-in',
        user_agent: navigator.userAgent
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
