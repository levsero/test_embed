import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { forwardRef } from 'react'

import { linkIntegration, selectIntegrationById } from 'src/apps/messenger/store/integrations'

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

      {linkRequest && (
        <a href={linkRequest.url} target="_blank">
          CLick me
        </a>
      )}
      <div>Hellooooo</div>
      <p>{`Channel Page with ID = ${channelId}`}</p>
    </div>
  )
})

export default ChannelPage
