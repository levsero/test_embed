import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'

import { linkIntegration, selectIntegrationById } from 'src/apps/messenger/store/integrations'

import ChannelLink from './components/ChannelLink'

const ChannelPage = forwardRef((_props, ref) => {
  const { channelId } = useParams()
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(linkIntegration(channelId))
  }, [])

  const { linkRequest } = useSelector((state) => selectIntegrationById(state, channelId))

  return (
    <div ref={ref}>
      <p>
        <button
          onClick={() => {
            history.goBack()
          }}
        >
          Back
        </button>
      </p>
      <p>{`Channel Page with ID = ${channelId}`}</p>
      {linkRequest && (
        <ChannelLink channelId={channelId} url={linkRequest.url} qrCode={linkRequest.qrCode} />
      )}
    </div>
  )
})

export default ChannelPage
